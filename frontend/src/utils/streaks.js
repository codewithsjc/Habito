// Calculate current streak
export const calculateCurrentStreak = (completions, habitType = 'yesno') => {
  if (!completions || Object.keys(completions).length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);

    const completion = completions[dateStr];
    if (completion && isCompletionValid(completion, habitType)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

// Calculate longest streak
export const calculateLongestStreak = (completions, habitType = 'yesno') => {
  if (!completions || Object.keys(completions).length === 0) return 0;

  const dates = Object.keys(completions)
    .filter(date => isCompletionValid(completions[date], habitType))
    .sort();

  if (dates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    const dayDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
};

// Calculate habit strength (0-100)
// This is more sophisticated than simple streak - considers consistency over time
export const calculateHabitStrength = (completions, createdAt, habitType = 'yesno') => {
  if (!completions || Object.keys(completions).length === 0) return 0;

  const created = new Date(createdAt);
  const today = new Date();
  const daysSinceCreation = Math.floor((today - created) / (1000 * 60 * 60 * 24));
  
  if (daysSinceCreation === 0) return 0;

  // Calculate completion rate for different time windows
  const last7Days = calculateCompletionRate(completions, 7, habitType);
  const last30Days = calculateCompletionRate(completions, 30, habitType);
  const last90Days = calculateCompletionRate(completions, 90, habitType);
  const allTime = calculateCompletionRate(completions, daysSinceCreation, habitType);

  // Weight recent performance more heavily
  const strength = (
    last7Days * 0.4 +
    last30Days * 0.3 +
    last90Days * 0.2 +
    allTime * 0.1
  );

  return Math.round(strength);
};

// Calculate completion rate for a time period
export const calculateCompletionRate = (completions, days, habitType = 'yesno') => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let completed = 0;

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);

    const completion = completions[dateStr];
    if (completion && isCompletionValid(completion, habitType)) {
      completed++;
    }
  }

  return Math.round((completed / days) * 100);
};

// Check if a completion is valid based on habit type
const isCompletionValid = (completion, habitType) => {
  if (!completion) return false;
  
  if (habitType === 'yesno') {
    return completion.value === true;
  } else if (habitType === 'numeric') {
    return typeof completion.value === 'number' && completion.value > 0;
  }
  
  return false;
};

// Format date as YYYY-MM-DD
export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get dates for the last N days
export const getLastNDays = (n) => {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }

  return dates;
};

// Format date for display (e.g., "MON 26")
export const formatDateDisplay = (date) => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const d = new Date(date);
  return `${days[d.getDay()]} ${d.getDate()}`;
};

// Check if date is today
export const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  return d.toDateString() === today.toDateString();
};

// Check if date is in the future
export const isFuture = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d > today;
};

// Get completion status for a date
export const getCompletionStatus = (completions, date, habitType) => {
  const dateStr = formatDate(date);
  const completion = completions?.[dateStr];
  
  if (!completion) return null;
  
  if (habitType === 'yesno') {
    return completion.value === true ? 'completed' : null;
  } else if (habitType === 'numeric') {
    return completion.value;
  }
  
  return null;
};

// Calculate statistics for a habit
export const calculateHabitStats = (habit, completions) => {
  const currentStreak = calculateCurrentStreak(completions, habit.type);
  const longestStreak = calculateLongestStreak(completions, habit.type);
  const strength = calculateHabitStrength(completions, habit.createdAt, habit.type);
  const completionRate = calculateCompletionRate(completions, 30, habit.type);
  
  return {
    currentStreak,
    longestStreak,
    strength,
    completionRate30Days: completionRate,
    totalCompletions: Object.keys(completions || {}).length
  };
};
