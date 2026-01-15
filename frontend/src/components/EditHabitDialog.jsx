import React, { useState, useEffect } from 'react';
import { useHabitStore } from '../store/habitStore';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

const COLORS = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
  { name: 'Teal', value: 'teal', class: 'bg-primary' },
  { name: 'Yellow', value: 'yellow', class: 'bg-yellow-500' },
];

const EditHabitDialog = ({ habit, open, onOpenChange }) => {
  const { updateHabit } = useHabitStore();
  const [formData, setFormData] = useState({
    name: habit.name,
    color: habit.color,
    unit: habit.unit || '',
    target: habit.target || '',
  });

  useEffect(() => {
    setFormData({
      name: habit.name,
      color: habit.color,
      unit: habit.unit || '',
      target: habit.target || '',
    });
  }, [habit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    try {
      await updateHabit(habit.id, {
        name: formData.name.trim(),
        color: formData.color,
        unit: habit.type === 'numeric' ? formData.unit.trim() : undefined,
        target: habit.type === 'numeric' && formData.target ? Number(formData.target) : undefined,
      });
      
      toast.success('Habit updated successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update habit');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Habit</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update your habit details.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm font-medium">
              Habit Name *
            </Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Morning Meditation"
              required
            />
          </div>

          {habit.type === 'numeric' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="edit-unit" className="text-sm font-medium">
                  Unit (optional)
                </Label>
                <Input
                  id="edit-unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., pages, miles, minutes"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-target" className="text-sm font-medium">
                  Daily Target (optional)
                </Label>
                <Input
                  id="edit-target"
                  type="number"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  placeholder="e.g., 10"
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    color.class
                  } ${
                    formData.color === color.value
                      ? 'ring-2 ring-offset-2 ring-ring scale-110'
                      : 'hover:scale-105'
                  }`}
                  aria-label={`Select ${color.name} color`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditHabitDialog;
