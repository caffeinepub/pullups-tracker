import { PullupSession, UserSettings } from './types';
import { Milestone } from './intelligence/milestones';
import { ChestOpenRecord, CardWalletItem } from './economy/chestsTypes';
import { ModifierState, getDefaultModifiers } from './economy/modifiers';

const DB_NAME = 'PullupsTrackerDB';
const DB_VERSION = 6; // Incremented for pstDate field
const SESSIONS_STORE = 'sessions';
const SETTINGS_STORE = 'settings';
const QUALITY_STORE = 'sessionQuality';
const MILESTONES_STORE = 'milestones';
const COINS_STORE = 'coins';
const CHEST_HISTORY_STORE = 'chestHistory';
const CARD_WALLET_STORE = 'cardWallet';
const CHEST_MODIFIERS_STORE = 'chestModifiers';

export interface SessionQualityRecord {
  sessionId: string;
  score: number;
  timestamp: number;
}

class OfflineDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion;

        if (!db.objectStoreNames.contains(SESSIONS_STORE)) {
          const sessionStore = db.createObjectStore(SESSIONS_STORE, { keyPath: 'id' });
          sessionStore.createIndex('timestamp', 'timestamp', { unique: false });
          sessionStore.createIndex('pstDate', 'pstDate', { unique: false });
        } else if (oldVersion < 6) {
          // Add pstDate index to existing sessions store
          const transaction = (event.target as IDBOpenDBRequest).transaction;
          const sessionStore = transaction?.objectStore(SESSIONS_STORE);
          if (sessionStore && !sessionStore.indexNames.contains('pstDate')) {
            sessionStore.createIndex('pstDate', 'pstDate', { unique: false });
          }
        }

        if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
          db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
        }

        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains(QUALITY_STORE)) {
            const qualityStore = db.createObjectStore(QUALITY_STORE, { keyPath: 'sessionId' });
            qualityStore.createIndex('timestamp', 'timestamp', { unique: false });
          }

          if (!db.objectStoreNames.contains(MILESTONES_STORE)) {
            const milestonesStore = db.createObjectStore(MILESTONES_STORE, { keyPath: 'id' });
            milestonesStore.createIndex('timestamp', 'timestamp', { unique: false });
          }
        }

        if (oldVersion < 4) {
          if (!db.objectStoreNames.contains(COINS_STORE)) {
            db.createObjectStore(COINS_STORE, { keyPath: 'key' });
          }

          if (!db.objectStoreNames.contains(CHEST_HISTORY_STORE)) {
            const chestHistoryStore = db.createObjectStore(CHEST_HISTORY_STORE, { keyPath: 'id' });
            chestHistoryStore.createIndex('timestamp', 'timestamp', { unique: false });
          }

          if (!db.objectStoreNames.contains(CARD_WALLET_STORE)) {
            const cardWalletStore = db.createObjectStore(CARD_WALLET_STORE, { keyPath: 'id' });
            cardWalletStore.createIndex('timestamp', 'timestamp', { unique: false });
          }

          if (!db.objectStoreNames.contains(CHEST_MODIFIERS_STORE)) {
            db.createObjectStore(CHEST_MODIFIERS_STORE, { keyPath: 'key' });
          }
        }

        // Remove achievements store if it exists (v5 migration)
        if (oldVersion < 5 && db.objectStoreNames.contains('achievements')) {
          db.deleteObjectStore('achievements');
        }
      };
    });
  }

  async addSession(session: PullupSession): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SESSIONS_STORE], 'readwrite');
      const store = transaction.objectStore(SESSIONS_STORE);
      const request = store.add(session);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllSessions(): Promise<PullupSession[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SESSIONS_STORE], 'readonly');
      const store = transaction.objectStore(SESSIONS_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getSessionsByPSTDate(pstDate: string): Promise<PullupSession[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SESSIONS_STORE], 'readonly');
      const store = transaction.objectStore(SESSIONS_STORE);
      const index = store.index('pstDate');
      const request = index.getAll(pstDate);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async addSessionQuality(quality: SessionQualityRecord): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([QUALITY_STORE], 'readwrite');
      const store = transaction.objectStore(QUALITY_STORE);
      const request = store.put(quality);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllQualityRecords(): Promise<SessionQualityRecord[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([QUALITY_STORE], 'readonly');
      const store = transaction.objectStore(QUALITY_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async addMilestone(milestone: Milestone): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([MILESTONES_STORE], 'readwrite');
      const store = transaction.objectStore(MILESTONES_STORE);
      const request = store.put(milestone);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllMilestones(): Promise<Milestone[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([MILESTONES_STORE], 'readonly');
      const store = transaction.objectStore(MILESTONES_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getCoins(): Promise<number> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([COINS_STORE], 'readonly');
      const store = transaction.objectStore(COINS_STORE);
      const request = store.get('balance');

      request.onsuccess = () => resolve(request.result?.value || 0);
      request.onerror = () => reject(request.error);
    });
  }

  async setCoins(amount: number): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([COINS_STORE], 'readwrite');
      const store = transaction.objectStore(COINS_STORE);
      const request = store.put({ key: 'balance', value: amount });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async addChestOpen(record: ChestOpenRecord): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHEST_HISTORY_STORE], 'readwrite');
      const store = transaction.objectStore(CHEST_HISTORY_STORE);
      const request = store.add(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllChestOpens(): Promise<ChestOpenRecord[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHEST_HISTORY_STORE], 'readonly');
      const store = transaction.objectStore(CHEST_HISTORY_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async addCardToWallet(card: CardWalletItem): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CARD_WALLET_STORE], 'readwrite');
      const store = transaction.objectStore(CARD_WALLET_STORE);
      const request = store.add(card);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllCards(): Promise<CardWalletItem[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CARD_WALLET_STORE], 'readonly');
      const store = transaction.objectStore(CARD_WALLET_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getModifiers(): Promise<ModifierState> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHEST_MODIFIERS_STORE], 'readonly');
      const store = transaction.objectStore(CHEST_MODIFIERS_STORE);
      const request = store.get('modifiers');

      request.onsuccess = () => resolve(request.result?.value || getDefaultModifiers());
      request.onerror = () => reject(request.error);
    });
  }

  async setModifiers(modifiers: ModifierState): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHEST_MODIFIERS_STORE], 'readwrite');
      const store = transaction.objectStore(CHEST_MODIFIERS_STORE);
      const request = store.put({ key: 'modifiers', value: modifiers });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSettings(): Promise<UserSettings> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SETTINGS_STORE], 'readonly');
      const store = transaction.objectStore(SETTINGS_STORE);
      const request = store.get('userSettings');

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : { dailyGoal: 100, volume: 0.5 });
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SETTINGS_STORE], 'readwrite');
      const store = transaction.objectStore(SETTINGS_STORE);
      const request = store.put({ key: 'userSettings', value: settings });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async exportData(): Promise<string> {
    if (!this.db) await this.init();
    
    const sessions = await this.getAllSessions();
    const qualityRecords = await this.getAllQualityRecords();
    const milestones = await this.getAllMilestones();
    const settings = await this.getSettings();
    const coins = await this.getCoins();
    const chestHistory = await this.getAllChestOpens();
    const cardWallet = await this.getAllCards();
    const modifiers = await this.getModifiers();

    const exportObj = {
      version: DB_VERSION,
      exportDate: new Date().toISOString(),
      sessions,
      qualityRecords,
      milestones,
      settings,
      coins,
      chestHistory,
      cardWallet,
      modifiers,
    };

    return JSON.stringify(exportObj, null, 2);
  }

  async importData(jsonString: string): Promise<void> {
    if (!this.db) await this.init();

    const data = JSON.parse(jsonString);

    // Clear existing data
    await this.clearAllData();

    // Import sessions
    if (data.sessions && Array.isArray(data.sessions)) {
      for (const session of data.sessions) {
        await this.addSession(session);
      }
    }

    // Import quality records
    if (data.qualityRecords && Array.isArray(data.qualityRecords)) {
      for (const record of data.qualityRecords) {
        await this.addSessionQuality(record);
      }
    }

    // Import milestones
    if (data.milestones && Array.isArray(data.milestones)) {
      for (const milestone of data.milestones) {
        await this.addMilestone(milestone);
      }
    }

    // Import settings
    if (data.settings) {
      await this.saveSettings(data.settings);
    }

    // Import coins
    if (typeof data.coins === 'number') {
      await this.setCoins(data.coins);
    }

    // Import chest history
    if (data.chestHistory && Array.isArray(data.chestHistory)) {
      for (const record of data.chestHistory) {
        await this.addChestOpen(record);
      }
    }

    // Import card wallet
    if (data.cardWallet && Array.isArray(data.cardWallet)) {
      for (const card of data.cardWallet) {
        await this.addCardToWallet(card);
      }
    }

    // Import modifiers
    if (data.modifiers) {
      await this.setModifiers(data.modifiers);
    }
  }

  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [
          SESSIONS_STORE,
          QUALITY_STORE,
          MILESTONES_STORE,
          SETTINGS_STORE,
          COINS_STORE,
          CHEST_HISTORY_STORE,
          CARD_WALLET_STORE,
          CHEST_MODIFIERS_STORE,
        ],
        'readwrite'
      );

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);

      transaction.objectStore(SESSIONS_STORE).clear();
      transaction.objectStore(QUALITY_STORE).clear();
      transaction.objectStore(MILESTONES_STORE).clear();
      transaction.objectStore(SETTINGS_STORE).clear();
      transaction.objectStore(COINS_STORE).clear();
      transaction.objectStore(CHEST_HISTORY_STORE).clear();
      transaction.objectStore(CARD_WALLET_STORE).clear();
      transaction.objectStore(CHEST_MODIFIERS_STORE).clear();
    });
  }
}

export const offlineDb = new OfflineDB();
