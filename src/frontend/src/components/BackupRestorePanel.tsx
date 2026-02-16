import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { exportBackup, importBackup } from '../lib/backup';
import { toast } from 'sonner';
import { Download, Upload } from 'lucide-react';

export default function BackupRestorePanel() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportBackup();
      toast.success('Backup exported successfully');
    } catch (error) {
      toast.error('Failed to export backup: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importBackup(file);
      toast.success('Backup restored successfully');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to restore backup: ' + (error as Error).message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass-card border-app-border p-6 rounded-xl space-y-4">
        <div>
          <h3 className="text-app-text-primary font-semibold mb-2">Export Backup</h3>
          <p className="text-app-text-secondary text-sm mb-4">
            Download all your data as a JSON file. You can store this in Google Drive or any cloud storage.
          </p>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-app-accent hover:bg-app-accent/90 text-app-bg-primary"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export Backup'}
          </Button>
        </div>

        <div className="border-t border-app-border pt-4">
          <h3 className="text-app-text-primary font-semibold mb-2">Restore Backup</h3>
          <p className="text-app-text-secondary text-sm mb-4">
            Import a previously exported backup file. This will replace all current data.
          </p>
          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isImporting}
              className="hidden"
            />
            <Button
              asChild
              disabled={isImporting}
              className="w-full bg-app-secondary-accent hover:bg-app-secondary-accent/90 text-app-bg-primary cursor-pointer"
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {isImporting ? 'Restoring...' : 'Restore Backup'}
              </span>
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
}
