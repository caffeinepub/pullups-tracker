import { useState } from 'react';
import { offlineDb } from '../lib/offlineDb';
import { Button } from '@/components/ui/button';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { useSfx } from '../hooks/useSfx';
import { triggerHaptic } from '../lib/haptics';

export default function BackupRestorePanel() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { play } = useSfx();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const jsonData = await offlineDb.exportData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pullups-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      play('save-chime');
      triggerHaptic('medium');
    } catch (error) {
      console.error('Export failed:', error);
      triggerHaptic('strong');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      await offlineDb.importData(text);
      
      play('save-chime');
      triggerHaptic('medium');
      
      // Reload page to refresh all data
      window.location.reload();
    } catch (error) {
      console.error('Import failed:', error);
      triggerHaptic('strong');
      alert('Import failed. Please check the file format.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-app-text-primary mb-2">Backup & Restore</h3>
        <p className="text-sm text-app-text-secondary mb-4">
          Export your data to a JSON file for safekeeping, or restore from a previous backup.
          Includes sessions, quality records, milestones, settings, coins, chest history, and card wallet.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-app-accent hover:bg-app-accent/90 text-app-bg-primary"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Data'}
        </Button>

        <label className="w-full">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={isImporting}
            className="hidden"
          />
          <Button
            asChild
            variant="outline"
            disabled={isImporting}
            className="w-full cursor-pointer"
          >
            <span>
              <Upload className="w-4 h-4 mr-2" />
              {isImporting ? 'Importing...' : 'Import Data'}
            </span>
          </Button>
        </label>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-yellow-500">
          Importing will replace all current data. Make sure to export first if you want to keep your current progress.
        </p>
      </div>
    </div>
  );
}
