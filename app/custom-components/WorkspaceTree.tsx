import React from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import type { WorkspaceTreeItem } from '../store/workspaceStore';

interface WorkspaceTreeProps {
  workspaceId: string;
  activeDocumentId: string | null;
  onSelectDocument: (id: string) => void;
}

const WorkspaceTreeComponent: React.FC<WorkspaceTreeProps> = ({ 
  workspaceId, 
  activeDocumentId,
  onSelectDocument 
}) => {
  const tree = useWorkspaceStore((state) => state.getWorkspaceTree(workspaceId));

  const renderTreeItem = (item: WorkspaceTreeItem) => {
    const isActive = item.type === 'document' && item.id === activeDocumentId;
    
    return (
      <div 
        key={item.id}
        className={`tree-item ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: `${item.level * 16}px` }}
        onClick={() => item.type === 'document' && onSelectDocument(item.id)}
      >
        <span className="item-icon">
          {item.type === 'document' ? '📄' : '📁'}
        </span>
        <span className="item-name">{item.name}</span>
        
        {item.children?.map((child) => renderTreeItem(child))}
      </div>
    );
  };

  return (
    <div className="workspace-tree">
      {tree.map((item) => renderTreeItem(item))}
    </div>
  );
};

// Assign display name
WorkspaceTreeComponent.displayName = 'WorkspaceTree';

// Memoize with display name
export const WorkspaceTree = React.memo(WorkspaceTreeComponent);