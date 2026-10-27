/**
 * Server-authoritative chess clock logic.
 * Browser only displays; never decides results.
 */

export type ActiveColor = 'white' | 'black' | null;

export interface ClockState {
  whiteClockMs: number;
  blackClockMs: number;
  activeColor: ActiveColor;
  clockStartedAt: string | null; // ISO
  incrementSeconds: number;
  status: 'pending' | 'ongoing' | 'finished' | 'aborted';
  version: number;
}

export function computeRemaining(
  state: ClockState,
  serverNowMs: number
): { whiteMs: number; blackMs: number } {
  if (
    state.status !== 'ongoing' ||
    !state.activeColor ||
    !state.clockStartedAt
  ) {
    return {
      whiteMs: Math.max(0, state.whiteClockMs),
      blackMs: Math.max(0, state.blackClockMs),
    };
  }

  const started = new Date(state.clockStartedAt).getTime();
  const elapsed = Math.max(0, serverNowMs - started);

  if (state.activeColor === 'white') {
    return {
      whiteMs: Math.max(0, state.whiteClockMs - elapsed),
      blackMs: Math.max(0, state.blackClockMs),
    };
  }
  return {
    whiteMs: Math.max(0, state.whiteClockMs),
    blackMs: Math.max(0, state.blackClockMs - elapsed),
  };
}

/**
 * Apply a legal move on the clock side.
 * Must be called inside a DB transaction after move validation.
 */
export function applyMoveToClock(
  state: ClockState,
  serverNowMs: number
): {
  newState: Partial<ClockState>;
  timedOut: boolean;
  timedOutColor: ActiveColor;
} {
  const remaining = computeRemaining(state, serverNowMs);
  const timedOut =
    (state.activeColor === 'white' && remaining.whiteMs <= 0) ||
    (state.activeColor === 'black' && remaining.blackMs <= 0);

  if (timedOut) {
    return {
      newState: {
        whiteClockMs: remaining.whiteMs,
        blackClockMs: remaining.blackMs,
        activeColor: null,
        clockStartedAt: null,
        status: 'finished',
      },
      timedOut: true,
      timedOutColor: state.activeColor,
    };
  }

  // Deduct elapsed, add increment to the player who just moved, switch side
  const justMoved = state.activeColor!;
  const nextColor = justMoved === 'white' ? 'black' : 'white';

  let white = remaining.whiteMs;
  let black = remaining.blackMs;

  if (justMoved === 'white') {
    white += state.incrementSeconds * 1000;
  } else {
    black += state.incrementSeconds * 1000;
  }

  return {
    newState: {
      whiteClockMs: white,
      blackClockMs: black,
      activeColor: nextColor,
      clockStartedAt: new Date(serverNowMs).toISOString(),
      version: state.version + 1,
    },
    timedOut: false,
    timedOutColor: null,
  };
}

export function formatClockMs(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remMin = minutes % 60;
    return `\( {String(hours).padStart(2, '0')}: \){String(remMin).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `\( {String(minutes).padStart(2, '0')}: \){String(seconds).padStart(2, '0')}`;
}
