export type OpenAIModel =
	| 'gpt-5.2'
	| 'gpt-5.2-codex'
	| 'gpt-5'
	| 'gpt-5-mini'
	| 'gpt-5-nano'
	| 'o3'
	| 'o3-mini'
	| 'o1'
	| 'gpt-4o'
	| 'gpt-4o-mini';

export interface OpenAIConfig {
	/**
	 * OpenAI API key for authentication
	 */
	apiKey: string;

	/**
	 * Model to use for chat completion
	 */
	model: OpenAIModel;

	/**
	 * Maximum number of tokens that can be generated for completion
	 * @see https://platform.openai.com/docs/api-reference/chat/create#chat-create-max_completion_tokens
	 */
	maxCompletionTokens: number;

	/**
	 * Sampling temperature (0-2). Higher = more random
	 */
	temperature: number;
}

export interface TextContent {
	/**
	 * Content type identifier
	 */
	type: 'text';

	/**
	 * The text content
	 */
	text: string;
}

export interface ImageContent {
	/**
	 * Content type identifier
	 */
	type: 'image_url';

	/**
	 * Image URL or base64 data URL
	 */
	image_url: {
		/**
		 * URL or base64 encoded image data
		 */
		url: string;

		/**
		 * Image detail level for vision processing
		 */
		detail?: 'auto' | 'low' | 'high';
	};
}

export type MessageContent = string | (TextContent | ImageContent)[];

export interface ChatMessage {
	/**
	 * Message sender role
	 */
	role: 'system' | 'user' | 'assistant';

	/**
	 * Message content - can be text or multimodal (text + images)
	 */
	content: MessageContent;
}

export interface SimpleChatMessage {
	/**
	 * Message sender role
	 */
	role: 'system' | 'user' | 'assistant';

	/**
	 * Text-only message content
	 */
	content: string;
}

export interface ImageAttachment {
	/**
	 * Unique identifier for the attachment
	 */
	id: string;

	/**
	 * Original file object
	 */
	file: File;

	/**
	 * Base64 data URL for preview/upload
	 */
	dataUrl: string;

	/**
	 * Display name of the file
	 */
	name: string;
}

type OpenAIResponseUsage = {
	/**
	 * Number of tokens in the prompt
	 */
	promptTokens: number;

	/**
	 * Number of tokens in the completion
	 */
	completionTokens: number;

	/**
	 * Total tokens used (prompt + completion)
	 */
	totalTokens: number;
};

export interface OpenAIResponse {
	/**
	 * Generated response content
	 */
	content: string;

	/**
	 * Token usage statistics
	 */
	usage?: OpenAIResponseUsage;
}
