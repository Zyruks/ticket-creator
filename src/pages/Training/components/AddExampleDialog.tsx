import { Save } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@common';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AddExampleDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onAdd: (input: string, output: string) => void;
}

export const AddExampleDialog = ({ isOpen, onOpenChange, onAdd }: AddExampleDialogProps) => {
	// 1. CLASSES OBJECT
	const classes = {
		dialogContent: cn('max-w-2xl max-h-[90vh] overflow-y-auto bg-white'),
		textareaOutput: cn('min-h-[200px] font-mono text-sm'),
	};

	// 2. STATE
	const [inputValue, setInputValue] = useState('');
	const [outputValue, setOutputValue] = useState('');

	// 3. CALLBACKS
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
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className={classes.dialogContent}>
				<DialogHeader>
					<DialogTitle>Add Training Example</DialogTitle>
					<DialogDescription>
						Provide an input request and the expected ticket output
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="input">Input Request</Label>
						<Textarea
							id="input"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							placeholder="e.g., Update the header color to match the new brand guidelines"
							className="min-h-[80px]"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="output">Expected Ticket Output (Markdown)</Label>
						<Textarea
							id="output"
							value={outputValue}
							onChange={(e) => setOutputValue(e.target.value)}
							placeholder="## Objective / Problem Statement&#10;Update the header component to use the new brand color..."
							className={classes.textareaOutput}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSave}>
						<Save className="h-4 w-4 mr-2" />
						Save Example
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
