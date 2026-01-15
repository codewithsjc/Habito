import React, { useState } from 'react';
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

const AddHabitDialog = ({ open, onOpenChange }) => {
  const { addHabit } = useHabitStore();
  const [formData, setFormData] = useState({
    name: '',
    type: 'yesno',
    color: 'blue',
    unit: '',
    target: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    try {
      await addHabit({
        name: formData.name.trim(),
        type: formData.type,
        color: formData.color,
        unit: formData.type === 'numeric' ? formData.unit.trim() : undefined,
        target: formData.type === 'numeric' && formData.target ? Number(formData.target) : undefined,
      });
      
      toast.success('Habit created successfully!');
      setFormData({ name: '', type: 'yesno', color: 'blue', unit: '', target: '' });
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create habit');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Habit</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add a new habit to track. Choose between yes/no or numeric tracking.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Habit Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Morning Meditation"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Habit Type
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yesno">Yes/No (Complete or not)</SelectItem>
                <SelectItem value="numeric">Numeric (Track quantity)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === 'numeric' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-sm font-medium">
                  Unit (optional)
                </Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., pages, miles, minutes"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target" className="text-sm font-medium">
                  Daily Target (optional)
                </Label>
                <Input
                  id="target"
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
              Create Habit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
