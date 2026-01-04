import { useEffect, useRef } from 'react';

type EventMap = WindowEventMap & {
	'local-storage': CustomEvent;
};

interface UseEventListenerOptions<K extends keyof EventMap> {
	/**
	 * Name of the event to listen for.
	 */
	eventName: K;

	/**
	 * Callback function to handle the event.
	 */
	handler: (event: EventMap[K]) => void;

	/**
	 * The element to attach the listener to.
	 * @default window
	 */
	element?: Window | HTMLElement | null;
}

/**
 * A hook that adds an event listener to the window or a target element.
 * Automatically cleans up on unmount.
 *
 * @param options - Configuration options for the event listener.
 */
export function useEventListener<K extends keyof EventMap>({
	eventName,
	handler,
	element,
}: UseEventListenerOptions<K>): void {
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
