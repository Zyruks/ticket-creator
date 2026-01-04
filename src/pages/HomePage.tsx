import type { ImageAttachment } from '@domain/openai';
import {
	buildMessageContent,
	buildSystemPrompt,
	buildUserPrompt,
	createImageAttachment,
	streamChatCompletion,
} from '@domain/openai';
import {
	createTicket,
	useRepositoryStore,
	useSettingsStore,
	useTicketStore,
	useTrainingStore,
} from '@domain/stores';
import { DEFAULT_TICKET_TEMPLATE } from '@domain/ticket';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export function HomePage() {
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

			// Reuse the upload logic
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

			// Build user message with images if present
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

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			handleGenerate();
		}
	};

	const handleCopy = async () => {
		const content = currentTicket?.content || streamedContent;
		if (!content) return;

		await navigator.clipboard.writeText(content);
		setCopied(true);
		toast.success('Copied to clipboard');
		setTimeout(() => setCopied(false), 2000);
	};

	const handleEdit = () => {
		setEditContent(currentTicket?.content || streamedContent);
		setIsEditing(true);
	};

	const handleSaveEdit = () => {
		if (currentTicket) {
			updateCurrentTicketContent(editContent);
		}
		setIsEditing(false);
		toast.success('Changes saved');
	};

	const handleRegenerate = () => {
		if (currentTicket) {
			setRequest(currentTicket.request);
		}
		clearCurrentTicket();
	};

	const displayContent = currentTicket?.content || streamedContent;
	const hasContent = Boolean(displayContent);

	return (
		<div className="container mx-auto max-w-4xl py-8 px-4">
			<div className="flex items-center gap-3 mb-8">
				<Ticket className="h-8 w-8 text-primary" />
				<div>
					<h1 className="text-3xl font-bold">Create Ticket</h1>
					<p className="text-muted-foreground">
						Describe what you need and let AI generate a structured ticket
					</p>
				</div>
			</div>

			{/* Status Badges */}
			<div className="flex flex-wrap gap-2 mb-6">
				<Badge variant={isConfigured ? 'default' : 'destructive'}>
					{isConfigured ? '✓ API Connected' : '✗ API Not Configured'}
				</Badge>
				<Badge variant={examples.length > 0 ? 'default' : 'secondary'}>
					{examples.length} Training Example{examples.length !== 1 ? 's' : ''}
				</Badge>
				<Badge variant={context ? 'default' : 'secondary'}>
					{context ? `✓ ${context.meta.repositoryName}` : 'No Repo Context'}
				</Badge>
			</div>

			{/* Warning if not configured */}
			{!isConfigured && (
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>API Key Required</AlertTitle>
					<AlertDescription>
						Please configure your OpenAI API key in the Settings page to generate tickets.
					</AlertDescription>
				</Alert>
			)}

			{/* Input Section */}
			<Card className="mb-6">
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
						{/* biome-ignore lint/a11y/noStaticElementInteractions: drag and drop zone */}
						<div
							className={`relative rounded-md group ${
								isDragging
									? 'ring-2 ring-primary ring-offset-2 bg-primary/5 transition-all'
									: 'transition-all'
							}`}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						>
							<Textarea
								value={request}
								onChange={(e) => setRequest(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="e.g., Update the color system for the print.lol folder to use the new Tailwind theme tokens..."
								className="min-h-[100px] resize-none pr-8"
								disabled={isGenerating}
							/>
							{isDragging && (
								<div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-background/50 backdrop-blur-sm rounded-md border-2 border-dashed border-primary">
									<div className="flex flex-col items-center animate-bounce">
										<ImagePlus className="h-8 w-8 text-primary mb-2" />
										<p className="text-sm font-medium text-primary">Drop images here</p>
									</div>
								</div>
							)}
						</div>

						{/* Image Attachments */}
						{images.length > 0 && (
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Attached Images ({images.length})</span>
									<Button variant="ghost" size="sm" onClick={clearImages}>
										<X className="h-3 w-3 mr-1" />
										Clear all
									</Button>
								</div>
								<div className="flex flex-wrap gap-2">
									{images.map((img) => (
										<div
											key={img.id}
											className="relative group rounded-lg overflow-hidden border bg-muted"
										>
											<img src={img.dataUrl} alt={img.name} className="h-20 w-20 object-cover" />
											<button
												type="button"
												onClick={() => removeImage(img.id)}
												className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<X className="h-3 w-3" />
											</button>
											<div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
												{img.name}
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Action Row */}
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
					</div>
				</CardContent>
			</Card>

			{/* Error Display */}
			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Generation Failed</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Output Section */}
			{(hasContent || isGenerating) && (
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
						{isEditing ? (
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
						) : (
							<Tabs defaultValue="preview">
								<TabsList>
									<TabsTrigger value="preview">Preview</TabsTrigger>
									<TabsTrigger value="markdown">Markdown</TabsTrigger>
								</TabsList>
								<TabsContent value="preview">
									<ScrollArea className="h-[400px] border rounded-lg p-4">
										<div className="prose prose-sm  max-w-none">
											<ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
										</div>
									</ScrollArea>
								</TabsContent>
								<TabsContent value="markdown">
									<ScrollArea className="h-[400px] border rounded-lg">
										<pre className="p-4 text-sm font-mono whitespace-pre-wrap">
											{displayContent}
										</pre>
									</ScrollArea>
								</TabsContent>
							</Tabs>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
