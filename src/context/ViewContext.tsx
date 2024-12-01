import { createContext, useContext, useState, ReactNode } from 'react';

type ViewType = 'candidate' | 'recruiter';

interface ViewContextType {
  viewType: ViewType;
  setViewType: (type: ViewType) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: ReactNode }) {
  const [viewType, setViewType] = useState<ViewType>('candidate');

  return (
    <ViewContext.Provider value={{ viewType, setViewType }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}
