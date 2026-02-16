import { offlineDb } from './offlineDb';

export async function exportBackup(): Promise<void> {
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
  } catch (error) {
    throw new Error('Failed to export backup: ' + (error as Error).message);
  }
}

export async function importBackup(file: File): Promise<void> {
  try {
    const text = await file.text();
    await offlineDb.importData(text);
  } catch (error) {
    throw new Error('Failed to import backup: ' + (error as Error).message);
  }
}
