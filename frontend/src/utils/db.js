import { openDB } from 'idb';

const DB_NAME = 'HabitsDB';
const DB_VERSION = 1;
const HABITS_STORE = 'habits';
const COMPLETIONS_STORE = 'completions';

let dbInstance = null;

// Initialize IndexedDB
export const initDB = async () => {
  if (dbInstance) return dbInstance;

  try {
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create habits store
        if (!db.objectStoreNames.contains(HABITS_STORE)) {
          const habitStore = db.createObjectStore(HABITS_STORE, { keyPath: 'id' });
          habitStore.createIndex('createdAt', 'createdAt');
          habitStore.createIndex('order', 'order');
        }

        // Create completions store
        if (!db.objectStoreNames.contains(COMPLETIONS_STORE)) {
          const completionStore = db.createObjectStore(COMPLETIONS_STORE, { keyPath: 'id' });
          completionStore.createIndex('habitId', 'habitId');
          completionStore.createIndex('date', 'date');
          completionStore.createIndex('habitId_date', ['habitId', 'date'], { unique: true });
        }
      },
    });

    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    // Fallback to localStorage if IndexedDB fails
    return null;
  }
};

// Habit CRUD operations
export const getAllHabits = async () => {
  const db = await initDB();
  if (!db) {
    // Fallback to localStorage
    const habits = localStorage.getItem('habits');
    return habits ? JSON.parse(habits) : [];
  }
  const habits = await db.getAll(HABITS_STORE);
  return habits.sort((a, b) => a.order - b.order);
};

export const getHabit = async (id) => {
  const db = await initDB();
  if (!db) {
    const habits = localStorage.getItem('habits');
    const habitList = habits ? JSON.parse(habits) : [];
    return habitList.find(h => h.id === id);
  }
  return await db.get(HABITS_STORE, id);
};

export const addHabit = async (habit) => {
  const db = await initDB();
  if (!db) {
    const habits = localStorage.getItem('habits');
    const habitList = habits ? JSON.parse(habits) : [];
    habitList.push(habit);
    localStorage.setItem('habits', JSON.stringify(habitList));
    return habit;
  }
  await db.add(HABITS_STORE, habit);
  return habit;
};

export const updateHabit = async (habit) => {
  const db = await initDB();
  if (!db) {
    const habits = localStorage.getItem('habits');
    const habitList = habits ? JSON.parse(habits) : [];
    const index = habitList.findIndex(h => h.id === habit.id);
    if (index !== -1) {
      habitList[index] = habit;
      localStorage.setItem('habits', JSON.stringify(habitList));
    }
    return habit;
  }
  await db.put(HABITS_STORE, habit);
  return habit;
};

export const deleteHabit = async (id) => {
  const db = await initDB();
  if (!db) {
    const habits = localStorage.getItem('habits');
    const habitList = habits ? JSON.parse(habits) : [];
    const filtered = habitList.filter(h => h.id !== id);
    localStorage.setItem('habits', JSON.stringify(filtered));
    return;
  }
  await db.delete(HABITS_STORE, id);
  
  // Also delete all completions for this habit
  const completions = await db.getAllFromIndex(COMPLETIONS_STORE, 'habitId', id);
  const deletePromises = completions.map(c => db.delete(COMPLETIONS_STORE, c.id));
  await Promise.all(deletePromises);
};

// Completion operations
export const getCompletion = async (habitId, date) => {
  const db = await initDB();
  if (!db) {
    const key = `completion_${habitId}_${date}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  
  const completions = await db.getAllFromIndex(COMPLETIONS_STORE, 'habitId_date', [habitId, date]);
  return completions[0] || null;
};

export const getCompletionsForHabit = async (habitId) => {
  const db = await initDB();
  if (!db) {
    const allKeys = Object.keys(localStorage);
    const completionKeys = allKeys.filter(k => k.startsWith(`completion_${habitId}_`));
    return completionKeys.map(k => JSON.parse(localStorage.getItem(k)));
  }
  return await db.getAllFromIndex(COMPLETIONS_STORE, 'habitId', habitId);
};

export const setCompletion = async (habitId, date, value, notes = '') => {
  const db = await initDB();
  const id = `${habitId}_${date}`;
  const completion = { id, habitId, date, value, notes, timestamp: Date.now() };
  
  if (!db) {
    const key = `completion_${habitId}_${date}`;
    localStorage.setItem(key, JSON.stringify(completion));
    return completion;
  }
  
  await db.put(COMPLETIONS_STORE, completion);
  return completion;
};

export const deleteCompletion = async (habitId, date) => {
  const db = await initDB();
  const id = `${habitId}_${date}`;
  
  if (!db) {
    const key = `completion_${habitId}_${date}`;
    localStorage.removeItem(key);
    return;
  }
  
  await db.delete(COMPLETIONS_STORE, id);
};

// Backup and restore
export const exportData = async () => {
  const habits = await getAllHabits();
  const db = await initDB();
  
  let completions = [];
  if (db) {
    completions = await db.getAll(COMPLETIONS_STORE);
  } else {
    const allKeys = Object.keys(localStorage);
    const completionKeys = allKeys.filter(k => k.startsWith('completion_'));
    completions = completionKeys.map(k => JSON.parse(localStorage.getItem(k)));
  }
  
  return {
    version: 1,
    exportDate: new Date().toISOString(),
    habits,
    completions
  };
};

export const importData = async (data, mode = 'overwrite') => {
  if (!data || !data.habits) {
    throw new Error('Invalid backup data');
  }
  
  const db = await initDB();
  
  if (mode === 'overwrite') {
    // Clear existing data
    if (db) {
      const tx = db.transaction([HABITS_STORE, COMPLETIONS_STORE], 'readwrite');
      await tx.objectStore(HABITS_STORE).clear();
      await tx.objectStore(COMPLETIONS_STORE).clear();
      await tx.done;
    } else {
      // Clear localStorage
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (key.startsWith('completion_')) {
          localStorage.removeItem(key);
        }
      });
      localStorage.removeItem('habits');
    }
  }
  
  // Import habits
  for (const habit of data.habits) {
    await addHabit(habit);
  }
  
  // Import completions
  if (data.completions) {
    for (const completion of data.completions) {
      if (db) {
        await db.put(COMPLETIONS_STORE, completion);
      } else {
        const key = `completion_${completion.habitId}_${completion.date}`;
        localStorage.setItem(key, JSON.stringify(completion));
      }
    }
  }
  
  return { habits: data.habits.length, completions: data.completions?.length || 0 };
};
