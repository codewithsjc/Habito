import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

const COLORS = [
  { name: 'Teal', value: 'teal', class: 'bg-primary' },
  { name: 'Purple', value: 'purple', class: 'bg-[hsl(250,40%,70%)]' },
  { name: 'Green', value: 'green', class: 'bg-success' },
  { name: 'Blue', value: 'blue', class: 'bg-[hsl(210,52%,56%)]' },
  { name: 'Orange', value: 'orange', class: 'bg-warning' },
  { name: 'Pink', value: 'pink', class: 'bg-[hsl(330,52%,56%)]' },
];

const EditHabitDialog = ({ habit, open, onOpenChange, onEdit }) => {
  const [name, setName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description || '');
  const [selectedColor, setSelectedColor] = useState(habit.color);

  useEffect(() => {
    setName(habit.name);
    setDescription(habit.description || '');
    setSelectedColor(habit.color);
  }, [habit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    onEdit(habit.id, {
      name: name.trim(),
      description: description.trim(),
      color: selectedColor,
    });
    
    onOpenChange(false);
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
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm font-medium">
              Habit Name *
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Meditation"
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-sm font-medium">
              Description (optional)
            </Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., 10 minutes of mindfulness"
              className="w-full resize-none"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Color</Label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-10 h-10 rounded-lg transition-smooth ${
                    color.class
                  } ${
                    selectedColor === color.value
                      ? 'ring-2 ring-offset-2 ring-ring scale-110'
                      : 'hover:scale-105'
                  }`}
                  aria-label={`Select ${color.name} color`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditHabitDialog;
