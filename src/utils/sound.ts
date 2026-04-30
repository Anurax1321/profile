/**
 * Lightweight, side-effect-safe wrapper for one-shot UI sound effects.
 *
 * Browsers gate audio on a user gesture, so all calls swallow rejection
 * silently. Missing files are also no-ops, which lets us reference assets
 * the user will drop in later (e.g. /click.mp3) without breaking dev builds.
 */

let audioCache: Map<string, HTMLAudioElement> | null = null;

function getCache(): Map<string, HTMLAudioElement> {
  if (audioCache === null) {
    audioCache = new Map();
  }
  return audioCache;
}

export function playSound(src: string, volume = 0.4): void {
  if (typeof window === 'undefined') return;
  try {
    const cache = getCache();
    let base = cache.get(src);
    if (!base) {
      base = new Audio(src);
      base.preload = 'auto';
      cache.set(src, base);
    }
    // Clone so rapid repeat clicks can overlap.
    const instance = base.cloneNode(true) as HTMLAudioElement;
    instance.volume = volume;
    void instance.play().catch(() => {
      // Autoplay blocked or file missing; safe to ignore.
    });
  } catch {
    // Defensive: never let a sound failure surface as a UI error.
  }
}
