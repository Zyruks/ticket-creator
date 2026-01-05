import { cn } from '@common';
import type { RepositoryNode } from '@domain';
import { ChevronDown, ChevronRight, File, Folder, FolderOpen } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface TreeNodeProps {
	/**
	 * Nesting level of the node.
	 */
	level: number;
	/**
	 * Repository node data.
	 */
	node: RepositoryNode;
}

export const TreeNode = ({ node, level }: TreeNodeProps) => {
	const classes = {
		row: cn(
			'flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 hover:bg-muted/50',
			'focus:outline-none focus:ring-2 focus:ring-primary/20',
		),
		childrenContainer: cn(''),
	};

	const sortedChildren = node.children
		? [...node.children].sort((childNodeA, childNodeB) => {
				if (childNodeA.type === childNodeB.type) return childNodeA.name.localeCompare(childNodeB.name);

				return childNodeA.type === 'directory' ? -1 : 1;
			})
		: [];

	const [isExpanded, setIsExpanded] = useState(level < 2);

	const isDirectory = node.type === 'directory';
	const hasChildren = isDirectory && node.children && node.children.length > 0;
	const paddingLeft = `${level * 16 + 8}px`;

	const handleToggle = useCallback(() => {
		if (hasChildren) setIsExpanded((prev) => !prev);
	}, [hasChildren]);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (hasChildren && (event.key === 'Enter' || event.key === ' ')) {
				event.preventDefault();
				handleToggle();
			}
		},
		[hasChildren, handleToggle],
	);

	const renderToggleIcon = () => {
		if (!hasChildren) return <span className="w-4" />;
		if (isExpanded) return <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />;
		return <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />;
	};

	const renderTypeIcon = () => {
		if (!isDirectory) return <File className="h-4 w-4 shrink-0 text-muted-foreground" />;
		if (isExpanded) return <FolderOpen className="h-4 w-4 shrink-0 text-amber-500" />;
		return <Folder className="h-4 w-4 shrink-0 text-amber-500" />;
	};

	return (
		<div>
			{/* Node Row */}
			{/* biome-ignore lint/a11y/noStaticElementInteractions: handled manually with role and keyboard listeners */}
			<div
				role={hasChildren ? 'button' : undefined}
				tabIndex={hasChildren ? 0 : undefined}
				className={classes.row}
				style={{ paddingLeft }}
				onClick={handleToggle}
				onKeyDown={handleKeyDown}
			>
				{renderToggleIcon()}
				{renderTypeIcon()}
				<span className={`text-sm ${node.important ? 'font-medium' : ''}`}>{node.name}</span>
				{node.important && (
					<Badge
						variant="outline"
						className="ml-2 py-0 text-xs"
					>
						key file
					</Badge>
				)}
			</div>

			{/* Children */}
			{isExpanded && hasChildren && (
				<div className={classes.childrenContainer}>
					{sortedChildren.map((child) => (
						<TreeNode
							key={child.path}
							node={child}
							level={level + 1}
						/>
					))}
				</div>
			)}
		</div>
	);
};
