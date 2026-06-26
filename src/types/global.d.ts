export {};

declare global {
  interface Window {
    /** Set true once the intro/preloader completes. */
    __luminaReady?: boolean;
  }
}
