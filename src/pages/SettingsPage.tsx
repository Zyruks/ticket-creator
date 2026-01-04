import { type OpenAIModel, validateApiKey } from '@domain/openai';
import { useSettingsStore } from '@domain/stores';
import { Eye, EyeOff, Key, Save, Settings2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

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

export function SettingsPage() {
	const { config, setApiKey, setModel, setMaxTokens, setTemperature, resetConfig, isConfigured } =
		useSettingsStore();

	const [showApiKey, setShowApiKey] = useState(false);
	const [apiKeyInput, setApiKeyInput] = useState(config.apiKey);
	const [isValidating, setIsValidating] = useState(false);

	const handleSaveApiKey = async () => {
		if (!apiKeyInput.trim()) {
			toast.error('Please enter an API key');
			return;
		}

		setIsValidating(true);
		try {
			const isValid = await validateApiKey(apiKeyInput);
			if (isValid) {
				setApiKey(apiKeyInput);
				toast.success('API key saved and validated!');
			} else {
				toast.error('Invalid API key. Please check and try again.');
			}
		} catch {
			toast.error('Failed to validate API key');
		} finally {
			setIsValidating(false);
		}
	};

	const handleReset = () => {
		resetConfig();
		setApiKeyInput('');
		toast.info('Settings reset to defaults');
	};

	const selectedModel = MODELS.find((m) => m.value === config.model);

	return (
		<div className="container mx-auto max-w-2xl py-8 px-4">
			<div className="flex items-center gap-3 mb-8">
				<Settings2 className="h-8 w-8 text-primary" />
				<div>
					<h1 className="text-3xl font-bold">Settings</h1>
					<p className="text-muted-foreground">Configure your OpenAI integration</p>
				</div>
			</div>

			<div className="space-y-6">
				{/* API Key Card */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Key className="h-5 w-5" />
							OpenAI API Key
						</CardTitle>
						<CardDescription>
							Your API key is stored locally in your browser and never sent to any server except
							OpenAI.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="apiKey">API Key</Label>
							<div className="flex gap-2">
								<div className="relative flex-1">
									<Input
										id="apiKey"
										type={showApiKey ? 'text' : 'password'}
										value={apiKeyInput}
										onChange={(e) => setApiKeyInput(e.target.value)}
										placeholder="sk-..."
										className="pr-10"
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
										onClick={() => setShowApiKey(!showApiKey)}
									>
										{showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
									</Button>
								</div>
								<Button onClick={handleSaveApiKey} disabled={isValidating}>
									<Save className="h-4 w-4 mr-2" />
									{isValidating ? 'Validating...' : 'Save'}
								</Button>
							</div>
						</div>

						{isConfigured && (
							<div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
								<div className="h-2 w-2 rounded-full bg-green-500" />
								API key is configured and valid
							</div>
						)}
					</CardContent>
				</Card>

				{/* Model Settings Card */}
				<Card>
					<CardHeader>
						<CardTitle>Model Settings</CardTitle>
						<CardDescription>Choose the AI model and adjust generation parameters</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="model">Model</Label>
							<Select value={config.model} onValueChange={(v) => setModel(v as OpenAIModel)}>
								<SelectTrigger id="model" className="w-full">
									<SelectValue placeholder="Select a model" />
								</SelectTrigger>
								<SelectContent>
									{MODELS.map((model) => (
										<SelectItem key={model.value} value={model.value}>
											{model.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{selectedModel && (
								<p className="text-xs text-muted-foreground">{selectedModel.description}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="maxTokens">Max Tokens</Label>
							<Input
								id="maxTokens"
								type="number"
								value={config.maxTokens}
								onChange={(e) => setMaxTokens(Number(e.target.value))}
								min={100}
								max={16000}
							/>
							<p className="text-xs text-muted-foreground">
								Maximum number of tokens in the response (100-16000)
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="temperature">Temperature: {config.temperature}</Label>
							<Input
								id="temperature"
								type="range"
								value={config.temperature}
								onChange={(e) => setTemperature(Number(e.target.value))}
								min={0}
								max={1}
								step={0.1}
								className="cursor-pointer"
							/>
							<p className="text-xs text-muted-foreground">
								Lower = more focused, Higher = more creative
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Danger Zone */}
				<Card className="border-destructive/50">
					<CardHeader>
						<CardTitle className="text-destructive">Danger Zone</CardTitle>
						<CardDescription>These actions cannot be undone</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="destructive" onClick={handleReset}>
							<Trash2 className="h-4 w-4 mr-2" />
							Reset All Settings
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
