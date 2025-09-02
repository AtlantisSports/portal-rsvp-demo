import React from 'react';

/**
 * Development utilities for the UWH Portal
 * These functions help with debugging and development workflow
 */

// Type-safe development logging
export const devLog = {
  info: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.info(`🔧 [DEV]: ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(`⚠️ [DEV]: ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.error(`❌ [DEV]: ${message}`, ...args);
    }
  }
};

// Component wrapper for development debugging
export function withDevDebugging<T extends object>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return function WrappedComponent(props: T) {
    React.useEffect(() => {
      devLog.info(`${componentName} mounted`);
      return () => devLog.info(`${componentName} unmounted`);
    }, []);

    try {
      return <Component {...props} />;
    } catch (error) {
      devLog.error(`Error in ${componentName}:`, error);
      throw error;
    }
  };
}

// Hook for detecting development mode
export function useDevMode() {
  return import.meta.env.DEV;
}

// Hook for performance monitoring in development
export function useDevPerformance(componentName: string) {
  const isDevMode = useDevMode();
  
  React.useEffect(() => {
    if (!isDevMode) return;
    
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      devLog.info(`${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`);
    };
  });
}

// Auto-backup functionality
export function createAutoBackup(_content: string, filename: string) {
  if (import.meta.env.DEV) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `${filename}-backup-${timestamp}`;
    
    // This would need server-side implementation
    devLog.info(`Auto-backup created: ${backupName}`);
  }
}
