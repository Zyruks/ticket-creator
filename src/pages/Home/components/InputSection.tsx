import { cn } from '@common';
import type { ImageAttachment } from '@domain';
import { ImagePlus, Loader2, Send, Sparkles, X } from 'lucide-react';
import { type KeyboardEvent, useCallback, useRef, useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Textarea } from '@/components';

interface InputSectionProps {
	/**
	 * Array of attached images.
	 */
	images: ImageAttachment[];

	/**
	 * Whether ticket generation is in progress.
	 */
	isGenerating: boolean;

	/**
	 * Current request text value.
	 */
	request: string;

	/**
	 * Callback to add images from file list.
	 */
	onAddImages: (files: FileList) => Promise<void>;

	/**
	 * Callback to clear all images.
	 */
	onClearImages: () => void;

	/**
	 * Callback to generate ticket.
	 */
	onGenerate: () => void;

	/**
	 * Callback to remove a specific image.
	 */
	onRemoveImage: (id: string) => void;

	/**
	 * Callback to set request text.
	 */
	setRequest: (value: string) => void;
}

export const InputSection = ({
	request,
	setRequest,
	isGenerating,
	onGenerate,
	images,
	onAddImages,
	onRemoveImage,
	onClearImages,
}: InputSectionProps) => {
	const classes = {
		container: cn('mb-6'),
		dragZone: (isActive: boolean) =>
			cn('group relative rounded-md transition-all', {
				'bg-primary/5 ring-2 ring-primary ring-offset-2': isActive,
			}),
		dragOverlay: cn(
			'pointer-events-none absolute inset-0 flex items-center justify-center',
			'rounded-md border-2 border-primary border-dashed bg-background/50 backdrop-blur-sm',
		),
		dragContent: cn('flex animate-bounce flex-col items-center'),
		textInput: cn('min-h-[100px] resize-none pr-8'),
		imageGrid: cn('flex flex-wrap gap-2'),
		imageItem: cn('group relative overflow-hidden rounded-lg border bg-muted'),
		imagePreview: cn('h-20 w-20 object-cover'),
		imageRemove: cn(
			'absolute top-1 right-1 rounded-full p-1',
			'bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100',
		),
		imageLabel: cn('absolute right-0 bottom-0 left-0 truncate bg-black/60 p-1 text-white text-xs'),
		actions: cn('flex items-center justify-between gap-2'),
		kdb: cn('rounded bg-muted px-1 py-0.5 text-xs'),
	};

	// HOOKS
	const [isDragging, setIsDragging] = useState(false);
	const [isLoadingImage, setIsLoadingImage] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// CALLBACKS
	const handleDragOver = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		async (event: React.DragEvent) => {
			event.preventDefault();
			event.stopPropagation();
			setIsDragging(false);

			const files = event.dataTransfer.files;
			if (!files || files.length === 0) return;

			setIsLoadingImage(true);
			await onAddImages(files);
			setIsLoadingImage(false);
		},
		[onAddImages],
	);

	const handleFileChange = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const files = event.target.files;
			if (!files || files.length === 0) return;

			setIsLoadingImage(true);
			await onAddImages(files);
			setIsLoadingImage(false);

			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		},
		[onAddImages],
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLTextAreaElement>) => {
			if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				onGenerate();
			}
		},
		[onGenerate],
	);

	const renderDragOverlay = () => {
		if (!isDragging) return null;
		return (
			<div className={classes.dragOverlay}>
				<div className={classes.dragContent}>
					<ImagePlus className="mb-2 h-8 w-8 text-primary" />
					<p className="font-medium text-primary text-sm">Drop images here</p>
				</div>
			</div>
		);
	};

	const renderImages = () => {
		if (images.length === 0) return null;
		return (
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<span className="font-medium text-sm">Attached Images ({images.length})</span>
					<Button
						variant="ghost"
						size="sm"
						onClick={onClearImages}
					>
						<X className="mr-1 h-3 w-3" />
						Clear all
					</Button>
				</div>
				<div className={classes.imageGrid}>
					{images.map((img) => (
						<div
							key={img.id}
							className={classes.imageItem}
						>
							<img
								src={img.dataUrl}
								alt={img.name}
								className={classes.imagePreview}
							/>
							<button
								type="button"
								onClick={() => onRemoveImage(img.id)}
								className={classes.imageRemove}
							>
								<X className="h-3 w-3" />
							</button>
							<div className={classes.imageLabel}>{img.name}</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	const renderActions = () => (
		<div className={classes.actions}>
			<div className="flex items-center gap-2">
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					multiple
					onChange={handleFileChange}
					className="sr-only"
					id="image-upload"
				/>
				<Button
					variant="outline"
					size="sm"
					onClick={() => fileInputRef.current?.click()}
					disabled={isGenerating || isLoadingImage}
				>
					{isLoadingImage ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<ImagePlus className="mr-2 h-4 w-4" />
					)}
					Add Image
				</Button>
				<p className="hidden text-muted-foreground text-xs sm:block">
					Press <kbd className={classes.kdb}>⌘</kbd> + <kbd className={classes.kdb}>Enter</kbd> to generate
				</p>
			</div>
			<Button
				onClick={onGenerate}
				disabled={isGenerating || !request.trim()}
			>
				{isGenerating ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Generating...
					</>
				) : (
					<>
						<Send className="mr-2 h-4 w-4" />
						Generate Ticket
					</>
				)}
			</Button>
		</div>
	);

	return (
		<Card className={classes.container}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Sparkles className="h-5 w-5" />
					What do you need?
				</CardTitle>
				<CardDescription>Describe the task, feature, or bug fix you need a ticket for</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<section
						className={classes.dragZone(isDragging)}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						aria-label="Drag and drop zone for images"
					>
						<Textarea
							value={request}
							onChange={(event) => setRequest(event.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="e.g., Update the color system to use the new Tailwind theme tokens..."
							className={classes.textInput}
							disabled={isGenerating}
						/>
						{renderDragOverlay()}
					</section>
					{renderImages()}
					{renderActions()}
				</div>
			</CardContent>
		</Card>
	);
};
