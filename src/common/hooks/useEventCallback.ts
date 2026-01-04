import { useCallback, useRef } from 'react';

/**
 * A hook that returns a stable callback reference that always points to the latest function.
 * Useful for callbacks that need to be passed as dependencies but shouldn't trigger re-renders.
 */
export function useEventCallback<T extends (...args: unknown[]) => unknown>(callback: T): T {
	const callbackRef = useRef(callback);

	// Update the ref on every render
	callbackRef.current = callback;

	// Return a stable function that calls the latest callback
	return useCallback((...args: Parameters<T>) => {
		return callbackRef.current(...args);
	}, []) as T;
}
