import { cn } from '@common';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '@components';
import { validateApiKey } from '@domain';
import { Eye, EyeOff, Key, Save } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface ApiKeySectionProps {
	/**
	 * Current API key value.
	 */
	apiKey: string;
	/**
	 * Whether the API is configured.
	 */
	isConfigured: boolean;
	/**
	 * Callback to set the API key.
	 */
	setApiKey: (key: string) => void;
}

export const ApiKeySection = ({ apiKey, setApiKey, isConfigured }: ApiKeySectionProps) => {
	const classes = {
		successMessage: cn('flex items-center gap-2 text-green-600 text-sm dark:text-green-400'),
	};

	const [showApiKey, setShowApiKey] = useState(false);
	const [apiKeyInput, setApiKeyInput] = useState(apiKey);
	const [isValidating, setIsValidating] = useState(false);

	const handleSaveApiKey = useCallback(async () => {
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
	}, [apiKeyInput, setApiKey]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Key className="h-5 w-5" />
					OpenAI API Key
				</CardTitle>
				<CardDescription>
					Your API key is stored locally in your browser and never sent to any server except OpenAI.
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
								className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
								onClick={() => setShowApiKey(!showApiKey)}
							>
								{showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</Button>
						</div>
						<Button
							onClick={handleSaveApiKey}
							disabled={isValidating}
						>
							<Save className="mr-2 h-4 w-4" />
							{isValidating ? 'Validating...' : 'Save'}
						</Button>
					</div>
				</div>

				{isConfigured && (
					<div className={classes.successMessage}>
						<div className="h-2 w-2 rounded-full bg-green-500" />
						API key is configured and valid
					</div>
				)}
			</CardContent>
		</Card>
	);
};
