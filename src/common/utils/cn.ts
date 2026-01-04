/**
 * Merges class names with Tailwind CSS conflict resolution.
 *
 * @param inputs - Class names, arrays, or objects to merge.
 * @returns The merged class string.
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
