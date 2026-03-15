import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Theme } from '../utils/constants';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'portfolio-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'minimal';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'minimal' || stored === 'matrix' || stored === 'cyberpunk' || stored === 'got') {
    return stored;
  }
  return 'minimal';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
