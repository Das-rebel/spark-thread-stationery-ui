import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    push: boolean;
    email: boolean;
    inApp: boolean;
  };
  privacy: {
    analytics: boolean;
    profileVisibility: 'public' | 'private' | 'friends';
  };
  display: {
    density: 'compact' | 'comfortable' | 'spacious';
    fontSize: 'small' | 'medium' | 'large';
    animations: boolean;
  };
  preferences: {
    defaultView: 'feed' | 'neural' | 'bookmarks';
    autoSave: boolean;
    syncInterval: number;
  };
}

const defaultSettings: UserSettings = {
  theme: 'auto',
  language: 'en',
  notifications: {
    push: true,
    email: false,
    inApp: true,
  },
  privacy: {
    analytics: true,
    profileVisibility: 'public',
  },
  display: {
    density: 'comfortable',
    fontSize: 'medium',
    animations: true,
  },
  preferences: {
    defaultView: 'feed',
    autoSave: true,
    syncInterval: 300, // 5 minutes
  },
};

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetSettings: () => void;
  isLoading: boolean;
  error: string | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('spark-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('spark-settings', JSON.stringify(settings));
        // Apply theme changes immediately
        applyTheme(settings.theme);
      } catch (err) {
        console.error('Failed to save settings:', err);
        setError('Failed to save settings');
      }
    }
  }, [settings, isLoading]);

  const applyTheme = (theme: UserSettings['theme']) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto theme - check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      
      // Deep merge for nested objects
      Object.keys(updates).forEach(key => {
        const updateKey = key as keyof UserSettings;
        if (typeof updates[updateKey] === 'object' && updates[updateKey] !== null) {
          newSettings[updateKey] = { 
            ...newSettings[updateKey], 
            ...updates[updateKey] 
          } as any;
        } else {
          newSettings[updateKey] = updates[updateKey] as any;
        }
      });
      
      return newSettings;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('spark-settings');
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
    error,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};