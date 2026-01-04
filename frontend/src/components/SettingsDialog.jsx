import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { AlertCircle, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

const SettingsDialog = ({ open, onOpenChange, habits, setHabits }) => {
  const handleExport = () => {
    const dataStr = JSON.stringify(habits, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habits-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Habits exported successfully');
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedHabits = JSON.parse(event.target?.result);
        if (Array.isArray(importedHabits)) {
          setHabits(importedHabits);
          localStorage.setItem('habits', JSON.stringify(importedHabits));
          toast.success('Habits imported successfully');
          onOpenChange(false);
        } else {
          toast.error('Invalid file format');
        }
      } catch (error) {
        toast.error('Failed to import habits');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all habits? This action cannot be undone.')) {
      setHabits([]);
      localStorage.removeItem('habits');
      toast.success('All habits cleared');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Manage your habits data and preferences.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Data Management</h3>
            
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full justify-start"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Habits
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="w-full justify-start pointer-events-none">
                <Upload className="h-4 w-4 mr-2" />
                Import Habits
              </Button>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-foreground">Danger Zone</h4>
                  <p className="text-xs text-muted-foreground">
                    This will permanently delete all your habits and their history.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleClearAll}
                variant="destructive"
                className="w-full"
              >
                Clear All Habits
              </Button>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• All data is stored locally in your browser</p>
              <p>• No data is sent to any server</p>
              <p>• Export regularly to backup your data</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
