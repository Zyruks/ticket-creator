/**
 * Template Selector Component
 */

import { cn } from '@common';
import { TEMPLATE_CATEGORIES, useTemplateStore } from '@domain';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TemplatePreviewDialog } from './TemplatePreviewDialog';

interface TemplateSelectorProps {
	/**
	 * Additional CSS classes
	 */
	className?: string;

	/**
	 * Whether the selector is disabled
	 */
	disabled?: boolean;
}

export function TemplateSelector({ className, disabled }: TemplateSelectorProps) {
	const { selectedTemplate, selectTemplate, templates } = useTemplateStore();
	const [showPreview, setShowPreview] = useState(false);

	const categoryInfo = TEMPLATE_CATEGORIES[selectedTemplate.category];

	return (
		<div className={cn('flex items-end gap-2', className)}>
			<div className="flex-1 space-y-1.5">
				<Label htmlFor="template-select">Template Type</Label>
				<Select
					value={selectedTemplate.id}
					onValueChange={selectTemplate}
					disabled={disabled}
				>
					<SelectTrigger
						id="template-select"
						className="w-full"
					>
						<SelectValue placeholder="Select a template">
							<span className="flex items-center gap-2">
								<span>{categoryInfo.icon}</span>
								<span>{selectedTemplate.name}</span>
							</span>
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{templates.map((template) => {
							const info = TEMPLATE_CATEGORIES[template.category];
							return (
								<SelectItem
									key={template.id}
									value={template.id}
								>
									<span className="flex items-center gap-2">
										<span>{info.icon}</span>
										<span>{template.name}</span>
										<span className="text-muted-foreground text-xs">— {info.description}</span>
									</span>
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
			</div>

			<Button
				variant="outline"
				size="icon"
				onClick={() => setShowPreview(true)}
				disabled={disabled}
				title="Preview template"
			>
				<Eye className="h-4 w-4" />
			</Button>

			<TemplatePreviewDialog
				open={showPreview}
				onOpenChange={setShowPreview}
				template={selectedTemplate}
			/>
		</div>
	);
}
