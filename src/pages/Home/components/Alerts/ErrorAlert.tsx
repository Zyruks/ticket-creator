import { Alert, AlertDescription, AlertTitle } from '@components';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
	/**
	 * Error message to display.
	 */
	error: string;
}

export const ErrorAlert = ({ error }: ErrorAlertProps) => {
	return (
		<Alert
			variant="destructive"
			className="mb-6"
		>
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>Generation Failed</AlertTitle>
			<AlertDescription>{error}</AlertDescription>
		</Alert>
	);
};
