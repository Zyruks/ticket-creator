import OpenAI from 'openai';
import type { ChatMessage, OpenAIConfig, OpenAIResponse, TextContent } from '../types';

type ChatCompletionMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

/**
 * Create an OpenAI client instance
 */
export function createOpenAIClient(apiKey: string): OpenAI {
	return new OpenAI({
		apiKey,
		dangerouslyAllowBrowser: true,
	});
}

/**
 * Validate an API key by making a simple request
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
	try {
		const client = createOpenAIClient(apiKey);
		await client.models.list();
		return true;
	} catch {
		return false;
	}
}

/**
 * Convert our ChatMessage to OpenAI's format
 */
function toOpenAIMessage(message: ChatMessage): ChatCompletionMessage {
	if (typeof message.content === 'string') {
		return {
			role: message.role,
			content: message.content,
		} as ChatCompletionMessage;
	}

	// For multimodal content (images), only user messages support this
	if (message.role === 'user') {
		return {
			role: 'user',
			content: message.content.map((part) => {
				if (part.type === 'text') {
					return { type: 'text' as const, text: part.text };
				}
				return {
					type: 'image_url' as const,
					image_url: {
						url: part.image_url.url,
						detail: part.image_url.detail || 'auto',
					},
				};
			}),
		};
	}

	// For system/assistant, flatten to text
	const textContent = message.content
		.filter((part) => part.type === 'text')
		.map((part) => (part as TextContent).text)
		.join('\n');

	return {
		role: message.role,
		content: textContent,
	} as ChatCompletionMessage;
}

/**
 * Send a chat completion request to OpenAI
 */
export async function sendChatCompletion(
	config: OpenAIConfig,
	messages: ChatMessage[],
): Promise<OpenAIResponse> {
	const client = createOpenAIClient(config.apiKey);

	const response = await client.chat.completions.create({
		model: config.model,
		messages: messages.map(toOpenAIMessage),
		max_tokens: config.maxTokens,
		temperature: config.temperature,
	});

	const choice = response.choices[0];

	return {
		content: choice?.message?.content || '',
		usage: response.usage
			? {
					promptTokens: response.usage.prompt_tokens,
					completionTokens: response.usage.completion_tokens,
					totalTokens: response.usage.total_tokens,
				}
			: undefined,
	};
}

/**
 * Stream a chat completion response from OpenAI
 */
export async function* streamChatCompletion(
	config: OpenAIConfig,
	messages: ChatMessage[],
): AsyncGenerator<string, void, unknown> {
	const client = createOpenAIClient(config.apiKey);

	const stream = await client.chat.completions.create({
		model: config.model,
		messages: messages.map(toOpenAIMessage),
		max_tokens: config.maxTokens,
		temperature: config.temperature,
		stream: true,
	});

	for await (const chunk of stream) {
		const content = chunk.choices[0]?.delta?.content;
		if (content) {
			yield content;
		}
	}
}
