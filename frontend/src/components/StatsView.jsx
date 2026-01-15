import React, { useEffect, useState } from 'react';
import { useHabitStore } from '../store/habitStore';
import { calculateHabitStats } from '../utils/streaks';
import { Flame, TrendingUp, Target, Award, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { motion } from 'framer-motion';

const StatsView = () => {
  const { habits, completions, loadCompletions } = useHabitStore();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // Load completions for all habits
    const loadStats = async () => {
      const promises = habits.map(async (habit) => {
        await loadCompletions(habit.id);
        const habitCompletions = completions[habit.id] || {};
        const habitStats = calculateHabitStats(habit, habitCompletions);
        return { habit, stats: habitStats };
      });

      const results = await Promise.all(promises);
      setStats(results);
    };

    if (habits.length > 0) {
      loadStats();
    }
  }, [habits, completions, loadCompletions]);

  // Calculate overall stats
  const totalHabits = habits.length;
  const avgStrength = stats.length > 0
    ? Math.round(stats.reduce((sum, s) => sum + s.stats.strength, 0) / stats.length)
    : 0;
  const totalStreaks = stats.reduce((sum, s) => sum + s.stats.currentStreak, 0);
  const longestStreak = Math.max(...stats.map(s => s.stats.longestStreak), 0);

  const getStrengthColor = (strength) => {
    if (strength >= 80) return 'text-green-600';
    if (strength >= 60) return 'text-blue-600';
    if (strength >= 40) return 'text-yellow-600';
    return 'text-muted-foreground';
  };

  const getStrengthLabel = (strength) => {
    if (strength >= 80) return 'Strong';
    if (strength >= 60) return 'Good';
    if (strength >= 40) return 'Building';
    return 'New';
  };

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
            <BarChart3 className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No stats yet</h3>
          <p className="text-sm text-muted-foreground">Create some habits to see your statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium">Active Habits</p>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{totalHabits}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium">Avg Strength</p>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <p className="text-2xl font-bold text-foreground">{avgStrength}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium">Total Streaks</p>
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{totalStreaks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium">Best Streak</p>
              <Award className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{longestStreak}</p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Habit Stats */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Habit Details</h2>
        
        {stats.map(({ habit, stats: habitStats }, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${habit.color}-500`} />
                    <CardTitle className="text-base font-semibold">{habit.name}</CardTitle>
                  </div>
                  <div className={`text-sm font-bold ${getStrengthColor(habitStats.strength)}`}>
                    {getStrengthLabel(habitStats.strength)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Strength */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Habit Strength</span>
                    <span className="font-semibold">{habitStats.strength}%</span>
                  </div>
                  <Progress value={habitStats.strength} className="h-2" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 text-center pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current</p>
                    <p className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      {habitStats.currentStreak}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Best</p>
                    <p className="text-lg font-bold text-foreground">
                      {habitStats.longestStreak}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">30d Rate</p>
                    <p className="text-lg font-bold text-foreground">
                      {habitStats.completionRate30Days}%
                    </p>
                  </div>
                </div>

                {/* Total Completions */}
                <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                  {habitStats.totalCompletions} total {habitStats.totalCompletions === 1 ? 'completion' : 'completions'}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsView;
