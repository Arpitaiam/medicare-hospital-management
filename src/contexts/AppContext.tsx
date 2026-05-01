import { createContext, useContext, useState } from 'react';

type Page = 'home' | 'doctors' | 'book-appointment' | 'dashboard' | 'admin' | 'auth' | 'profile' | 'about';

interface AppContextType {
  page: Page;
  setPage: (page: Page) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<Page>('home');

  return (
    <AppContext.Provider value={{ page, setPage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
