import { PullupSession, UserSettings } from './types';
import { Milestone } from './intelligence/milestones';
import { AchievementUnlock } from './achievements/types';
import { ChestOpenRecord, CardWalletItem } from './economy/chestsTypes';
import { ModifierState, getDefaultModifiers } from './economy/modifiers';

const DB_NAME = 'PullupsTrackerDB';
const DB_VERSION = 4;
const SESSIONS_STORE = 'sessions';
const SETTINGS_STORE = 'settings';
const QUALITY_STORE = 'sessionQuality';
const MILESTONES_STORE = 'milestones';
const ACHIEVEMENTS_STORE = 'achievements';
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

        if (oldVersion < 3) {
          if (!db.objectStoreNames.contains(ACHIEVEMENTS_STORE)) {
            const achievementsStore = db.createObjectStore(ACHIEVEMENTS_STORE, { keyPath: 'achievementId' });
            achievementsStore.createIndex('timestamp', 'timestamp', { unique: false });
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

  async addAchievementUnlock(unlock: AchievementUnlock): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([ACHIEVEMENTS_STORE], 'readwrite');
      const store = transaction.objectStore(ACHIEVEMENTS_STORE);
      const request = store.put(unlock);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllAchievementUnlocks(): Promise<AchievementUnlock[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([ACHIEVEMENTS_STORE], 'readonly');
      const store = transaction.objectStore(ACHIEVEMENTS_STORE);
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

  async getChestHistory(): Promise<ChestOpenRecord[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHEST_HISTORY_STORE], 'readonly');
      const store = transaction.objectStore(CHEST_HISTORY_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result || [];
        resolve(results.sort((a, b) => b.timestamp - a.timestamp));
      };
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

  async getCardWallet(): Promise<CardWalletItem[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CARD_WALLET_STORE], 'readonly');
      const store = transaction.objectStore(CARD_WALLET_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result || [];
        resolve(results.sort((a, b) => b.timestamp - a.timestamp));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async addCardToWallet(item: CardWalletItem): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CARD_WALLET_STORE], 'readwrite');
      const store = transaction.objectStore(CARD_WALLET_STORE);
      const request = store.add(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getChestModifiers(): Promise<ModifierState> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHEST_MODIFIERS_STORE], 'readonly');
      const store = transaction.objectStore(CHEST_MODIFIERS_STORE);
      const request = store.get('modifiers');

      request.onsuccess = () => resolve(request.result?.value || getDefaultModifiers());
      request.onerror = () => reject(request.error);
    });
  }

  async saveChestModifiers(modifiers: ModifierState): Promise<void> {
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
      const request = store.get('settings');

      request.onsuccess = () => {
        resolve(request.result?.value || { volume: 0.7, dailyGoal: 50 });
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SETTINGS_STORE], 'readwrite');
      const store = transaction.objectStore(SETTINGS_STORE);
      const request = store.put({ key: 'settings', value: settings });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [SESSIONS_STORE, SETTINGS_STORE, QUALITY_STORE, MILESTONES_STORE, ACHIEVEMENTS_STORE, COINS_STORE, CHEST_HISTORY_STORE, CARD_WALLET_STORE, CHEST_MODIFIERS_STORE],
        'readwrite'
      );
      
      transaction.objectStore(SESSIONS_STORE).clear();
      transaction.objectStore(SETTINGS_STORE).clear();
      transaction.objectStore(QUALITY_STORE).clear();
      transaction.objectStore(MILESTONES_STORE).clear();
      transaction.objectStore(ACHIEVEMENTS_STORE).clear();
      transaction.objectStore(COINS_STORE).clear();
      transaction.objectStore(CHEST_HISTORY_STORE).clear();
      transaction.objectStore(CARD_WALLET_STORE).clear();
      transaction.objectStore(CHEST_MODIFIERS_STORE).clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async exportData(): Promise<string> {
    const sessions = await this.getAllSessions();
    const settings = await this.getSettings();
    const qualityRecords = await this.getAllQualityRecords();
    const milestones = await this.getAllMilestones();
    const achievements = await this.getAllAchievementUnlocks();
    const coins = await this.getCoins();
    const chestHistory = await this.getChestHistory();
    const cardWallet = await this.getCardWallet();
    const chestModifiers = await this.getChestModifiers();
    
    return JSON.stringify({
      version: 4,
      exportDate: new Date().toISOString(),
      sessions,
      settings,
      qualityRecords,
      milestones,
      achievements,
      coins,
      chestHistory,
      cardWallet,
      chestModifiers,
    }, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.version || !data.sessions || !data.settings) {
        throw new Error('Invalid backup file format');
      }

      await this.clearAllData();

      for (const session of data.sessions) {
        await this.addSession(session);
      }

      await this.saveSettings(data.settings);

      if (data.qualityRecords) {
        for (const quality of data.qualityRecords) {
          await this.addSessionQuality(quality);
        }
      }

      if (data.milestones) {
        for (const milestone of data.milestones) {
          await this.addMilestone(milestone);
        }
      }

      if (data.achievements) {
        for (const achievement of data.achievements) {
          await this.addAchievementUnlock(achievement);
        }
      }

      if (data.coins !== undefined) {
        await this.setCoins(data.coins);
      }

      if (data.chestHistory) {
        for (const record of data.chestHistory) {
          await this.addChestOpen(record);
        }
      }

      if (data.cardWallet) {
        for (const card of data.cardWallet) {
          await this.addCardToWallet(card);
        }
      }

      if (data.chestModifiers) {
        await this.saveChestModifiers(data.chestModifiers);
      }
    } catch (error) {
      throw new Error('Failed to import backup: ' + (error as Error).message);
    }
  }
}

export const offlineDb = new OfflineDB();
