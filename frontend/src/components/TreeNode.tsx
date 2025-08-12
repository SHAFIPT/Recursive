"use client"
import { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Folder, 
  FolderOpen, 
  File, 
  Edit2,
  Check,
  X 
} from 'lucide-react';
import { TreeNode } from '@/types/tree';

interface TreeNodeComponentProps {
  node: TreeNode;
  level?: number;
  isLast?: boolean;
  parentLines?: boolean[];
  onToggle: (nodeId: string) => void;
  onAddChild: (parentId: string, name: string) => void;
  onDelete: (nodeId: string) => void;
  onUpdateName: (nodeId: string, name: string) => void;
}

export const TreeNodeComponent = ({ 
  node, 
  level = 0, 
  isLast = false,
  parentLines = [],
  onToggle, 
  onAddChild, 
  onDelete, 
  onUpdateName 
}: TreeNodeComponentProps) => {
  const [newChildName, setNewChildName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const [showAddInput, setShowAddInput] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const hasChildren = node.children.length > 0;
  const isExpanded = node.isExpanded ?? false; 

  const handleAddChild = () => {
    if (newChildName.trim()) {
      onAddChild(node.id, newChildName.trim());
      setNewChildName('');
      setShowAddInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
    if (e.key === 'Escape') {
      setShowAddInput(false);
      setIsEditing(false);
      setEditName(node.name);
    }
  };

  const handleNameSave = () => {
    if (editName.trim() && editName !== node.name) {
      onUpdateName(node.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleToggle = () => {
    if (hasChildren) {
      onToggle(node.id);
    }
  };

  // Build the connection lines
  const connectionLines = parentLines.map((showLine, index) => (
    <div
      key={index}
      className={`absolute w-px bg-gray-300 ${showLine ? 'h-full' : 'h-0'}`}
      style={{ left: `${index * 32 + 16}px`, top: 0 }}
    />
  ));

  return (
    <div className="relative">
      {level > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {connectionLines}
          <div
            className="absolute h-px bg-gray-300"
            style={{
              left: `${(level - 1) * 32 + 16}px`,
              top: '28px',
              width: '24px'
            }}
          />
          {!isLast && (
            <div
              className="absolute w-px bg-gray-300"
              style={{
                left: `${(level - 1) * 32 + 16}px`,
                top: '28px',
                height: 'calc(100% - 28px)'
              }}
            />
          )}
        </div>
      )}

      {/* Node Content */}
      <div 
        className="relative flex items-center group transition-all duration-200 py-2"
        style={{ paddingLeft: `${level * 32}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background highlight */}
        <div className={`absolute inset-0 rounded-xl transition-all duration-200 ${
          isHovered ? 'bg-blue-50 shadow-md border border-blue-100' : 'hover:bg-gray-50'
        }`} />

        {/* Toggle Button */}
        <button
          className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 mr-3 ${
            hasChildren 
              ? 'hover:bg-blue-100 text-blue-600 cursor-pointer hover:scale-110' 
              : 'text-gray-300 cursor-default'
          }`}
          onClick={handleToggle}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )
          ) : (
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
          )}
        </button>

        {/* Node Icon */}
        <div className="relative z-10 flex items-center justify-center w-8 h-8 mr-3">
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="w-6 h-6 text-amber-500" />
            ) : (
              <Folder className="w-6 h-6 text-amber-600" />
            )
          ) : (
            <File className="w-5 h-5 text-gray-500" />
          )}
        </div>

        {/* Node Name */}
        <div className="relative z-10 flex-1 flex items-center min-h-[48px]">
          {isEditing ? (
            <div className="flex items-center gap-3 flex-1">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, handleNameSave)}
                className="flex-1 px-4 py-2 text-base border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white shadow-sm"
                autoFocus
              />
              <button
                onClick={handleNameSave}
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 hover:scale-110"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditName(node.name);
                }}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <span
              className={`text-base font-semibold cursor-pointer transition-all duration-200 px-2 py-1 rounded-md ${
                hasChildren ? 'text-gray-800' : 'text-gray-600'
              } hover:text-blue-600 hover:bg-blue-50`}
              onClick={() => setIsEditing(true)}
            >
              {node.name}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`relative z-10 flex items-center gap-2 transition-all duration-200 ${
          isHovered || showAddInput ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <button
            onClick={() => setShowAddInput(!showAddInput)}
            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 hover:scale-110 shadow-sm"
            title="Add child node"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110 shadow-sm"
            title="Edit name"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(node.id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110 shadow-sm"
            title="Delete node"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Add Child Input */}
      {showAddInput && (
        <div 
          className="mt-3 flex items-center gap-3 bg-green-50 p-4 rounded-xl border-2 border-green-200 shadow-sm"
          style={{ marginLeft: `${(level + 1) * 32}px` }}
        >
          <File className="w-5 h-5 text-green-600 flex-shrink-0" />
          <input
            placeholder="Enter new node name..."
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, handleAddChild)}
            className="flex-1 px-4 py-2 text-base border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
            autoFocus
          />
          <button
            onClick={handleAddChild}
            disabled={!newChildName.trim()}
            className="px-6 py-2 text-base bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-sm font-medium"
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowAddInput(false);
              setNewChildName('');
            }}
            className="px-6 py-2 text-base border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 shadow-sm font-medium"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Children */}
      {isExpanded && hasChildren && (
        <div className="mt-2">
          {node.children.map((child, index) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              isLast={index === node.children.length - 1}
              parentLines={[...parentLines, !isLast]}
              onToggle={onToggle}
              onAddChild={onAddChild}
              onDelete={onDelete}
              onUpdateName={onUpdateName}
            />
          ))}
        </div>
      )}
    </div>
  );
};