import React, { useState } from 'react';
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

const AddHabitDialog = ({ open, onOpenChange, onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('teal');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    onAdd({
      name: name.trim(),
      description: description.trim(),
      color: selectedColor,
    });
    
    // Reset form
    setName('');
    setDescription('');
    setSelectedColor('teal');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Habit</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add a new habit to track. Give it a name and optionally add a description.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Habit Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Meditation"
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </Label>
            <Textarea
              id="description"
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
              Create Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
