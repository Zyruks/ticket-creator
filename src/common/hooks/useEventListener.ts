import { useEffect, useRef } from 'react';

type EventMap = WindowEventMap & {
	'local-storage': CustomEvent;
};

/**
 * A hook that adds an event listener to the window or a target element.
 * Automatically cleans up on unmount.
 */
export function useEventListener<K extends keyof EventMap>(
	eventName: K,
	handler: (event: EventMap[K]) => void,
	element?: Window | HTMLElement | null
): void {
	const savedHandler = useRef(handler);

	// Update ref on every render so we always have the latest handler
	savedHandler.current = handler;

	useEffect(() => {
		const targetElement = element ?? window;

		if (!targetElement?.addEventListener) {
			return;
		}

		const eventListener = (event: Event) => {
			savedHandler.current(event as EventMap[K]);
		};

		targetElement.addEventListener(eventName, eventListener);

		return () => {
			targetElement.removeEventListener(eventName, eventListener);
		};
	}, [eventName, element]);
}
