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
		exampleRequest: cn('rounded-md border border-primary/20 bg-primary/10 p-3', 'text-sm italic'),
		sectionTitle: cn('mb-2 font-medium text-muted-foreground text-sm'),
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="max-h-[80vh] max-w-2xl">
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
						<ScrollArea className="h-[400px] pr-4">
							<p className={classes.sectionTitle}>
								This template will be used to structure your generated tickets:
							</p>
							<pre className={classes.codeBlock}>{template.content}</pre>
						</ScrollArea>
					</TabsContent>

					<TabsContent
						value="example"
						className="mt-4"
					>
						<ScrollArea className="h-[400px] pr-4">
							<div className="space-y-4">
								<div>
									<p className={classes.sectionTitle}>Example Request:</p>
									<p className={classes.exampleRequest}>"{template.example.request}"</p>
								</div>

								<div>
									<p className={classes.sectionTitle}>Generated Output:</p>
									<pre className={classes.codeBlock}>{template.example.output}</pre>
								</div>
							</div>
						</ScrollArea>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
