import { cn } from '@common';
import type { TrainingExample } from '@domain';
import { Save, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
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

interface EditExampleDialogProps {
	/**
	 * The training example to edit, or null if not editing.
	 */
	example: TrainingExample | null;
	/**
	 * Callback when dialog is closed.
	 */
	onClose: () => void;
	/**
	 * Callback to update an existing training example.
	 */
	onUpdate: (id: string, data: { input: string; output: string }) => void;
}

export const EditExampleDialog = ({ example, onClose, onUpdate }: EditExampleDialogProps) => {
	// CLASSES OBJECT
	const classes = {
		dialogContent: cn('max-h-[90vh] max-w-2xl overflow-y-auto bg-white'),
		textareaOutput: cn('min-h-[200px] font-mono text-sm'),
	};

	// STATE
	const [inputValue, setInputValue] = useState('');
	const [outputValue, setOutputValue] = useState('');

	// EFFECTS
	useEffect(() => {
		if (example) {
			setInputValue(example.input);
			setOutputValue(example.output);
		}
	}, [example]);

	// CALLBACKS
	const handleSave = useCallback(() => {
		if (!example) return;

		if (!inputValue.trim() || !outputValue.trim()) {
			toast.error('Both input and output are required');
			return;
		}

		onUpdate(example.id, {
			input: inputValue.trim(),
			output: outputValue.trim(),
		});
		onClose();
		toast.success('Training example updated');
	}, [example, inputValue, outputValue, onUpdate, onClose]);

	return (
		<Dialog
			open={!!example}
			onOpenChange={(open) => !open && onClose()}
		>
			<DialogContent className={classes.dialogContent}>
				<DialogHeader>
					<DialogTitle>Edit Training Example</DialogTitle>
					<DialogDescription>Update the input request or expected output</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="edit-input">Input Request</Label>
						<Textarea
							id="edit-input"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							className="min-h-[80px]"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="edit-output">Expected Ticket Output (Markdown)</Label>
						<Textarea
							id="edit-output"
							value={outputValue}
							onChange={(e) => setOutputValue(e.target.value)}
							className={classes.textareaOutput}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={onClose}
					>
						<X className="mr-2 h-4 w-4" />
						Cancel
					</Button>
					<Button onClick={handleSave}>
						<Save className="mr-2 h-4 w-4" />
						Save Changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
