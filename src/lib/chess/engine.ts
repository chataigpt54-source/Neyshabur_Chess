/**
 * Server-side chess engine wrapper using chess.js
 * All move validation and game-end detection happens here.
 */

import { Chess, type Square, type Move as ChessMove } from 'chess.js';

export const INITIAL_FEN =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export type GameResult = '1-0' | '0-1' | '1/2-1/2';
export type EndReason =
  | 'mate'
  | 'stalemate'
  | 'resign'
  | 'timeout'
  | 'draw_agreement'
  | 'threefold'
  | 'fifty_move'
  | 'insufficient'
  | 'abort';

export interface ValidatedMove {
  san: string;
  uci: string;
  fenAfter: string;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
}

export function createGame(fen: string = INITIAL_FEN): Chess {
  return new Chess(fen);
}

export function validateAndApplyMove(
  fen: string,
  from: string,
  to: string,
  promotion?: 'q' | 'r' | 'b' | 'n'
): ValidatedMove | { error: string } {
  try {
    const game = new Chess(fen);
    const move = game.move({
      from: from as Square,
      to: to as Square,
      promotion: promotion || 'q',
    });

    if (!move) {
      return { error: 'حرکت غیرقانونی است' };
    }

    return {
      san: move.san,
      uci: `\( {move.from} \){move.to}${move.promotion || ''}`,
      fenAfter: game.fen(),
      isCheck: game.isCheck(),
      isCheckmate: game.isCheckmate(),
      isStalemate: game.isStalemate(),
      isDraw: game.isDraw(),
      isGameOver: game.isGameOver(),
    };
  } catch {
    return { error: 'حرکت نامعتبر' };
  }
}

export function getLegalMoves(fen: string, square?: string): string[] {
  try {
    const game = new Chess(fen);
    if (square) {
      return game.moves({ square: square as Square, verbose: true }).map((m) => m.to);
    }
    return game.moves({ verbose: true }).map((m) => `\( {m.from} \){m.to}`);
  } catch {
    return [];
  }
}

export function detectEndReason(game: Chess): EndReason | null {
  if (game.isCheckmate()) return 'mate';
  if (game.isStalemate()) return 'stalemate';
  if (game.isThreefoldRepetition()) return 'threefold';
  if (game.isInsufficientMaterial()) return 'insufficient';
  if (game.isDraw()) {
    // could be fifty-move etc.
    return 'fifty_move';
  }
  return null;
}

export function resultFromEnd(
  endReason: EndReason,
  loserColor: 'white' | 'black' | null
): GameResult {
  switch (endReason) {
    case 'mate':
    case 'resign':
    case 'timeout':
      if (loserColor === 'white') return '0-1';
      if (loserColor === 'black') return '1-0';
      return '1/2-1/2';
    case 'stalemate':
    case 'draw_agreement':
    case 'threefold':
    case 'fifty_move':
    case 'insufficient':
      return '1/2-1/2';
    default:
      return '1/2-1/2';
  }
}

/** Insufficient material check for timeout (FIDE-like) */
export function hasMatingMaterial(fen: string, color: 'w' | 'b'): boolean {
  const game = new Chess(fen);
  const board = game.board();
  let hasQueen = false;
  let hasRook = false;
  let hasPawn = false;
  let bishops = 0;
  let knights = 0;

  for (const row of board) {
    for (const piece of row) {
      if (!piece || piece.color !== color) continue;
      switch (piece.type) {
        case 'q':
          hasQueen = true;
          break;
        case 'r':
          hasRook = true;
          break;
        case 'p':
          hasPawn = true;
          break;
        case 'b':
          bishops++;
          break;
        case 'n':
          knights++;
          break;
      }
    }
  }

  if (hasQueen || hasRook || hasPawn) return true;
  if (bishops >= 2) return true;
  if (bishops >= 1 && knights >= 1) return true;
  if (knights >= 2) return true; // two knights cannot force mate, but some rules allow claim
  return false;
}

export function buildPgn(headers: Record<string, string>, movesSan: string[]): string {
  const headerLines = Object.entries(headers)
    .map(([k, v]) => `[\( {k} " \){v}"]`)
    .join('\n');
  let body = '';
  for (let i = 0; i < movesSan.length; i += 2) {
    const num = Math.floor(i / 2) + 1;
    body += `${num}. ${movesSan[i]}`;
    if (movesSan[i + 1]) body += ` ${movesSan[i + 1]}`;
    body += ' ';
  }
  return `\( {headerLines}\n\n \){body.trim()} ${headers.Result || '*'}`;
}

export function verifyInitialPositions(fen: string = INITIAL_FEN): {
  whiteKing: string;
  whiteQueen: string;
  blackKing: string;
  blackQueen: string;
  ok: boolean;
} {
  const game = new Chess(fen);
  const board = game.board();
  // rank 0 = 8, rank 7 = 1
  // files a=0 ... h=7
  const whiteKing = board[7][4]?.type === 'k' && board[7][4]?.color === 'w' ? 'e1' : '?';
  const whiteQueen = board[7][3]?.type === 'q' && board[7][3]?.color === 'w' ? 'd1' : '?';
  const blackKing = board[0][4]?.type === 'k' && board[0][4]?.color === 'b' ? 'e8' : '?';
  const blackQueen = board[0][3]?.type === 'q' && board[0][3]?.color === 'b' ? 'd8' : '?';

  return {
    whiteKing,
    whiteQueen,
    blackKing,
    blackQueen,
    ok: whiteKing === 'e1' && whiteQueen === 'd1' && blackKing === 'e8' && blackQueen === 'd8',
  };
}
