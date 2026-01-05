import { cn } from '@common';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	ScrollArea,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@components';
import { TEMPLATE_CATEGORIES, type TicketTemplate } from '@domain';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TemplatePreviewDialogProps {
	/**
	 * Whether the dialog is open
	 */
	open: boolean;

	/**
	 * The template to preview
	 */
	template: TicketTemplate;

	/**
	 * Callback when dialog open state changes
	 */
	onOpenChange: (open: boolean) => void;
}

export function TemplatePreviewDialog({ onOpenChange, open, template }: TemplatePreviewDialogProps) {
	const categoryInfo = TEMPLATE_CATEGORIES[template.category];

	const classes = {
		codeBlock: cn('whitespace-pre-wrap rounded-md bg-muted p-4 font-mono text-sm', 'border border-border'),
		exampleRequest: cn(
			'rounded-md border border-primary/20 bg-primary/10 p-4',
			'text-sm italic text-foreground/90',
		),
		prose: cn(
			'prose prose-sm dark:prose-invert max-w-none',
			'prose-headings:text-foreground prose-headings:font-semibold',
			'prose-h1:text-xl prose-h1:border-b prose-h1:border-border prose-h1:pb-2 prose-h1:mb-4',
			'prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3',
			'prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2',
			'prose-p:text-foreground/90 prose-p:leading-relaxed',
			'prose-strong:text-foreground prose-strong:font-semibold',
			'prose-ul:my-2 prose-li:my-0.5',
			'prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs',
			'prose-pre:bg-muted prose-pre:border prose-pre:border-border',
		),
		sectionTitle: cn('mb-3 font-semibold text-foreground text-sm uppercase tracking-wide'),
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="max-h-[85vh] max-w-4xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<span className="text-xl">{categoryInfo.icon}</span>
						<span>{template.name} Template</span>
					</DialogTitle>
					<DialogDescription>{template.description}</DialogDescription>
				</DialogHeader>

				<Tabs
					defaultValue="template"
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="template">Template Structure</TabsTrigger>
						<TabsTrigger value="example">Example Output</TabsTrigger>
					</TabsList>

					<TabsContent
						value="template"
						className="mt-4"
					>
						<ScrollArea className="h-[500px] pr-4">
							<p className={classes.sectionTitle}>Template Structure</p>
							<p className="mb-4 text-muted-foreground text-sm">
								This template will be used to structure your generated tickets:
							</p>
							<pre className={classes.codeBlock}>{template.content}</pre>
						</ScrollArea>
					</TabsContent>

					<TabsContent
						value="example"
						className="mt-4"
					>
						<ScrollArea className="h-[500px] pr-4">
							<div className="space-y-6">
								<div>
									<p className={classes.sectionTitle}>Example Request</p>
									<p className={classes.exampleRequest}>"{template.example.request}"</p>
								</div>

								<div>
									<p className={classes.sectionTitle}>Generated Output</p>
									<div className={cn('rounded-lg border border-border bg-card p-6', classes.prose)}>
										<ReactMarkdown remarkPlugins={[remarkGfm]}>{template.example.output}</ReactMarkdown>
									</div>
								</div>
							</div>
						</ScrollArea>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
