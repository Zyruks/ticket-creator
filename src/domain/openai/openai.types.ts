/**
 * OpenAI Domain Types
 */

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
	apiKey: string;
	model: OpenAIModel;
	maxTokens: number;
	temperature: number;
}

// Content types for vision/multimodal messages
export interface TextContent {
	type: 'text';
	text: string;
}

export interface ImageContent {
	type: 'image_url';
	image_url: {
		url: string; // Can be a URL or base64 data URL
		detail?: 'auto' | 'low' | 'high';
	};
}

export type MessageContent = string | (TextContent | ImageContent)[];

export interface ChatMessage {
	role: 'system' | 'user' | 'assistant';
	content: MessageContent;
}

// Simple message helper for text-only
export interface SimpleChatMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

// Image attachment for UI
export interface ImageAttachment {
	id: string;
	file: File;
	dataUrl: string;
	name: string;
}

export interface OpenAIResponse {
	content: string;
	usage?: {
		promptTokens: number;
		completionTokens: number;
		totalTokens: number;
	};
}

export const DEFAULT_OPENAI_CONFIG: OpenAIConfig = {
	apiKey: '',
	model: 'gpt-5-mini',
	maxTokens: 2000,
	temperature: 0.7,
};
