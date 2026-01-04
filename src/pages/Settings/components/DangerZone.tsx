import { Trash2 } from 'lucide-react';
import { cn } from '@common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DangerZoneProps {
	onReset: () => void;
}

export const DangerZone = ({ onReset }: DangerZoneProps) => {
	// 1. CLASSES OBJECT
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
				<Button variant="destructive" onClick={onReset}>
					<Trash2 className="h-4 w-4 mr-2" />
					Reset All Settings
				</Button>
			</CardContent>
		</Card>
	);
};
