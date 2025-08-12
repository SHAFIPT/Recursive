"use client"
import { useState } from 'react';
import { Plus, RefreshCw, AlertCircle, Folder, Loader2 } from 'lucide-react';
import { useTreeState } from '@/hooks/useTreeState';
import { TreeNodeComponent } from './TreeNode';

export default function TreeView() {
  const [newRootName, setNewRootName] = useState('');
  const [showAddRoot, setShowAddRoot] = useState(false);
  const {
    nodes,
    isLoading,
    error,
    addNode,
    deleteNode,
    toggleNode,
    updateNodeName,
    refreshNodes,
  } = useTreeState();

  const handleAddRoot = async () => {
    if (newRootName.trim()) {
      await addNode(null, newRootName.trim());
      setNewRootName('');
      setShowAddRoot(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddRoot();
    }
    if (e.key === 'Escape') {
      setShowAddRoot(false);
      setNewRootName('');
    }
  };

  const handleAddChild = async (parentId: string, name: string) => {
    await addNode(parentId, name);
  };

  const handleUpdateName = async (nodeId: string, name: string) => {
    updateNodeName(nodeId, name);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-8">
          <h1 className="text-3xl font-bold">Recursive Node Tree</h1>
          <p className="text-blue-100 mt-2 text-lg">Loading your hierarchical data...</p>
        </div>
        <div className="p-10 flex items-center justify-center py-20">
          <div className="flex items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Loading nodes...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Recursive Node Tree</h1>
            <p className="text-blue-100 mt-2 text-lg">Manage your hierarchical data structure</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={refreshNodes}
              className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 backdrop-blur-sm hover:scale-105 shadow-lg"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
            <button
              className="px-8 py-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 backdrop-blur-sm hover:scale-105 shadow-lg text-lg"
              onClick={() => setShowAddRoot(!showAddRoot)}
            >
              <Plus className="w-6 h-6" />
              Add Root Node
            </button>
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-500 bg-opacity-20 border border-red-300 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-200" />
            <div>
              <p className="text-red-100 font-semibold">Error occurred:</p>
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}
        
        {/* Add Root Input */}
        {showAddRoot && (
          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                placeholder="Enter root node name..."
                value={newRootName}
                onChange={(e) => setNewRootName(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-6 py-4 text-lg rounded-xl bg-white bg-opacity-90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white focus:bg-white transition-all duration-200 shadow-lg"
                autoFocus
              />
            </div>
            <button
              onClick={handleAddRoot}
              disabled={!newRootName.trim()}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg text-lg"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowAddRoot(false);
                setNewRootName('');
              }}
              className="px-8 py-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-lg"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-10">
        {nodes.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex flex-col items-center gap-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <Folder className="w-16 h-16 text-blue-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  No nodes yet
                </h3>
                <p className="text-lg text-gray-600">
                  Add your first root node to start building your tree structure
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {nodes.map((node, index) => (
              <TreeNodeComponent
                key={node.id}
                node={node}
                level={0}
                isLast={index === nodes.length - 1}
                parentLines={[]}
                onToggle={toggleNode}
                onAddChild={handleAddChild}
                onDelete={deleteNode}
                onUpdateName={handleUpdateName}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-10 py-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-base text-gray-600">
          <div className="flex items-center gap-8">
            <span className="font-medium">📁 {nodes.length} root node{nodes.length !== 1 ? 's' : ''}</span>
            <span>🔄 Click to expand/collapse</span>
            <span>✏️ Click name to edit</span>
            <span>🗑️ All nodes can be deleted</span>
          </div>
          <div className="text-sm opacity-75">
            Hover over nodes to see actions
          </div>
        </div>
      </div>
    </div>
  );
}