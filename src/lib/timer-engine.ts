// ── Reusable timer engine for combo sessions + standalone timer ───────────────

export type TimerCallbacks = {
  onTick?: (state: TimerState) => void;
  onRoundStart?: (round: number) => void;
  onRoundEnd?: (round: number) => void;
  onRestStart?: (round: number) => void;
  onRestEnd?: (round: number) => void;
  onWarning?: (secondsLeft: number) => void;
  onComplete?: () => void;
};

export type TimerState = {
  roundLength: number;
  restLength: number;
  numRounds: number;
  warmupLength: number;
  currentRound: number;
  timeRemaining: number;
  isResting: boolean;
  isPaused: boolean;
  isComplete: boolean;
  isWarmup: boolean;
  elapsedInPhase: number;
};

export type TimerConfig = {
  roundLength: number;
  restLength: number;
  numRounds: number;
  warmupLength: number;
  tenSecondWarning: boolean;
};

export class TimerEngine {
  private state: TimerState;
  private config: TimerConfig;
  private callbacks: TimerCallbacks;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private warningFired = false;

  constructor(config: TimerConfig, callbacks: TimerCallbacks) {
    this.config = config;
    this.callbacks = callbacks;
    this.state = {
      roundLength: config.roundLength,
      restLength: config.restLength,
      numRounds: config.numRounds,
      warmupLength: config.warmupLength,
      currentRound: 0,
      timeRemaining: config.warmupLength > 0 ? config.warmupLength : config.roundLength,
      isResting: false,
      isPaused: false,
      isComplete: false,
      isWarmup: config.warmupLength > 0,
      elapsedInPhase: 0,
    };
  }

  getState(): TimerState {
    return { ...this.state };
  }

  start() {
    if (this.state.isWarmup) {
      this.state.timeRemaining = this.config.warmupLength;
    } else {
      this.state.currentRound = 1;
      this.state.timeRemaining = this.config.roundLength;
      this.callbacks.onRoundStart?.(1);
    }
    this.state.elapsedInPhase = 0;
    this.warningFired = false;
    this.startInterval();
  }

  pause() {
    this.state.isPaused = true;
    this.stopInterval();
  }

  resume() {
    this.state.isPaused = false;
    this.startInterval();
  }

  stop() {
    this.stopInterval();
    this.state.isComplete = true;
  }

  tick() {
    if (this.state.isPaused || this.state.isComplete) return;

    this.state.timeRemaining = Math.max(0, this.state.timeRemaining - 0.1);
    this.state.elapsedInPhase += 0.1;

    // 10-second warning
    if (
      this.config.tenSecondWarning &&
      !this.state.isResting &&
      !this.state.isWarmup &&
      !this.warningFired &&
      this.state.timeRemaining <= 10 &&
      this.state.timeRemaining > 9.8
    ) {
      this.warningFired = true;
      this.callbacks.onWarning?.(10);
    }

    // 3-2-1 countdown during rest
    if (this.state.isResting && this.state.timeRemaining <= 3 && this.state.timeRemaining > 0) {
      const rounded = Math.round(this.state.timeRemaining);
      if (Math.abs(this.state.timeRemaining - rounded) < 0.06 && rounded > 0) {
        this.callbacks.onWarning?.(rounded);
      }
    }

    this.callbacks.onTick?.(this.getState());

    // Phase end
    if (this.state.timeRemaining <= 0) {
      this.handlePhaseEnd();
    }
  }

  private handlePhaseEnd() {
    if (this.state.isWarmup) {
      // Warmup → Round 1
      this.state.isWarmup = false;
      this.state.currentRound = 1;
      this.state.timeRemaining = this.config.roundLength;
      this.state.elapsedInPhase = 0;
      this.warningFired = false;
      this.callbacks.onRoundStart?.(1);
    } else if (this.state.isResting) {
      // Rest → Next round
      this.state.isResting = false;
      this.state.currentRound++;
      this.state.timeRemaining = this.config.roundLength;
      this.state.elapsedInPhase = 0;
      this.warningFired = false;
      this.callbacks.onRestEnd?.(this.state.currentRound - 1);
      this.callbacks.onRoundStart?.(this.state.currentRound);
    } else {
      // Round end
      this.callbacks.onRoundEnd?.(this.state.currentRound);

      if (this.state.currentRound >= this.config.numRounds) {
        // Session complete
        this.state.isComplete = true;
        this.stopInterval();
        this.callbacks.onComplete?.();
      } else {
        // Start rest
        this.state.isResting = true;
        this.state.timeRemaining = this.config.restLength;
        this.state.elapsedInPhase = 0;
        this.warningFired = false;
        this.callbacks.onRestStart?.(this.state.currentRound);
      }
    }
  }

  private startInterval() {
    this.stopInterval();
    this.intervalId = setInterval(() => this.tick(), 100);
  }

  private stopInterval() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  destroy() {
    this.stopInterval();
  }
}
