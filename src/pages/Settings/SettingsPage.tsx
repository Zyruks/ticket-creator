import { useSettingsStore } from '@domain/stores';
import { Settings2 } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { cn } from '@common';
import { ApiKeySection, DangerZone, ModelSettings } from '@/pages/Settings/components';

export const SettingsPage = () => {
	// 1. CLASSES OBJECT
	const classes = {
		container: cn('container mx-auto max-w-2xl py-8 px-4'),
		header: cn('flex items-center gap-3 mb-8'),
	};

	// 2. HOOKS
	const { config, setApiKey, setModel, setMaxTokens, setTemperature, resetConfig, isConfigured } =
		useSettingsStore();

	// 3. CALLBACKS
	const handleReset = useCallback(() => {
		resetConfig();
		toast.info('Settings reset to defaults');
	}, [resetConfig]);

	return (
		<div className={classes.container}>
			<div className={classes.header}>
				<Settings2 className="h-8 w-8 text-primary" />
				<div>
					<h1 className="text-3xl font-bold">Settings</h1>
					<p className="text-muted-foreground">Configure your OpenAI integration</p>
				</div>
			</div>

			<div className="space-y-6">
				<ApiKeySection
					apiKey={config.apiKey}
					setApiKey={setApiKey}
					isConfigured={isConfigured}
				/>
				<ModelSettings
					model={config.model}
					setModel={setModel}
					maxTokens={config.maxTokens}
					setMaxTokens={setMaxTokens}
					temperature={config.temperature}
					setTemperature={setTemperature}
				/>
				<DangerZone onReset={handleReset} />
			</div>
		</div>
	);
};
