import { useRepositoryStore, useSettingsStore, useTrainingStore } from '@domain/stores';
import { cn } from '@common';
import { Badge } from '@/components/ui/badge';

export const StatusBadges = () => {
	const classes = {
		badges: cn('flex flex-wrap gap-2 mb-6'),
	};

	const { isConfigured } = useSettingsStore();
	const { examples } = useTrainingStore();
	const { context } = useRepositoryStore();

	const apiStatusLabel = isConfigured ? '✓ API Connected' : '✗ API Not Configured';
	const apiStatusVariant = isConfigured ? 'default' : 'destructive';

	const ticketExampleLabel = `${examples.length} Training Example${examples.length !== 1 ? 's' : ''}`;
	const trainingVariant = examples.length > 0 ? 'default' : 'secondary';

	const contextLabel = context ? `✓ ${context.meta.repositoryName}` : 'No Repo Context';
	const contextVariant = context ? 'default' : 'secondary';

	return (
		<div className={classes.badges}>
			<Badge variant={apiStatusVariant}>{apiStatusLabel}</Badge>
			<Badge variant={trainingVariant}>{ticketExampleLabel}</Badge>
			<Badge variant={contextVariant}>{contextLabel}</Badge>
		</div>
	);
}
