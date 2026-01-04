import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const ConfigAlert = () => {
	return (
		<Alert variant="destructive" className="mb-6">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>API Key Required</AlertTitle>
			<AlertDescription>
				Please configure your OpenAI API key in the Settings page to generate tickets.
			</AlertDescription>
		</Alert>
	);
};

interface ErrorAlertProps {
	error: string;
}

export const ErrorAlert = ({ error }: ErrorAlertProps) => {
	return (
		<Alert variant="destructive" className="mb-6">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>Generation Failed</AlertTitle>
			<AlertDescription>{error}</AlertDescription>
		</Alert>
	);
}
