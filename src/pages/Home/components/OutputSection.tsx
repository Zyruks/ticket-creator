import { type GeneratedTicket } from '@domain/ticket';
import { Check, Copy, Edit3, RefreshCw } from 'lucide-react';
import { useCallback, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

import { cn } from '@common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface OutputSectionProps {
	currentTicket: GeneratedTicket | null;
	streamedContent: string;
	isGenerating: boolean;
	onUpdateContent: (content: string) => void;
	onRegenerate: () => void;
}

export const OutputSection = ({
	currentTicket,
	streamedContent,
	isGenerating,
	onUpdateContent,
	onRegenerate,
}: OutputSectionProps) => {
	// 1. CLASSES OBJECT
	const classes = {
		preview: cn('prose prose-sm max-w-none dark:prose-invert'),
		previewScroll: cn('h-[400px] border rounded-lg p-4'),
		markdownScroll: cn('h-[400px] border rounded-lg'),
		editContent: cn('pt-6'),
		editStack: cn('space-y-4'),
		editTextarea: cn('min-h-[400px] font-mono text-sm'),
		editActions: cn('flex gap-2'),
		header: cn('flex items-center justify-between'),
		headerActions: cn('flex gap-2'),
		codeBlock: cn('p-4 text-sm font-mono whitespace-pre-wrap'),
	};

	// 2. STATE
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState('');
	const [copied, setCopied] = useState(false);

	const displayContent = currentTicket?.content || streamedContent;
	const hasContent = Boolean(displayContent);

	// 3. CALLBACKS
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

	// 4. RENDERS
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
				<div className={classes.header}>
					<CardTitle>Generated Ticket</CardTitle>
					<div className={classes.headerActions}>
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
							onClick={onRegenerate}
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
}
