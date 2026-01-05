import { cn } from '@common';
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	ScrollArea,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
} from '@components';
import {
	buildMessageContent,
	buildSystemPrompt,
	buildUserPrompt,
	createImageAttachment,
	createTicket,
	type ImageAttachment,
	streamChatCompletion,
	useRepositoryStore,
	useSettingsStore,
	useTemplateStore,
	useTicketStore,
	useTrainingStore,
} from '@domain';
import {
	AlertCircle,
	Check,
	Copy,
	Edit3,
	ImagePlus,
	Loader2,
	RefreshCw,
	Send,
	Sparkles,
	Ticket,
	X,
} from 'lucide-react';
import { type KeyboardEvent, useCallback, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { TemplateSelector } from './components';

export function HomePage() {
	const classes = {
		container: cn('container mx-auto max-w-4xl px-4 py-8'),
		dragZone: (active: boolean) =>
			cn(
				'group relative rounded-md transition-all',
				active && 'bg-primary/5 ring-2 ring-primary ring-offset-2',
			),
		dragOverlay: cn(
			'pointer-events-none absolute inset-0 flex items-center justify-center',
			'rounded-md border-2 border-primary border-dashed bg-background/50 backdrop-blur-sm',
		),
		imageItem: cn('group relative overflow-hidden rounded-lg border bg-muted'),
		imageRemove: cn(
			'absolute top-1 right-1 rounded-full p-1',
			'bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100',
		),
	};

	// HOOKS
	const { config, isConfigured } = useSettingsStore();
	const { examples } = useTrainingStore();
	const { context } = useRepositoryStore();
	const { selectedTemplate } = useTemplateStore();
	const {
		currentTicket,
		isGenerating,
		streamedContent,
		error,
		setCurrentTicket,
		updateCurrentTicketContent,
		clearCurrentTicket,
		addToHistory,
		setIsGenerating,
		setStreamedContent,
		appendStreamedContent,
		setError,
	} = useTicketStore();

	const [request, setRequest] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState('');
	const [copied, setCopied] = useState(false);
	const [images, setImages] = useState<ImageAttachment[]>([]);
	const [isLoadingImage, setIsLoadingImage] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const displayContent = currentTicket?.content || streamedContent;
	const hasContent = Boolean(displayContent);
	const ticketExampleLabel = `${examples.length} Training Example${examples.length !== 1 ? 's' : ''}`;
	const contextLabel = context ? `✓ ${context.meta.repositoryName}` : 'No Repo Context';
	const apiStatusLabel = isConfigured ? '✓ API Connected' : '✗ API Not Configured';
	const apiStatusVariant = isConfigured ? 'default' : 'destructive';
	const trainingVariant = examples.length > 0 ? 'default' : 'secondary';
	const contextVariant = context ? 'default' : 'secondary';

	const validateImageFile = useCallback((file: File): boolean => {
		if (!file.type.startsWith('image/')) {
			toast.error(`${file.name} is not an image`);
			return false;
		}
		if (file.size > 20 * 1024 * 1024) {
			toast.error(`${file.name} is too large (max 20MB)`);
			return false;
		}
		return true;
	}, []);

	const handleImageUpload = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const files = event.target.files;
			if (!files || files.length === 0) return;

			setIsLoadingImage(true);
			try {
				const newImages: ImageAttachment[] = [];
				for (const file of Array.from(files)) {
					if (!validateImageFile(file)) continue;

					const attachment = await createImageAttachment(file);
					newImages.push(attachment);
				}
				setImages((prev) => [...prev, ...newImages]);
				if (newImages.length > 0) {
					toast.success(`Added ${newImages.length} image${newImages.length > 1 ? 's' : ''}`);
				}
			} catch {
				toast.error('Failed to load images');
			} finally {
				setIsLoadingImage(false);
				if (fileInputRef.current) {
					fileInputRef.current.value = '';
				}
			}
		},
		[validateImageFile],
	);

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

			const dummyEvent = {
				target: { files },
			} as unknown as React.ChangeEvent<HTMLInputElement>;

			await handleImageUpload(dummyEvent);
		},
		[handleImageUpload],
	);

	const removeImage = useCallback((id: string) => {
		setImages((prev) => prev.filter((img) => img.id !== id));
	}, []);

	const clearImages = useCallback(() => {
		setImages([]);
	}, []);

	const handleGenerate = useCallback(async () => {
		if (!request.trim()) {
			toast.error('Please enter a ticket request');
			return;
		}

		if (!isConfigured) {
			toast.error('Please configure your OpenAI API key in Settings');
			return;
		}

		setIsGenerating(true);
		setError(null);
		setStreamedContent('');
		clearCurrentTicket();

		try {
			const systemPrompt = buildSystemPrompt(selectedTemplate, context?.compactTree || null, examples);
			const userPrompt = buildUserPrompt(request);
			const userContent = buildMessageContent(userPrompt, images);

			const messages = [
				{ role: 'system' as const, content: systemPrompt },
				{ role: 'user' as const, content: userContent },
			];

			let fullContent = '';

			for await (const chunk of streamChatCompletion(config, messages)) {
				fullContent += chunk;
				appendStreamedContent(chunk);
			}

			const ticket = createTicket(request, fullContent);
			setCurrentTicket(ticket);
			addToHistory(ticket);
			setRequest('');
			clearImages();
			toast.success('Ticket generated successfully!');
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to generate ticket';
			setError(message);
			toast.error(message);
		} finally {
			setIsGenerating(false);
		}
	}, [
		request,
		images,
		isConfigured,
		config,
		context,
		examples,
		selectedTemplate,
		setIsGenerating,
		setError,
		setStreamedContent,
		clearCurrentTicket,
		appendStreamedContent,
		setCurrentTicket,
		addToHistory,
		clearImages,
	]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLTextAreaElement>) => {
			if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				handleGenerate();
			}
		},
		[handleGenerate],
	);

	const handleCopy = useCallback(async () => {
		const content = currentTicket?.content || streamedContent;
		if (!content) return;

		await navigator.clipboard.writeText(content);
		setCopied(true);
		toast.success('Copied to clipboard');
		setTimeout(() => setCopied(false), 2000);
	}, [currentTicket, streamedContent]);

	const handleEdit = useCallback(() => {
		setEditContent(currentTicket?.content || streamedContent);
		setIsEditing(true);
	}, [currentTicket, streamedContent]);

	const handleSaveEdit = useCallback(() => {
		if (currentTicket) {
			updateCurrentTicketContent(editContent);
		}
		setIsEditing(false);
		toast.success('Changes saved');
	}, [currentTicket, editContent, updateCurrentTicketContent]);

	const handleRegenerate = useCallback(() => {
		if (currentTicket) {
			setRequest(currentTicket.request);
		}
		clearCurrentTicket();
	}, [currentTicket, clearCurrentTicket]);

	const renderStatusBadges = () => (
		<div className="mb-6 flex flex-wrap gap-2">
			<Badge variant={apiStatusVariant}>{apiStatusLabel}</Badge>
			<Badge variant={trainingVariant}>{ticketExampleLabel}</Badge>
			<Badge variant={contextVariant}>{contextLabel}</Badge>
		</div>
	);

	const renderAlerts = () => {
		if (isConfigured) return null;
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

	const renderError = () => {
		if (!error) return null;
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

	const renderImages = () => {
		if (images.length === 0) return null;
		return (
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<span className="font-medium text-sm">Attached Images ({images.length})</span>
					<Button
						variant="ghost"
						size="sm"
						onClick={clearImages}
					>
						<X className="mr-1 h-3 w-3" />
						Clear all
					</Button>
				</div>
				<div className="flex flex-wrap gap-2">
					{images.map((img) => (
						<div
							key={img.id}
							className={classes.imageItem}
						>
							<img
								src={img.dataUrl}
								alt={img.name}
								className="h-20 w-20 object-cover"
							/>
							<button
								type="button"
								onClick={() => removeImage(img.id)}
								className={classes.imageRemove}
							>
								<X className="h-3 w-3" />
							</button>
							<div className="absolute right-0 bottom-0 left-0 truncate bg-black/60 p-1 text-white text-xs">
								{img.name}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	const renderDragOverlay = () => {
		if (!isDragging) return null;
		return (
			<div className={classes.dragOverlay}>
				<div className="flex animate-bounce flex-col items-center">
					<ImagePlus className="mb-2 h-8 w-8 text-primary" />
					<p className="font-medium text-primary text-sm">Drop images here</p>
				</div>
			</div>
		);
	};

	const renderInputActions = () => (
		<div className="flex items-center justify-between gap-2">
			<div className="flex items-center gap-2">
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					multiple
					onChange={handleImageUpload}
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
					Press <kbd className="rounded bg-muted px-1 py-0.5 text-xs">⌘</kbd> +{' '}
					<kbd className="rounded bg-muted px-1 py-0.5 text-xs">Enter</kbd> to generate
				</p>
			</div>
			<Button
				onClick={handleGenerate}
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

	const renderInputSection = () => (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Sparkles className="h-5 w-5" />
					What do you need?
				</CardTitle>
				<CardDescription>Describe the task, feature, or bug fix you need a ticket for</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<TemplateSelector disabled={isGenerating} />
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
							className="min-h-[100px] resize-none pr-8"
							disabled={isGenerating}
						/>
						{renderDragOverlay()}
					</div>
					{renderImages()}
					{renderInputActions()}
				</div>
			</CardContent>
		</Card>
	);

	const renderOutput = () => {
		if (!hasContent && !isGenerating) return null;

		if (isEditing) {
			return (
				<Card>
					<CardContent className="pt-6">
						<div className="space-y-4">
							<Textarea
								value={editContent}
								onChange={(e) => setEditContent(e.target.value)}
								className="min-h-[400px] font-mono text-sm"
							/>
							<div className="flex gap-2">
								<Button onClick={handleSaveEdit}>Save Changes</Button>
								<Button
									variant="outline"
									onClick={() => setIsEditing(false)}
								>
									Cancel
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			);
		}

		return (
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Generated Ticket</CardTitle>
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={handleCopy}
								disabled={!hasContent}
							>
								{copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
								{copied ? 'Copied!' : 'Copy'}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleEdit}
								disabled={!hasContent || isEditing}
							>
								<Edit3 className="mr-2 h-4 w-4" />
								Edit
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleRegenerate}
								disabled={!currentTicket}
							>
								<RefreshCw className="mr-2 h-4 w-4" />
								Regenerate
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="preview">
						<TabsList>
							<TabsTrigger value="preview">Preview</TabsTrigger>
							<TabsTrigger value="markdown">Markdown</TabsTrigger>
						</TabsList>
						<TabsContent value="preview">
							<ScrollArea className="h-[400px] rounded-lg border p-4">
								<div className="prose prose-sm dark:prose-invert max-w-none">
									<ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
								</div>
							</ScrollArea>
						</TabsContent>
						<TabsContent value="markdown">
							<ScrollArea className="h-[400px] rounded-lg border">
								<pre className="whitespace-pre-wrap p-4 font-mono text-sm">{displayContent}</pre>
							</ScrollArea>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		);
	};

	return (
		<div className={classes.container}>
			<div className="mb-8 flex items-center gap-3">
				<Ticket className="h-8 w-8 text-primary" />
				<div>
					<h1 className="font-bold text-3xl">Create Ticket</h1>
					<p className="text-muted-foreground">
						Describe what you need and let AI generate a structured ticket
					</p>
				</div>
			</div>

			{renderStatusBadges()}
			{renderAlerts()}
			{renderInputSection()}
			{renderError()}
			{renderOutput()}
		</div>
	);
}

export default HomePage;
