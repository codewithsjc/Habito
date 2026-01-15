import { create } from 'zustand';
import { 
  getAllHabits, 
  addHabit as dbAddHabit, 
  updateHabit as dbUpdateHabit, 
  deleteHabit as dbDeleteHabit,
  getCompletion,
  setCompletion,
  deleteCompletion,
  getCompletionsForHabit,
  exportData,
  importData
} from '../utils/db';

export const useHabitStore = create((set, get) => ({
  habits: [],
  completions: {},
  loading: true,
  filter: 'all',
  sortBy: 'order',

  // Initialize store
  initStore: async () => {
    try {
      const habits = await getAllHabits();
      set({ habits, loading: false });
    } catch (error) {
      console.error('Failed to load habits:', error);
      set({ loading: false });
    }
  },

  // Add habit
  addHabit: async (habitData) => {
    const habits = get().habits;
    const newHabit = {
      id: Date.now().toString(),
      ...habitData,
      createdAt: new Date().toISOString(),
      order: habits.length
    };
    await dbAddHabit(newHabit);
    set({ habits: [...habits, newHabit] });
    return newHabit;
  },

  // Update habit
  updateHabit: async (id, updates) => {
    const habits = get().habits;
    const index = habits.findIndex(h => h.id === id);
    if (index !== -1) {
      const updated = { ...habits[index], ...updates };
      await dbUpdateHabit(updated);
      const newHabits = [...habits];
      newHabits[index] = updated;
      set({ habits: newHabits });
    }
  },

  // Delete habit
  deleteHabit: async (id) => {
    await dbDeleteHabit(id);
    set({ habits: get().habits.filter(h => h.id !== id) });
  },

  // Toggle completion
  toggleCompletion: async (habitId, date) => {
    const completion = await getCompletion(habitId, date);
    
    if (completion) {
      await deleteCompletion(habitId, date);
    } else {
      await setCompletion(habitId, date, true);
    }
    
    // Force refresh by getting all completions again
    const completions = await getCompletionsForHabit(habitId);
    const completionMap = {};
    completions.forEach(c => {
      completionMap[c.date] = c;
    });
    
    set(state => ({
      completions: {
        ...state.completions,
        [habitId]: completionMap
      }
    }));
  },

  // Set numeric value
  setNumericValue: async (habitId, date, value) => {
    await setCompletion(habitId, date, value);
    
    const completions = await getCompletionsForHabit(habitId);
    const completionMap = {};
    completions.forEach(c => {
      completionMap[c.date] = c;
    });
    
    set(state => ({
      completions: {
        ...state.completions,
        [habitId]: completionMap
      }
    }));
  },

  // Load completions for a habit
  loadCompletions: async (habitId) => {
    const completions = await getCompletionsForHabit(habitId);
    const completionMap = {};
    completions.forEach(c => {
      completionMap[c.date] = c;
    });
    
    set(state => ({
      completions: {
        ...state.completions,
        [habitId]: completionMap
      }
    }));
  },

  // Export data
  exportBackup: async () => {
    return await exportData();
  },

  // Import data
  importBackup: async (data, mode) => {
    const result = await importData(data, mode);
    const habits = await getAllHabits();
    set({ habits });
    return result;
  },

  // Filter and sort
  setFilter: (filter) => set({ filter }),
  setSortBy: (sortBy) => set({ sortBy }),

  // Get filtered habits
  getFilteredHabits: () => {
    const { habits, filter, sortBy } = get();
    let filtered = [...habits];

    if (filter !== 'all') {
      // Add filtering logic here if needed
    }

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'order') {
      filtered.sort((a, b) => a.order - b.order);
    }

    return filtered;
  }
}));
