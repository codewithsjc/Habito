import React from 'react';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

const StatsView = ({ habits }) => {
  // Calculate statistics
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  
  const calculateCurrentStreak = (habit) => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (habit.completions[dateStr]) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const calculateLongestStreak = (habit) => {
    let maxStreak = 0;
    let currentStreak = 0;
    
    // Get all dates sorted
    const dates = Object.keys(habit.completions)
      .filter(date => habit.completions[date])
      .sort();
    
    if (dates.length === 0) return 0;
    
    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);
        const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
        
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          maxStreak = Math.max(maxStreak, currentStreak);
          currentStreak = 1;
        }
      }
    }
    
    return Math.max(maxStreak, currentStreak);
  };
  
  const calculateCompletionRate = (habit) => {
    const daysSinceCreation = Math.ceil(
      (new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24)
    );
    const completions = Object.keys(habit.completions).filter(
      date => habit.completions[date]
    ).length;
    
    if (daysSinceCreation === 0) return 0;
    return Math.round((completions / daysSinceCreation) * 100);
  };
  
  const totalHabits = habits.length;
  const todayCompleted = habits.filter(h => h.completions[getTodayDate()]).length;
  const todayCompletionRate = totalHabits > 0 ? Math.round((todayCompleted / totalHabits) * 100) : 0;
  
  const totalCompletions = habits.reduce((acc, habit) => {
    return acc + Object.keys(habit.completions).filter(date => habit.completions[date]).length;
  }, 0);
  
  const longestStreak = Math.max(
    ...habits.map(calculateLongestStreak),
    0
  );

  if (habits.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <TrendingUp className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No stats yet</h3>
        <p className="text-sm text-muted-foreground">Complete some habits to see your statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-notion">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Today's Progress</p>
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-foreground">{todayCompletionRate}%</p>
              <Progress value={todayCompletionRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {todayCompleted} of {totalHabits} completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-notion">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Total Completions</p>
              <Calendar className="h-5 w-5 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalCompletions}</p>
            <p className="text-xs text-muted-foreground mt-2">All-time completions</p>
          </CardContent>
        </Card>

        <Card className="shadow-notion">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Longest Streak</p>
              <Award className="h-5 w-5 text-warning" />
            </div>
            <p className="text-3xl font-bold text-foreground">{longestStreak}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {longestStreak === 1 ? 'day' : 'days'} in a row
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-notion">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Active Habits</p>
              <TrendingUp className="h-5 w-5 text-accent-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalHabits}</p>
            <p className="text-xs text-muted-foreground mt-2">Currently tracking</p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Habit Stats */}
      <Card className="shadow-notion">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Habit Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="space-y-6">
            {habits.map((habit) => {
              const currentStreak = calculateCurrentStreak(habit);
              const longestStreakForHabit = calculateLongestStreak(habit);
              const completionRate = calculateCompletionRate(habit);
              const totalCompletionsForHabit = Object.keys(habit.completions).filter(
                date => habit.completions[date]
              ).length;

              return (
                <div key={habit.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{habit.name}</h4>
                    <span className="text-sm text-muted-foreground">
                      {completionRate}% completion rate
                    </span>
                  </div>
                  
                  <Progress value={completionRate} className="h-2" />
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current Streak</p>
                      <p className="font-semibold text-foreground mt-1">
                        {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Longest Streak</p>
                      <p className="font-semibold text-foreground mt-1">
                        {longestStreakForHabit} {longestStreakForHabit === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Days</p>
                      <p className="font-semibold text-foreground mt-1">
                        {totalCompletionsForHabit}
                      </p>
                    </div>
                  </div>
                  
                  {habit !== habits[habits.length - 1] && (
                    <div className="pt-3 border-b border-border" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsView;
