import React, { useState } from 'react';
import { MoreVertical, Trash2, Edit2, Flame } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import EditHabitDialog from './EditHabitDialog';

const HabitList = ({ habits, currentDate, onToggle, onDelete, onEdit }) => {
  const [editingHabit, setEditingHabit] = useState(null);

  // Calculate current streak for a habit
  const calculateStreak = (habit) => {
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

  const getColorClasses = (color) => {
    const colors = {
      teal: 'bg-primary/10 border-primary text-primary',
      purple: 'bg-accent/10 border-[hsl(250,40%,70%)] text-accent-foreground',
      green: 'bg-success-light border-success text-success',
      blue: 'bg-[hsl(210,52%,92%)] border-[hsl(210,52%,56%)] text-[hsl(210,52%,40%)]',
      orange: 'bg-warning-light border-warning text-warning',
      pink: 'bg-[hsl(330,52%,92%)] border-[hsl(330,52%,56%)] text-[hsl(330,52%,40%)]',
    };
    return colors[color] || colors.teal;
  };

  if (habits.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No habits yet</h3>
        <p className="text-sm text-muted-foreground">Create your first habit to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit, index) => {
        const isCompleted = habit.completions[currentDate];
        const streak = calculateStreak(habit);

        return (
          <Card
            key={habit.id}
            className="shadow-notion hover:shadow-notion-lg transition-smooth border border-border animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => onToggle(habit.id, currentDate)}
                  className={`habit-checkbox flex-shrink-0 flex items-center justify-center ${
                    isCompleted ? 'habit-checkbox-checked' : ''
                  }`}
                  aria-label={`Toggle ${habit.name}`}
                >
                  {isCompleted && (
                    <svg
                      className="w-4 h-4 text-primary-foreground animate-check"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>

                {/* Habit Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-medium text-base transition-smooth ${
                        isCompleted
                          ? 'text-muted-foreground line-through'
                          : 'text-foreground'
                      }`}
                    >
                      {habit.name}
                    </h3>
                    {habit.description && (
                      <span className="text-xs text-muted-foreground hidden sm:inline truncate">
                        • {habit.description}
                      </span>
                    )}
                  </div>
                  
                  {/* Streak Badge */}
                  {streak > 0 && (
                    <div className="flex items-center gap-2">
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
                          getColorClasses(habit.color)
                        }`}
                      >
                        <Flame className="h-3 w-3" />
                        <span>{streak} day{streak !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="p-2 rounded-lg hover:bg-muted transition-smooth flex-shrink-0"
                      aria-label="More options"
                    >
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingHabit(habit)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this habit?')) {
                          onDelete(habit.id);
                        }
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Edit Dialog */}
      {editingHabit && (
        <EditHabitDialog
          habit={editingHabit}
          open={!!editingHabit}
          onOpenChange={(open) => !open && setEditingHabit(null)}
          onEdit={onEdit}
        />
      )}
    </div>
  );
};

export default HabitList;
