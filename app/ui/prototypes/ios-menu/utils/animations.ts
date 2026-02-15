interface SpringConfig {
  stiffness: number;
  damping: number;
}

interface TransitionConfig {
  visualDuration: number;
  bounce: number;
}

export const transitionConfig: TransitionConfig = {
  visualDuration: 0.25,
  bounce: 0.2,
};

export const contentTransitionConfig: TransitionConfig = {
  visualDuration: 0.3,
  bounce: 0.2,
};

export const reducedMotionSpring: SpringConfig = {
  stiffness: 1000,
  damping: 100,
};

// Content delay (ms)
export const CONTENT_ENTER_DELAY = 0.08;

// Blur amounts
export const TRIGGER_BLUR = 8;
export const CONTENT_BLUR = 8;
