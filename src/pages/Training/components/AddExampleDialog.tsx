import { cn } from '@common';
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Label,
	Textarea,
} from '@components';
import { Save } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface AddExampleDialogProps {
	/**
	 * Whether the dialog is open.
	 */
	isOpen: boolean;
	/**
	 * Callback to add a new training example.
	 */
	onAdd: (input: string, output: string) => void;
	/**
	 * Callback when dialog open state changes.
	 */
	onOpenChange: (open: boolean) => void;
}

export const AddExampleDialog = ({ isOpen, onOpenChange, onAdd }: AddExampleDialogProps) => {
	const classes = {
		dialogContent: cn('max-h-[90vh] max-w-2xl overflow-y-auto bg-white'),
		textareaOutput: cn('min-h-[200px] font-mono text-sm'),
	};

	const [inputValue, setInputValue] = useState('');
	const [outputValue, setOutputValue] = useState('');

	const handleSave = useCallback(() => {
		if (!inputValue.trim() || !outputValue.trim()) {
			toast.error('Both input and output are required');
			return;
		}

		onAdd(inputValue.trim(), outputValue.trim());
		setInputValue('');
		setOutputValue('');
		onOpenChange(false);
		toast.success('Training example added');
	}, [inputValue, outputValue, onAdd, onOpenChange]);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={onOpenChange}
		>
			<DialogContent className={classes.dialogContent}>
				<DialogHeader>
					<DialogTitle>Add Training Example</DialogTitle>
					<DialogDescription>Provide an input request and the expected ticket output</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="input">Input Request</Label>
						<Textarea
							id="input"
							value={inputValue}
							onChange={(event) => setInputValue(event.target.value)}
							placeholder="e.g., Update the header color to match the new brand guidelines"
							className="min-h-[80px]"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="output">Expected Ticket Output (Markdown)</Label>
						<Textarea
							id="output"
							value={outputValue}
							onChange={(event) => setOutputValue(event.target.value)}
							placeholder="## Objective / Problem Statement&#10;Update the header component to use the new brand color..."
							className={classes.textareaOutput}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button onClick={handleSave}>
						<Save className="mr-2 h-4 w-4" />
						Save Example
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
