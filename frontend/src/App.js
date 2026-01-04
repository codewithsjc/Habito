import React, { useState, useEffect } from 'react';
import { CheckCircle2, TrendingUp, Calendar, Plus, Settings, Moon, Sun } from 'lucide-react';
import HabitList from './components/HabitList';
import CalendarView from './components/CalendarView';
import StatsView from './components/StatsView';
import AddHabitDialog from './components/AddHabitDialog';
import SettingsDialog from './components/SettingsDialog';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

function App() {
  const [habits, setHabits] = useState([]);
  const [currentView, setCurrentView] = useState('today'); // 'today', 'calendar', 'stats'
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load habits and theme from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      // Initialize with sample habits
      const sampleHabits = [
        {
          id: '1',
          name: 'Morning Meditation',
          description: '10 minutes of mindfulness',
          color: 'teal',
          createdAt: new Date().toISOString(),
          completions: {}
        },
        {
          id: '2',
          name: 'Read for 30 minutes',
          description: 'Fiction or non-fiction',
          color: 'purple',
          createdAt: new Date().toISOString(),
          completions: {}
        },
        {
          id: '3',
          name: 'Exercise',
          description: 'Workout or yoga',
          color: 'green',
          createdAt: new Date().toISOString(),
          completions: {}
        }
      ];
      setHabits(sampleHabits);
      localStorage.setItem('habits', JSON.stringify(sampleHabits));
    }
    
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Add new habit
  const addHabit = (habitData) => {
    const newHabit = {
      id: Date.now().toString(),
      ...habitData,
      createdAt: new Date().toISOString(),
      completions: {}
    };
    setHabits([...habits, newHabit]);
    toast.success('Habit created successfully!');
  };

  // Delete habit
  const deleteHabit = (habitId) => {
    setHabits(habits.filter(h => h.id !== habitId));
    toast.success('Habit deleted');
  };

  // Edit habit
  const editHabit = (habitId, updatedData) => {
    setHabits(habits.map(h => h.id === habitId ? { ...h, ...updatedData } : h));
    toast.success('Habit updated');
  };

  // Toggle habit completion for a specific date
  const toggleHabitCompletion = (habitId, date) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completions = { ...habit.completions };
        if (completions[date]) {
          delete completions[date];
        } else {
          completions[date] = true;
        }
        return { ...habit, completions };
      }
      return habit;
    }));
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-background transition-smooth">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-notion">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Habits</h1>
                <p className="text-xs text-muted-foreground">Build better habits, one day at a time</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Moon className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex gap-2 mt-4 border-b border-border -mb-px">
            <button
              onClick={() => setCurrentView('today')}
              className={`px-4 py-2 text-sm font-medium transition-smooth ${
                currentView === 'today'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-4 py-2 text-sm font-medium transition-smooth flex items-center gap-2 ${
                currentView === 'calendar'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Calendar
            </button>
            <button
              onClick={() => setCurrentView('stats')}
              className={`px-4 py-2 text-sm font-medium transition-smooth flex items-center gap-2 ${
                currentView === 'stats'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Stats
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'today' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {habits.filter(h => h.completions[getTodayDate()]).length} of {habits.length} completed
                </p>
              </div>
              <button
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-smooth shadow-notion"
              >
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">Add Habit</span>
              </button>
            </div>
            
            <HabitList
              habits={habits}
              currentDate={getTodayDate()}
              onToggle={toggleHabitCompletion}
              onDelete={deleteHabit}
              onEdit={editHabit}
            />
          </div>
        )}

        {currentView === 'calendar' && (
          <div className="animate-fade-in">
            <CalendarView
              habits={habits}
              onToggle={toggleHabitCompletion}
            />
          </div>
        )}

        {currentView === 'stats' && (
          <div className="animate-fade-in">
            <StatsView habits={habits} />
          </div>
        )}
      </main>

      {/* Dialogs */}
      <AddHabitDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={addHabit}
      />
      
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        habits={habits}
        setHabits={setHabits}
      />
    </div>
  );
}

export default App;
