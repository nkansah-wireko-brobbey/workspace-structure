// store/workspaceStore.ts
import { create } from 'zustand';
// In store/workspaceStore.ts
export type WorkspaceTreeItem = {
  id: string;
  name: string;
  type: 'workspace' | 'folder' | 'document';
  children?: WorkspaceTreeItem[];
  level: number;
};
type Document = {
  id: string;
  name: string;
  parentId: string | null;
  content: string;
  lastModified: Date;
};

type Folder = {
  id: string;
  name: string;
  parentId: string | null;
  workspaceId: string;
};

type Workspace = {
  id: string;
  name: string;
  viewPermission: string[];
  editPermission: string[];
};

interface WorkspaceState {
  // Array-based state
  workspaces: Workspace[];
  folders: Folder[];
  documents: Document[];
  
  // UI State
  activeWorkspaceId: string | null;
  activeDocumentId: string | null;
  
  // Actions
  setActiveWorkspace: (id: string) => void;
  setActiveDocument: (id: string) => void;
  updateDocumentContent: (id: string, content: string) => void;
  
  // Computed/Getters
  getCurrentWorkspace: () => Workspace | null;
  getActiveDocument: () => Document | null;
  getWorkspaceTree: (workspaceId: string) => WorkspaceTreeItem[];
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  // Initial State with arrays
  workspaces: [
    {
      id: 'ws-001',
      name: 'Design Hub',
      viewPermission: ['user1', 'user2', 'user3'],
      editPermission: ['user1'],
    }
  ],
  folders: [
    {
      id: 'folder-1',
      name: 'Main Projects',
      parentId: null,
      workspaceId: 'ws-001',
    },
    {
      id: 'folder-2',
      name: 'Main Projects',
      parentId: 'folder-1',
      workspaceId: 'ws-001',
    },
    {
      id: 'folder-3',
      name: 'Main Projects',
      parentId: null,
      workspaceId: 'ws-001',
    },
    {
      id: 'folder-4',
      name: 'Main Projects',
      parentId: null,
      workspaceId: 'ws-001',
    },
  ],
  documents: [
    {
      id: 'doc-1',
      name: 'Project A',
      parentId: 'folder-1',
      content: '# Welcome',
      lastModified: new Date(),
    },
    {
      id: 'doc-2',
      name: 'Project A',
      parentId: 'folder-2',
      content: '# Welcome',
      lastModified: new Date(),
    },
    {
      id: 'doc-3',
      name: 'Project A',
      parentId: 'folder-1',
      content: '# Welcome',
      lastModified: new Date(),
    },
    {
      id: 'doc-4',
      name: 'Project A',
      parentId: 'folder-1',
      content: '# Welcome',
      lastModified: new Date(),
    },
  ],
  activeWorkspaceId: null,
  activeDocumentId: null,

  // Actions updated for array usage
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
  
  setActiveDocument: (id) => set({ activeDocumentId: id }),
  
  updateDocumentContent: (id, content) => 
    set((state) => ({
      documents: state.documents.map(doc => 
        doc.id === id 
          ? { ...doc, content, lastModified: new Date() }
          : doc
      )
    })),

  // Computed values updated for arrays
  getCurrentWorkspace: () => {
    const { activeWorkspaceId, workspaces } = get();
    return workspaces.find(ws => ws.id === activeWorkspaceId) || null;
  },
  
  getActiveDocument: () => {
    const { activeDocumentId, documents } = get();
    return documents.find(doc => doc.id === activeDocumentId) || null;
  },
  
  getWorkspaceTree: (workspaceId) => {
    const { folders, documents } = get();
    
    const buildTree = (parentId: string | null, level: number): WorkspaceTreeItem[] => {
      const items: WorkspaceTreeItem[] = [];

      // Add folders
      folders
        .filter(f => f.workspaceId === workspaceId && f.parentId === parentId)
        .forEach(folder => {
          items.push({
            id: folder.id,
            name: folder.name,
            type: 'folder',
            children: buildTree(folder.id, level + 1),
            level
          });
        });

      // Add documents
      documents
        .filter(d => (parentId === null && d.parentId === null) || 
                    (d.parentId === parentId))
        .forEach(doc => {
          items.push({
            id: doc.id,
            name: doc.name,
            type: 'document',
            level
          });
        });
console.log(items);
      return items;
    };

    return buildTree(null, 0);
  }
}));