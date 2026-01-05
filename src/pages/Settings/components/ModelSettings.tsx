import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components';
import { supportsTemperature, type OpenAIModel } from '@domain';

const MODELS: { value: OpenAIModel; label: string; description: string }[] = [
	{ value: 'gpt-5.2', label: 'GPT-5.2', description: 'Best for coding and agentic tasks' },
	{
		value: 'gpt-5.2-codex',
		label: 'GPT-5.2 Codex',
		description: 'Advanced coding, large codebases',
	},
	{ value: 'gpt-5', label: 'GPT-5', description: 'Flagship model, complex reasoning' },
	{ value: 'gpt-5-mini', label: 'GPT-5 Mini', description: 'Fast, cost-effective, great quality' },
	{ value: 'gpt-5-nano', label: 'GPT-5 Nano', description: 'Fastest, real-time tasks' },
	{ value: 'o3', label: 'o3', description: 'Advanced reasoning, multi-step problems' },
	{ value: 'o3-mini', label: 'o3-mini', description: 'Efficient reasoning, configurable effort' },
	{ value: 'o1', label: 'o1', description: 'Deep reasoning for difficult problems' },
	{ value: 'gpt-4o', label: 'GPT-4o', description: 'Multimodal, great all-rounder' },
	{ value: 'gpt-4o-mini', label: 'GPT-4o Mini', description: 'Lightweight, legacy support' },
];

interface ModelSettingsProps {
	/**
	 * Maximum completion tokens value.
	 */
	maxCompletionTokens: number;
	/**
	 * Current OpenAI model.
	 */
	model: OpenAIModel;
	/**
	 * Temperature value.
	 */
	temperature: number;
	/**
	 * Callback to set max completion tokens.
	 */
	setMaxCompletionTokens: (tokens: number) => void;
	/**
	 * Callback to set the model.
	 */
	setModel: (model: OpenAIModel) => void;
	/**
	 * Callback to set temperature.
	 */
	setTemperature: (temp: number) => void;
}

export const ModelSettings = ({
	model,
	setModel,
	maxCompletionTokens,
	setMaxCompletionTokens,
	temperature,
	setTemperature,
}: ModelSettingsProps) => {
	const selectedModel = MODELS.find((m) => m.value === model);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Model Settings</CardTitle>
				<CardDescription>Choose the AI model and adjust generation parameters</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="model">Model</Label>
					<Select
						value={model}
						onValueChange={(v) => setModel(v as OpenAIModel)}
					>
						<SelectTrigger
							id="model"
							className="w-full"
						>
							<SelectValue placeholder="Select a model" />
						</SelectTrigger>
						<SelectContent>
							{MODELS.map((modelOption) => (
								<SelectItem
									key={modelOption.value}
									value={modelOption.value}
								>
									{modelOption.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{selectedModel && <p className="text-muted-foreground text-xs">{selectedModel.description}</p>}
				</div>

				<div className="space-y-2">
					<Label htmlFor="maxCompletionTokens">Max Completion Tokens</Label>
					<Input
						id="maxCompletionTokens"
						type="number"
						value={maxCompletionTokens}
						onChange={(event) => setMaxCompletionTokens(Number(event.target.value))}
						min={100}
						max={16000}
					/>
					<p className="text-muted-foreground text-xs">Maximum tokens for completion output (100-16000)</p>
				</div>

				{supportsTemperature(model) && (
					<div className="space-y-2">
						<Label htmlFor="temperature">Temperature: {temperature}</Label>
						<Input
							id="temperature"
							type="range"
							value={temperature}
							onChange={(event) => setTemperature(Number(event.target.value))}
							min={0}
							max={1}
							step={0.1}
							className="cursor-pointer"
						/>
						<p className="text-muted-foreground text-xs">Lower = more focused, Higher = more creative</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
