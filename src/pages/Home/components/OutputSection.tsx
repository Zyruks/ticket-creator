import { cn } from '@common';
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	ScrollArea,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
} from '@components';
import type { GeneratedTicket } from '@domain';
import { Check, Copy, Edit3, RefreshCw } from 'lucide-react';
import { useCallback, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

interface OutputSectionProps {
	/**
	 * Current generated ticket.
	 */
	currentTicket: GeneratedTicket | null;

	/**
	 * Whether ticket generation is in progress.
	 */
	isGenerating: boolean;

	/**
	 * Streamed content during generation.
	 */
	streamedContent: string;

	/**
	 * Callback to regenerate ticket.
	 */
	onRegenerate: () => void;

	/**
	 * Callback to update ticket content.
	 */
	onUpdateContent: (content: string) => void;
}

export const OutputSection = ({
	currentTicket,
	streamedContent,
	isGenerating,
	onUpdateContent,
	onRegenerate,
}: OutputSectionProps) => {
	const classes = {
		preview: cn('prose prose-sm dark:prose-invert max-w-none'),
		previewScroll: cn('h-[400px] rounded-lg border p-4'),
		markdownScroll: cn('h-[400px] rounded-lg border'),
		editContent: cn('pt-6'),
		editStack: cn('space-y-4'),
		editTextarea: cn('min-h-[400px] font-mono text-sm'),
		editActions: cn('flex gap-2'),
		header: cn('flex items-center justify-between'),
		headerActions: cn('flex gap-2'),
		codeBlock: cn('whitespace-pre-wrap p-4 font-mono text-sm'),
	};

	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState('');
	const [copied, setCopied] = useState(false);

	const displayContent = currentTicket?.content || streamedContent;
	const hasContent = Boolean(displayContent);

	const handleCopy = useCallback(async () => {
		if (!displayContent) return;
		await navigator.clipboard.writeText(displayContent);
		setCopied(true);
		toast.success('Copied to clipboard');
		setTimeout(() => setCopied(false), 2000);
	}, [displayContent]);

	const handleEdit = useCallback(() => {
		setEditContent(displayContent);
		setIsEditing(true);
	}, [displayContent]);

	const handleSaveEdit = useCallback(() => {
		onUpdateContent(editContent);
		setIsEditing(false);
		toast.success('Changes saved');
	}, [editContent, onUpdateContent]);

	if (!hasContent && !isGenerating) return null;

	if (isEditing) {
		return (
			<Card>
				<CardContent className={classes.editContent}>
					<div className={classes.editStack}>
						<Textarea
							value={editContent}
							onChange={(e) => setEditContent(e.target.value)}
							className={classes.editTextarea}
						/>
						<div className={classes.editActions}>
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
				<div className={classes.header}>
					<CardTitle>Generated Ticket</CardTitle>
					<div className={classes.headerActions}>
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
							onClick={onRegenerate}
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
						<ScrollArea className={classes.previewScroll}>
							<div className={classes.preview}>
								<ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
							</div>
						</ScrollArea>
					</TabsContent>
					<TabsContent value="markdown">
						<ScrollArea className={classes.markdownScroll}>
							<pre className={classes.codeBlock}>{displayContent}</pre>
						</ScrollArea>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};
