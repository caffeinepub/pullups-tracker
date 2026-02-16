import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { resetAllData } from '../lib/reset';
import { Trash2 } from 'lucide-react';

export default function ResetDataDialog() {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetAllData();
    } catch (error) {
      console.error('Reset failed:', error);
      setIsResetting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <Trash2 className="w-4 h-4 mr-2" />
          Reset All Data
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="glass-panel border-app-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-app-text-primary">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-app-text-secondary">
            This action cannot be undone. This will permanently delete all your pull-up data, 
            including sessions, records, and settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-app-border">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReset}
            disabled={isResetting}
            className="bg-app-danger hover:bg-app-danger/90"
          >
            {isResetting ? 'Resetting...' : 'Reset Everything'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
