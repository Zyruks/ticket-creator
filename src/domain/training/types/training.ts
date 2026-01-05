export interface TrainingExample {
	/**
	 * Unique identifier for the example
	 */
	id: string;

	/**
	 * Example input/request
	 */
	input: string;

	/**
	 * Expected output/response
	 */
	output: string;

	/**
	 * ISO timestamp when example was created
	 */
	createdAt: string;

	/**
	 * ISO timestamp when example was last updated
	 */
	updatedAt: string;
}
