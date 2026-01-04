import { type ImageAttachment, buildMessageContent, buildSystemPrompt, buildUserPrompt, createImageAttachment, streamChatCompletion } from '@domain/openai';
import { createTicket, useRepositoryStore, useSettingsStore, useTicketStore, useTrainingStore } from '@domain/stores';
import { DEFAULT_TICKET_TEMPLATE } from '@domain/ticket';
import { AlertCircle, Check, Copy, Edit3, ImagePlus, Loader2, RefreshCw, Send, Sparkles, Ticket, X } from 'lucide-react';
import { type KeyboardEvent, useCallback, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

import { cn } from '@common';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export function HomePage() {
	// 1. CLASSES OBJECT
	const classes = {
		container: cn('container mx-auto max-w-4xl py-8 px-4'),
		header: cn('flex items-center gap-3 mb-8'),
		headerIcon: cn('h-8 w-8 text-primary'),
		headerTitle: cn('text-3xl font-bold'),
		headerDesc: cn('text-muted-foreground'),
		badges: cn('flex flex-wrap gap-2 mb-6'),
		alerts: cn('mb-6'),
		cards: cn('mb-6'),
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
		preview: cn('prose prose-sm max-w-none dark:prose-invert'),
	};

	// 2. HOOKS
	const { config, isConfigured } = useSettingsStore();
	const { examples } = useTrainingStore();
	const { context } = useRepositoryStore();
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

	// 3. DERIVED STATE
	const displayContent = currentTicket?.content || streamedContent;
	const hasContent = Boolean(displayContent);
	const ticketExampleLabel = `${examples.length} Training Example${examples.length !== 1 ? 's' : ''}`;
	const contextLabel = context ? `✓ ${context.meta.repositoryName}` : 'No Repo Context';
	const apiStatusLabel = isConfigured ? '✓ API Connected' : '✗ API Not Configured';
	const apiStatusVariant = isConfigured ? 'default' : 'destructive';
	const trainingVariant = examples.length > 0 ? 'default' : 'secondary';
	const contextVariant = context ? 'default' : 'secondary';

	// 4. CALLBACKS
	const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		setIsLoadingImage(true);
		try {
			const newImages: ImageAttachment[] = [];
			for (const file of Array.from(files)) {
				if (!file.type.startsWith('image/')) {
					toast.error(`${file.name} is not an image`);
					continue;
				}
				if (file.size > 20 * 1024 * 1024) {
					toast.error(`${file.name} is too large (max 20MB)`);
					continue;
				}
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
	}, []);

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

			const dummyEvent = {
				target: { files },
			} as unknown as React.ChangeEvent<HTMLInputElement>;

			await handleImageUpload(dummyEvent);
		},
		[handleImageUpload]
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
			const systemPrompt = buildSystemPrompt(
				DEFAULT_TICKET_TEMPLATE,
				context?.compactTree || null,
				examples
			);
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
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to generate ticket';
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
		(e: KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				handleGenerate();
			}
		},
		[handleGenerate]
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

	// 5. RENDER HELPERS
	const renderStatusBadges = () => (
		<div className={classes.badges}>
			<Badge variant={apiStatusVariant}>{apiStatusLabel}</Badge>
			<Badge variant={trainingVariant}>{ticketExampleLabel}</Badge>
			<Badge variant={contextVariant}>{contextLabel}</Badge>
		</div>
	);

	const renderAlerts = () => {
		if (isConfigured) return null;
		return (
			<Alert variant="destructive" className={classes.alerts}>
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
			<Alert variant="destructive" className={classes.alerts}>
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
					<span className="text-sm font-medium">Attached Images ({images.length})</span>
					<Button variant="ghost" size="sm" onClick={clearImages}>
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
								onClick={() => removeImage(img.id)}
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

	const renderInputActions = () => (
		<div className={classes.actions}>
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
						<Loader2 className="h-4 w-4 mr-2 animate-spin" />
					) : (
						<ImagePlus className="h-4 w-4 mr-2" />
					)}
					Add Image
				</Button>
				<p className="text-xs text-muted-foreground hidden sm:block">
					Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">⌘</kbd> +{' '}
					<kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> to generate
				</p>
			</div>
			<Button onClick={handleGenerate} disabled={isGenerating || !request.trim()}>
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

	const renderInputSection = () => (
		<Card className={classes.cards}>
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
							placeholder="e.g., Update the color system for the print.lol folder to use the new Tailwind theme tokens..."
							className={classes.textInput}
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
								<Button variant="outline" onClick={() => setIsEditing(false)}>
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
							<Button variant="outline" size="sm" onClick={handleCopy} disabled={!hasContent}>
								{copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
								{copied ? 'Copied!' : 'Copy'}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleEdit}
								disabled={!hasContent || isEditing}
							>
								<Edit3 className="h-4 w-4 mr-2" />
								Edit
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleRegenerate}
								disabled={!currentTicket}
							>
								<RefreshCw className="h-4 w-4 mr-2" />
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
							<ScrollArea className="h-[400px] border rounded-lg p-4">
								<div className={classes.preview}>
									<ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
								</div>
							</ScrollArea>
						</TabsContent>
						<TabsContent value="markdown">
							<ScrollArea className="h-[400px] border rounded-lg">
								<pre className="p-4 text-sm font-mono whitespace-pre-wrap">{displayContent}</pre>
							</ScrollArea>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		);
	};

	return (
		<div className={classes.container}>
			<div className={classes.header}>
				<Ticket className={classes.headerIcon} />
				<div>
					<h1 className={classes.headerTitle}>Create Ticket</h1>
					<p className={classes.headerDesc}>
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
