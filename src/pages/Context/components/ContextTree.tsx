import { type RepositoryNode } from '@domain/repository';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TreeNode } from './TreeNode';

interface ContextTreeProps {
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
				<ScrollArea className="h-[400px] border rounded-lg">
					<div className="py-2">
						<TreeNode node={tree} level={0} />
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
};
