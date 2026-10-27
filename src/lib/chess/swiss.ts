/**
 * Swiss pairing algorithm (practical, not full FIDE C.04).
 * Documented limitation: does not implement full FIDE Dutch system
 * or accelerated pairings. Suitable for club-level events up to \~100 players.
 */

export interface SwissPlayer {
  id: string;
  score: number;
  colorBalance: number; // cumulative +white -black
  opponents: string[]; // previous opponent ids
  isActive: boolean;
  byeCount: number;
}

export interface Pairing {
  whiteId: string | null;
  blackId: string | null;
  isBye: boolean;
}

/**
 * Pair players for the next round.
 * - Sort by score descending
 * - Prefer opponents with similar score
 * - Avoid rematches when possible
 * - Balance colors
 * - Give bye to lowest-score eligible player when odd number
 */
export function pairSwissRound(
  players: SwissPlayer[],
  byeScore: number = 1
): { pairings: Pairing[]; byePlayerId: string | null } {
  const active = players
    .filter((p) => p.isActive)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.colorBalance - b.colorBalance; // prefer those who had fewer whites
    });

  const pairings: Pairing[] = [];
  const paired = new Set<string>();
  let byePlayerId: string | null = null;

  // Odd number → bye for lowest score player who has not had a bye recently
  if (active.length % 2 === 1) {
    const candidates = [...active].reverse(); // lowest first
    const byeCandidate =
      candidates.find((p) => p.byeCount === 0) || candidates[0];
    if (byeCandidate) {
      byePlayerId = byeCandidate.id;
      paired.add(byeCandidate.id);
      pairings.push({
        whiteId: byeCandidate.id,
        blackId: null,
        isBye: true,
      });
    }
  }

  // Greedy pairing within score groups
  for (let i = 0; i < active.length; i++) {
    const p1 = active[i];
    if (paired.has(p1.id)) continue;

    let best: SwissPlayer | null = null;
    let bestScore = Infinity;

    for (let j = i + 1; j < active.length; j++) {
      const p2 = active[j];
      if (paired.has(p2.id)) continue;
      if (p1.opponents.includes(p2.id)) continue; // avoid rematch

      const scoreDiff = Math.abs(p1.score - p2.score);
      // Prefer similar score and color balance
      const colorPenalty =
        (p1.colorBalance > 0 && p2.colorBalance > 0) ||
        (p1.colorBalance < 0 && p2.colorBalance < 0)
          ? 0.5
          : 0;
      const cost = scoreDiff + colorPenalty;

      if (cost < bestScore) {
        bestScore = cost;
        best = p2;
      }
    }

    // Fallback: allow rematch if no alternative
    if (!best) {
      for (let j = i + 1; j < active.length; j++) {
        const p2 = active[j];
        if (paired.has(p2.id)) continue;
        best = p2;
        break;
      }
    }

    if (best) {
      // Assign colors: prefer player with fewer whites to take white
      let whiteId = p1.id;
      let blackId = best.id;
      if (p1.colorBalance > best.colorBalance) {
        whiteId = best.id;
        blackId = p1.id;
      } else if (
        p1.colorBalance === best.colorBalance &&
        Math.random() < 0.5
      ) {
        whiteId = best.id;
        blackId = p1.id;
      }

      pairings.push({ whiteId, blackId, isBye: false });
      paired.add(p1.id);
      paired.add(best.id);
    }
  }

  return { pairings, byePlayerId };
}

export function updateScoresAfterGame(
  whiteId: string,
  blackId: string | null,
  result: '1-0' | '0-1' | '1/2-1/2' | null,
  isBye: boolean,
  byeScore: number = 1
): { whiteDelta: number; blackDelta: number } {
  if (isBye) {
    return { whiteDelta: byeScore, blackDelta: 0 };
  }
  if (result === '1-0') return { whiteDelta: 1, blackDelta: 0 };
  if (result === '0-1') return { whiteDelta: 0, blackDelta: 1 };
  if (result === '1/2-1/2') return { whiteDelta: 0.5, blackDelta: 0.5 };
  return { whiteDelta: 0, blackDelta: 0 };
}
