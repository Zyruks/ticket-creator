import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components';

export const ConfigAlert = () => {
	return (
		<Alert
			variant="destructive"
			className="mb-6"
		>
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>API Key Required</AlertTitle>
			<AlertDescription>
				Please configure your OpenAI API key in the Settings page to generate tickets.
			</AlertDescription>
		</Alert>
	);
};
