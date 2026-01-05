import { cn } from '@common';
import { useSettingsStore } from '@domain';
import { Settings2 } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { ApiKeySection, DangerZone, ModelSettings } from '@/pages/Settings/components';

export const SettingsPage = () => {
	const classes = {
		container: cn('container mx-auto max-w-2xl px-4 py-8'),
		header: cn('mb-8 flex items-center gap-3'),
	};

	const { config, setApiKey, setModel, setMaxTokens, setTemperature, resetConfig, isConfigured } =
		useSettingsStore();

	const handleReset = useCallback(() => {
		resetConfig();
		toast.info('Settings reset to defaults');
	}, [resetConfig]);

	return (
		<div className={classes.container}>
			<div className={classes.header}>
				<Settings2 className="h-8 w-8 text-primary" />
				<div>
					<h1 className="font-bold text-3xl">Settings</h1>
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
