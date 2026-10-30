import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` during server rendering and the first client paint, `true` afterwards.
 * Lets components render theme-dependent UI without a setState-in-effect.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
