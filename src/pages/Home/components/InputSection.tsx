import { type ImageAttachment } from '@domain/openai';
import { ImagePlus, Loader2, Send, Sparkles, X } from 'lucide-react';
import { type KeyboardEvent, useCallback, useRef, useState } from 'react';
import { cn } from '@common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface InputSectionProps {
	request: string;
	setRequest: (value: string) => void;
	isGenerating: boolean;
	onGenerate: () => void;
	images: ImageAttachment[];
	onAddImages: (files: FileList) => Promise<void>;
	onRemoveImage: (id: string) => void;
	onClearImages: () => void;
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
	// 1. CLASSES OBJECT
	const classes = {
		container: cn('mb-6'),
		dragZone: (active: boolean) =>
			cn(
				'relative rounded-md group transition-all',
				active && 'ring-2 ring-primary ring-offset-2 bg-primary/5'
			),
		dragOverlay: cn(
			'absolute inset-0 flex items-center justify-center pointer-events-none',
			'bg-background/50 backdrop-blur-sm rounded-md border-2 border-dashed border-primary'
		),
		dragContent: cn('flex flex-col items-center animate-bounce'),
		textInput: cn('min-h-[100px] resize-none pr-8'),
		imageGrid: cn('flex flex-wrap gap-2'),
		imageItem: cn('relative group rounded-lg overflow-hidden border bg-muted'),
		imagePreview: cn('h-20 w-20 object-cover'),
		imageRemove: cn(
			'absolute top-1 right-1 p-1 rounded-full',
			'bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity'
		),
		imageLabel: cn('absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate'),
		actions: cn('flex items-center justify-between gap-2'),
		kdb: cn('px-1 py-0.5 bg-muted rounded text-xs'),
	};

	// 2. HOOKS
	const [isDragging, setIsDragging] = useState(false);
	const [isLoadingImage, setIsLoadingImage] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// 3. CALLBACKS
	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		async (e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			const files = e.dataTransfer.files;
			if (!files || files.length === 0) return;

			setIsLoadingImage(true);
			await onAddImages(files);
			setIsLoadingImage(false);
		},
		[onAddImages]
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
		[onAddImages]
	);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				onGenerate();
			}
		},
		[onGenerate]
	);

	// 4. RENDER HELPERS
	const renderDragOverlay = () => {
		if (!isDragging) return null;
		return (
			<div className={classes.dragOverlay}>
				<div className={classes.dragContent}>
					<ImagePlus className="h-8 w-8 text-primary mb-2" />
					<p className="text-sm font-medium text-primary">Drop images here</p>
				</div>
			</div>
		);
	};

	const renderImages = () => {
		if (images.length === 0) return null;
		return (
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium">Attached Images ({images.length})</span>
					<Button variant="ghost" size="sm" onClick={onClearImages}>
						<X className="h-3 w-3 mr-1" />
						Clear all
					</Button>
				</div>
				<div className={classes.imageGrid}>
					{images.map((img) => (
						<div key={img.id} className={classes.imageItem}>
							<img src={img.dataUrl} alt={img.name} className={classes.imagePreview} />
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
						<Loader2 className="h-4 w-4 mr-2 animate-spin" />
					) : (
						<ImagePlus className="h-4 w-4 mr-2" />
					)}
					Add Image
				</Button>
				<p className="text-xs text-muted-foreground hidden sm:block">
					Press <kbd className={classes.kdb}>⌘</kbd> +{' '}
					<kbd className={classes.kdb}>Enter</kbd> to generate
				</p>
			</div>
			<Button onClick={onGenerate} disabled={isGenerating || !request.trim()}>
				{isGenerating ? (
					<>
						<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						Generating...
					</>
				) : (
					<>
						<Send className="h-4 w-4 mr-2" />
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
				<CardDescription>
					Describe the task, feature, or bug fix you need a ticket for
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* biome-ignore lint/a11y/noStaticElementInteractions: drag zone */}
					<div
						className={classes.dragZone(isDragging)}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
					>
						<Textarea
							value={request}
							onChange={(e) => setRequest(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="e.g., Update the color system to use the new Tailwind theme tokens..."
							className={classes.textInput}
							disabled={isGenerating}
						/>
						{renderDragOverlay()}
					</div>
					{renderImages()}
					{renderActions()}
				</div>
			</CardContent>
		</Card>
	);
}
