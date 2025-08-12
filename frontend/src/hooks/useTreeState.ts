import { useState, useEffect, useCallback } from 'react';
import { TreeNode } from '@/types/tree';
import { nodeService } from '@/service/nodeService';

export interface BackendNode {
  id: string;
  name: string;
  parent: string | null;
  createdAt?: string;
}

export const useTreeState = () => {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapBackendToFrontend = (backendNodes: BackendNode[]): TreeNode[] => {
    return backendNodes.map(node => ({
      id: node.id,
      name: node.name,
      parentId: node.parent,
      children: [],
      isExpanded: false,
      createdAt: node.createdAt,
    }));
  };

  // Helper function to build tree structure from flat list
  const buildTreeStructure = (flatNodes: TreeNode[]): TreeNode[] => {
    const nodeMap = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    // Initialize all nodes with empty children arrays
    flatNodes.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [], isExpanded: node.isExpanded || false });
    });

    // Build the tree structure
    flatNodes.forEach(node => {
      const treeNode = nodeMap.get(node.id)!;
      
      if (node.parentId && nodeMap.has(node.parentId)) {
        const parent = nodeMap.get(node.parentId)!;
        parent.children.push(treeNode);
      } else {
        roots.push(treeNode);
      }
    });

    return roots;
  };

  const updateNodeInTree = useCallback((nodes: TreeNode[], nodeId: string, updates: Partial<TreeNode>): TreeNode[] => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, ...updates };
      }
      if (node.children.length > 0) {
        return {
          ...node,
          children: updateNodeInTree(node.children, nodeId, updates)
        };
      }
      return node;
    });
  }, []);

  const removeNodeFromTree = useCallback((nodes: TreeNode[], nodeId: string): TreeNode[] => {
    return nodes.filter(node => {
      if (node.id === nodeId) {
        return false;
      }
      if (node.children.length > 0) {
        node.children = removeNodeFromTree(node.children, nodeId);
      }
      return true;
    });
  }, []);

  const findNodeById = useCallback((nodes: TreeNode[], nodeId: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === nodeId) return node;
      if (node.children.length > 0) {
        const found = findNodeById(node.children, nodeId);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const loadNodes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const backendData = await nodeService.getAllNodes();
      console.log('Raw backend data:', backendData);
      
      const mappedData = mapBackendToFrontend(backendData);
      console.log('Mapped frontend data:', mappedData);
      
      const treeStructure = buildTreeStructure(mappedData);
      console.log('Final tree structure:', treeStructure);
      
      setNodes(treeStructure);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load nodes');
      setNodes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addNode = useCallback(async (parentId: string | null, name: string) => {
    try {
      setError(null);
      console.log('useTreeState addNode called with:', { parentId, name });
      
      const newNode = await nodeService.createNode({ name, parentId });
      console.log('New node created:', newNode);
      
      const mappedNewNode = {
        id: newNode.id,
        name: newNode.name,
        parentId: newNode.parent || null, 
        children: [],
        isExpanded: false,
        createdAt: newNode.createdAt,
      };
      
      if (parentId) {
        await loadNodes();
      } else {
        setNodes(prevNodes => [...prevNodes, mappedNewNode]);
      }
    } catch (err) {
      console.error('Error in addNode:', err);
      setError(err instanceof Error ? err.message : 'Failed to add node');
    }
  }, [loadNodes]);

  const deleteNode = useCallback(async (nodeId: string) => {
    try {
      setError(null);
      await nodeService.deleteNode(nodeId);
      setNodes(prevNodes => removeNodeFromTree(prevNodes, nodeId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete node');
    }
  }, [removeNodeFromTree]);

  const toggleNode = useCallback((nodeId: string) => {
    setNodes(prevNodes => 
      updateNodeInTree(prevNodes, nodeId, { 
        isExpanded: !findNodeById(prevNodes, nodeId)?.isExpanded 
      })
    );
  }, [updateNodeInTree, findNodeById]);

  const updateNodeName = useCallback((nodeId: string, name: string) => {
    setNodes(prevNodes => updateNodeInTree(prevNodes, nodeId, { name }));
  }, [updateNodeInTree]);

  useEffect(() => {
    loadNodes();
  }, [loadNodes]);

  return {
    nodes,
    isLoading,
    error,
    addNode,
    deleteNode,
    toggleNode,
    updateNodeName,
    refreshNodes: loadNodes,
  };
};