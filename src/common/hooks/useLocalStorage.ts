import { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from 'react';
import { useEventCallback } from './useEventCallback';
import { useEventListener } from './useEventListener';

declare global {
	interface WindowEventMap {
		'local-storage': CustomEvent;
	}
}

interface UseLocalStorageOptions<T> {
	/**
	 * The key to use in localStorage.
	 */
	key: string;

	/**
	 * The initial value to use if no value is found in localStorage.
	 * Can be a static value or a function that returns the value.
	 */
	initialValue: T | (() => T);

	/**
	 * Function to serialize the value before storing.
	 * @default JSON.stringify
	 */
	serializer?: (value: T) => string;

	/**
	 * Function to deserialize the value from storage.
	 * @default JSON.parse
	 */
	deserializer?: (value: string) => T;

	/**
	 * Whether to initialize the state with the value from storage.
	 * @default true
	 */
	initializeWithValue?: boolean;
}

interface UseLocalStorageReturn<T> {
	/**
	 * The current value.
	 */
	value: T;

	/**
	 * Function to update the value.
	 */
	setValue: Dispatch<SetStateAction<T>>;

	/**
	 * Function to remove the value from localStorage.
	 */
	remove: () => void;
}

const IS_SERVER = typeof window === 'undefined';

/**
 * Custom hook that uses the localStorage API to persist state across page reloads.
 * Based on usehooks-ts implementation.
 *
 * @param options - Configuration options.
 * @returns Object containing value, setValue, and remove.
 */
export function useLocalStorage<T>(options: UseLocalStorageOptions<T>): UseLocalStorageReturn<T> {
	const {
		key,
		initialValue,
		initializeWithValue = true,
		serializer: customSerializer,
		deserializer: customDeserializer,
	} = options;

	const serializer = useCallback<(value: T) => string>(
		(value) => {
			if (customSerializer) {
				return customSerializer(value);
			}
			return JSON.stringify(value);
		},
		[customSerializer],
	);

	const deserializer = useCallback<(value: string) => T>(
		(value) => {
			if (customDeserializer) {
				return customDeserializer(value);
			}

			// Support 'undefined' as a value
			if (value === 'undefined') {
				return undefined as unknown as T;
			}

			const defaultValue = initialValue instanceof Function ? initialValue() : initialValue;

			let parsed: unknown;
			try {
				parsed = JSON.parse(value);
			} catch (error) {
				console.error('Error parsing JSON:', error);
				return defaultValue;
			}

			return parsed as T;
		},
		[customDeserializer, initialValue],
	);

	const readValue = useCallback((): T => {
		const initialValueToUse = initialValue instanceof Function ? initialValue() : initialValue;

		if (IS_SERVER) {
			return initialValueToUse;
		}

		try {
			const raw = window.localStorage.getItem(key);
			return raw ? deserializer(raw) : initialValueToUse;
		} catch (error) {
			console.warn(`Error reading localStorage key "${key}":`, error);
			return initialValueToUse;
		}
	}, [initialValue, key, deserializer]);

	const [storedValue, setStoredValue] = useState(() => {
		if (initializeWithValue) {
			return readValue();
		}
		return initialValue instanceof Function ? initialValue() : initialValue;
	});

	const setValue: Dispatch<SetStateAction<T>> = useEventCallback((value) => {
		if (IS_SERVER) {
			console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`);
			return;
		}

		try {
			const newValue = value instanceof Function ? value(readValue()) : value;
			window.localStorage.setItem(key, serializer(newValue));
			setStoredValue(newValue);
			window.dispatchEvent(new StorageEvent('local-storage', { key }));
		} catch (error) {
			console.warn(`Error setting localStorage key "${key}":`, error);
		}
	});

	const remove = useEventCallback(() => {
		if (IS_SERVER) {
			console.warn(`Tried removing localStorage key "${key}" even though environment is not a client`);
			return;
		}

		const defaultValue = initialValue instanceof Function ? initialValue() : initialValue;
		window.localStorage.removeItem(key);
		setStoredValue(defaultValue);
		window.dispatchEvent(new StorageEvent('local-storage', { key }));
	});

	useEffect(() => {
		setStoredValue(readValue());
	}, [readValue]);

	const handleStorageChange = useCallback(
		(event: StorageEvent | CustomEvent) => {
			if ((event as StorageEvent).key && (event as StorageEvent).key !== key) {
				return;
			}
			setStoredValue(readValue());
		},
		[key, readValue],
	);

	// Updated to use new useEventListener signature (options object)
	useEventListener({ eventName: 'storage', handler: handleStorageChange });
	useEventListener({ eventName: 'local-storage', handler: handleStorageChange });

	return { value: storedValue, setValue, remove };
}
