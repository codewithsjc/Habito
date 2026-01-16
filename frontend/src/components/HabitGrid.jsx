import React, { useEffect, useState, useRef } from "react";
import { useHabitStore } from "../store/habitStore";
import {
  getLastNDays,
  formatDateDisplay,
  formatDate,
  isToday,
  getCompletionStatus,
} from "../utils/streaks";
import {
  Check,
  MoreVertical,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EditHabitDialog from "./EditHabitDialog";
import NumericInputDialog from "./NumericInputDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { motion } from "framer-motion";

const HABIT_COLORS = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  purple: "bg-purple-500",
  green: "bg-green-500",
  pink: "bg-pink-500",
  teal: "bg-primary",
  yellow: "bg-yellow-500",
};

const HabitGrid = () => {
  const {
    habits,
    completions,
    toggleCompletion,
    deleteHabit,
    loadCompletions,
  } = useHabitStore();
  const [dates, setDates] = useState(getLastNDays(7));
  const [editingHabit, setEditingHabit] = useState(null);
  const [numericInput, setNumericInput] = useState(null);
  const scrollContainerRef = useRef(null);

  // Load completions for all habits
  useEffect(() => {
    habits.forEach((habit) => {
      loadCompletions(habit.id);
    });
  }, [habits, loadCompletions]);

  // Auto-scroll to show today
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, [dates]);

  const handleCellClick = (habit, date) => {
    if (habit.type === "numeric") {
      setNumericInput({ habit, date });
    } else {
      toggleCompletion(habit.id, formatDate(date));

      // Haptic feedback if supported
      if ("vibrate" in navigator) {
        navigator.vibrate(10);
      }
    }
  };

  const handleLongPress = (habit, date) => {
    if (habit.type === "yesno") {
      setNumericInput({ habit, date, allowNotes: true });
    }
  };

  const handleDelete = async (habitId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this habit? This will also delete all its history."
      )
    ) {
      await deleteHabit(habitId);
      toast.success("Habit deleted");
    }
  };

  const scrollDates = (direction) => {
    const today = new Date();
    const currentStart = dates[0];
    const daysToShift = 7;

    if (direction === "left") {
      // Go back in time
      const newStart = new Date(currentStart);
      newStart.setDate(newStart.getDate() - daysToShift);
      setDates(getLastNDaysFrom(newStart, 7));
    } else {
      // Go forward (but not beyond today)
      const newStart = new Date(currentStart);
      newStart.setDate(newStart.getDate() + daysToShift);

      if (newStart <= today) {
        setDates(getLastNDaysFrom(newStart, 7));
      } else {
        // Reset to show last 7 days including today
        setDates(getLastNDays(7));
      }
    }
  };

  const getLastNDaysFrom = (startDate, n) => {
    const dates = [];
    for (let i = 0; i < n; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const renderStatusCell = (habit, date) => {
    // const dateStr = formatDate(date);
    const habitCompletions = completions[habit.id] || {};
    const status = getCompletionStatus(habitCompletions, date, habit.type);
    const today = isToday(date);

    const cellClasses = `
      flex items-center justify-center h-12 rounded-lg transition-all cursor-pointer
      ${today ? "ring-2 ring-primary ring-offset-2" : ""}
    `;

    const colorClasses = {
      blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      red: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
      orange:
        "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
      purple:
        "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      green:
        "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      pink: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
      teal: "bg-primary-light text-primary",
      yellow:
        "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    };

    const habitColor = colorClasses[habit.color] || colorClasses.blue;

    if (habit.type === "yesno") {
      if (status === "completed") {
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`${cellClasses} ${habitColor.split(" ")[0]} ${
              habitColor.split(" ")[1]
            }`}
          >
            <Check
              className={`h-5 w-5 ${habitColor.split(" ")[2]} ${
                habitColor.split(" ")[3]
              }`}
              strokeWidth={3}
            />
          </motion.div>
        );
      } else {
        return (
          <div className={`${cellClasses} bg-muted hover:bg-muted/80`}>
            {/* Empty cell */}
          </div>
        );
      }
    } else if (habit.type === "numeric") {
      if (status && typeof status === "number") {
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`${cellClasses} ${habitColor} flex-col`}
          >
            <span className={`text-sm font-bold`}>{status}</span>
            {habit.unit && <span className={`text-xs`}>{habit.unit}</span>}
          </motion.div>
        );
      } else {
        return (
          <div className={`${cellClasses} bg-muted hover:bg-muted/80`}>
            {/* Empty cell */}
          </div>
        );
      }
    }
  };

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No habits yet
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Create your first habit to start tracking
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Date header with scroll */}
      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => scrollDates("left")}
            className="p-1 hover:bg-muted rounded-md transition-colors flex-shrink-0"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex gap-1 min-w-max px-2">
              <div className="w-32 flex-shrink-0" />{" "}
              {/* Spacer for habit names */}
              {dates.map((date, index) => (
                <div
                  key={index}
                  className={`flex-1 min-w-[60px] text-center ${
                    isToday(date)
                      ? "text-primary font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  <div className="text-xs font-medium">
                    {formatDateDisplay(date)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => scrollDates("right")}
            className="p-1 hover:bg-muted rounded-md transition-colors flex-shrink-0"
            aria-label="Next week"
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Habit rows */}
      <div className="flex-1 overflow-y-auto">
        {habits.map((habit, habitIndex) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: habitIndex * 0.05 }}
            className="flex items-center px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors"
          >
            {/* Habit info */}
            <div className="w-32 flex-shrink-0 flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  HABIT_COLORS[habit.color] || HABIT_COLORS.blue
                } flex-shrink-0`}
              />
              <span className="font-medium text-sm text-foreground truncate">
                {habit.name}
              </span>
            </div>

            {/* Status cells */}
            <div className="flex-1 flex gap-1">
              {dates.map((date, dateIndex) => (
                <div
                  key={dateIndex}
                  className="flex-1 min-w-[60px]"
                  onClick={() => handleCellClick(habit, date)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleLongPress(habit, date);
                  }}
                >
                  {renderStatusCell(habit, date)}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="w-8 flex-shrink-0 ml-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 hover:bg-muted rounded-md transition-colors">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditingHabit(habit)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(habit.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingHabit && (
        <EditHabitDialog
          habit={editingHabit}
          open={!!editingHabit}
          onOpenChange={(open) => !open && setEditingHabit(null)}
        />
      )}

      {/* Numeric Input Dialog */}
      {numericInput && (
        <NumericInputDialog
          habit={numericInput.habit}
          date={numericInput.date}
          open={!!numericInput}
          onOpenChange={(open) => !open && setNumericInput(null)}
        />
      )}
    </div>
  );
};

export default HabitGrid;
