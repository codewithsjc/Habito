import React, { useState, useEffect } from 'react';
import { useHabitStore } from '../store/habitStore';
import { formatDate } from '../utils/streaks';
import { getCompletion } from '../utils/db';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

const NumericInputDialog = ({ habit, date, open, onOpenChange }) => {
  const { setNumericValue, deleteCompletion } = useHabitStore();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrentValue = async () => {
      const dateStr = formatDate(date);
      const completion = await getCompletion(habit.id, dateStr);
      if (completion && typeof completion.value === 'number') {
        setValue(completion.value.toString());
      }
      setLoading(false);
    };

    if (open) {
      loadCurrentValue();
    }
  }, [habit.id, date, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      toast.error('Please enter a valid number');
      return;
    }

    try {
      const dateStr = formatDate(date);
      await setNumericValue(habit.id, dateStr, numValue);
      toast.success('Value saved');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save value');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const dateStr = formatDate(date);
      await deleteCompletion(habit.id, dateStr);
      toast.success('Entry deleted');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to delete entry');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{habit.name}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="value" className="text-sm font-medium">
              {habit.unit ? `Value (${habit.unit})` : 'Value'}
            </Label>
            <Input
              id="value"
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
              autoFocus
              disabled={loading}
            />
            {habit.target && (
              <p className="text-xs text-muted-foreground">
                Target: {habit.target} {habit.unit}
              </p>
            )}
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
            {value && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="w-full sm:w-auto"
              >
                Delete
              </Button>
            )}
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 sm:flex-initial"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 sm:flex-initial">
                Save
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NumericInputDialog;
