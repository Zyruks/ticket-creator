import { cn } from '@common';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DangerZoneProps {
	/**
	 * Callback to reset all settings.
	 */
	onReset: () => void;
}

export const DangerZone = ({ onReset }: DangerZoneProps) => {
	const classes = {
		dangerCard: cn('border-destructive/50'),
	};

	return (
		<Card className={classes.dangerCard}>
			<CardHeader>
				<CardTitle className="text-destructive">Danger Zone</CardTitle>
				<CardDescription>These actions cannot be undone</CardDescription>
			</CardHeader>
			<CardContent>
				<Button
					variant="destructive"
					onClick={onReset}
				>
					<Trash2 className="mr-2 h-4 w-4" />
					Reset All Settings
				</Button>
			</CardContent>
		</Card>
	);
};
