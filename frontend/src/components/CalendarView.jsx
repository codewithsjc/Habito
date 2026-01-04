import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const CalendarView = ({ habits, onToggle }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHabit, setSelectedHabit] = useState(habits[0]?.id || null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isFutureDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const selectedHabitData = habits.find(h => h.id === selectedHabit);
  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (habits.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No habits to display</h3>
        <p className="text-sm text-muted-foreground">Create some habits to see your calendar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Habit Selector */}
      <Card className="shadow-notion">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {habits.map((habit) => (
              <button
                key={habit.id}
                onClick={() => setSelectedHabit(habit.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  selectedHabit === habit.id
                    ? 'bg-primary text-primary-foreground shadow-notion'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {habit.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card className="shadow-notion">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">{monthName}</CardTitle>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dateStr = date.toISOString().split('T')[0];
              const isCompleted = selectedHabitData?.completions[dateStr];
              const today = isToday(date);
              const future = isFutureDate(date);

              return (
                <button
                  key={dateStr}
                  onClick={() => !future && onToggle(selectedHabit, dateStr)}
                  disabled={future}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-smooth ${
                    future
                      ? 'text-muted-foreground/40 cursor-not-allowed'
                      : isCompleted
                      ? 'bg-primary text-primary-foreground shadow-notion hover:bg-primary-hover'
                      : today
                      ? 'bg-accent text-accent-foreground hover:bg-accent/80 border-2 border-primary'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-accent border-2 border-primary" />
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted" />
              <span className="text-sm text-muted-foreground">Available</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
