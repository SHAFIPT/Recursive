export interface TreeNode {
  id: string;
  name: string;
  parentId: string | null;
  children: TreeNode[];
  isExpanded: boolean;
  createdAt?: string; 
}

export interface CreateNodeRequest {
  name: string;
  parentId?: string | null;
}

export interface UpdateNodeRequest {
  name: string;
}
