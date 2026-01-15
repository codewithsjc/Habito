import React, { useEffect, useState } from 'react';
import { Plus, Filter, MoreVertical, Home, BarChart3, Settings as SettingsIcon, WifiOff } from 'lucide-react';
import { useHabitStore } from './store/habitStore';
import { initDB } from './utils/db';
import HabitGrid from './components/HabitGrid';
import AddHabitDialog from './components/AddHabitDialog';
import StatsView from './components/StatsView';
import SettingsView from './components/SettingsView';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { Button } from './components/ui/button';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  
  const { initStore, loading } = useHabitStore();

  // Initialize app
  useEffect(() => {
    const init = async () => {
      try {
        // Initialize IndexedDB
        await initDB();
        
        // Load habits
        await initStore();
        
        // Register service worker
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('Service Worker registered'))
            .catch(err => console.error('Service Worker registration failed:', err));
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        toast.error('Failed to initialize app');
      }
    };

    init();
  }, [initStore]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.info('You\'re offline. Data is saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle PWA install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success('App installed successfully!');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster position="top-center" />
      
      {/* Offline indicator */}
      {!isOnline && (
        <div className="bg-warning/10 text-warning px-4 py-2 text-center text-sm flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span>Offline mode - Changes saved locally</span>
        </div>
      )}

      {/* Install prompt */}
      {showInstallPrompt && (
        <div className="bg-primary/10 text-primary px-4 py-3 flex items-center justify-between">
          <span className="text-sm">Install Habits app for offline use?</span>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setShowInstallPrompt(false)}>
              Later
            </Button>
            <Button size="sm" onClick={handleInstallClick}>
              Install
            </Button>
          </div>
        </div>
      )}

      {/* App Bar */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Habits</h1>
          
          <div className="flex items-center gap-2">
            {currentView === 'home' && (
              <>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Filter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {currentView === 'home' && <HabitGrid />}
        {currentView === 'stats' && <StatsView />}
        {currentView === 'settings' && <SettingsView />}
      </main>

      {/* Floating Action Button */}
      {currentView === 'home' && (
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="fixed right-6 bottom-24 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary-hover transition-all hover:scale-110 flex items-center justify-center"
          aria-label="Add habit"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-50 bg-card border-t border-border">
        <div className="flex items-center justify-around px-4 py-3">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'home'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button
            onClick={() => setCurrentView('stats')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'stats'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs font-medium">Stats</span>
          </button>
          
          <button
            onClick={() => setCurrentView('settings')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'settings'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <SettingsIcon className="h-5 w-5" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </nav>

      {/* Add Habit Dialog */}
      <AddHabitDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}

export default App;
