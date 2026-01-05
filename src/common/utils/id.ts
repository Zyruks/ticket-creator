/**
 * Generates a unique identifier with a given prefix
 * @param prefix - The prefix to use for the ID (e.g., 'ticket', 'example')
 * @returns A unique ID string in the format: `{prefix}-{timestamp}-{random}`
 * @example
 * generateId('ticket') // 'ticket-1699564800123-x7k9m2p'
 * generateId('example') // 'example-1699564800124-a3f5n8q'
 */
export function generateId(prefix: string): string {
	return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generates a timestamp in ISO 8601 format
 * @returns Current timestamp as an ISO string
 * @example
 * getTimestamp() // '2024-01-15T10:30:45.123Z'
 */
export function getTimestamp(): string {
	return new Date().toISOString();
}
