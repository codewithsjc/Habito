import React, { useState } from "react";
import { useHabitStore } from "../store/habitStore";
import {
  downloadBackup,
  readBackupFile,
  validateBackupData,
} from "../utils/backup";
import { Download, Upload, Moon, Sun, Info, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
// import { Separator } from './ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";

const SettingsView = () => {
  const { exportBackup, importBackup } = useHabitStore();
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    try {
      const data = await exportBackup();
      const timestamp = new Date().toISOString().split("T")[0];
      downloadBackup(data, `habits-backup-${timestamp}.json`);
      toast.success("Backup exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export backup");
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const data = await readBackupFile(file);
      const validation = validateBackupData(data);

      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }

      const result = await importBackup(data, "overwrite");
      toast.success(
        `Imported ${result.habits} habits and ${result.completions} completions`
      );
    } catch (error) {
      console.error("Import failed:", error);
      toast.error("Failed to import backup");
    } finally {
      setImporting(false);
      event.target.value = ""; // Reset file input
    }
  };

  const handleClearAll = async () => {
    try {
      await importBackup({ habits: [], completions: [] }, "overwrite");
      toast.success("All data cleared");
      setShowClearDialog(false);
    } catch (error) {
      console.error("Clear failed:", error);
      toast.error("Failed to clear data");
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <div>
                <Label
                  htmlFor="dark-mode"
                  className="text-base font-medium cursor-pointer"
                >
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  {darkMode
                    ? "Currently using dark theme"
                    : "Currently using light theme"}
                </p>
              </div>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Backup and restore your habits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full justify-start"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Backup
            </Button>

            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
                disabled={importing}
              />
              <Button
                onClick={() => document.getElementById("import-file")?.click()}
                variant="outline"
                className="w-full justify-start"
                disabled={importing}
              >
                <Upload className="h-4 w-4 mr-2" />
                {importing ? "Importing..." : "Import Backup"}
              </Button>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Important</p>
              <p className="text-muted-foreground">
                All data is stored locally on your device. Export regularly to
                backup your habits and history.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>App information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Version 1.0.0</p>
          <p>• Fully offline-capable PWA</p>
          <p>• No data sent to servers</p>
          <p>• Open source and privacy-focused</p>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">
                  Clear All Data
                </p>
                <p className="text-sm text-muted-foreground">
                  This will permanently delete all your habits and history. This
                  action cannot be undone.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowClearDialog(true)}
              variant="destructive"
              className="w-full"
            >
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clear Data Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              your habits, completions, and history from this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsView;
