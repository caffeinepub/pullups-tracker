import { offlineDb } from './offlineDb';

export async function resetAllData(): Promise<void> {
  await offlineDb.clearAllData();
  window.location.reload();
}
