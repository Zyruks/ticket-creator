import type { RepositoryNode } from '@domain';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TreeNode } from './TreeNode';

interface ContextTreeProps {
	/**
	 * Repository tree node data.
	 */
	tree: RepositoryNode | null;
}

export const ContextTree = ({ tree }: ContextTreeProps) => {
	if (!tree) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Repository Structure</CardTitle>
				<CardDescription>Click folders to expand/collapse</CardDescription>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[400px] rounded-lg border">
					<div className="py-2">
						<TreeNode
							node={tree}
							level={0}
						/>
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
};
