// Centralized offline economy operations
import { offlineDb } from '../offlineDb';
import { ChestOpenRecord, CardWalletItem } from './chestsTypes';
import { ModifierState } from './modifiers';

export async function getCoins(): Promise<number> {
  return await offlineDb.getCoins();
}

export async function setCoins(amount: number): Promise<void> {
  await offlineDb.setCoins(amount);
}

export async function addCoins(amount: number): Promise<number> {
  const current = await getCoins();
  const newAmount = current + amount;
  await setCoins(newAmount);
  return newAmount;
}

export async function deductCoins(amount: number): Promise<boolean> {
  const current = await getCoins();
  if (current < amount) return false;
  
  await setCoins(current - amount);
  return true;
}

export async function getChestHistory(): Promise<ChestOpenRecord[]> {
  return await offlineDb.getAllChestOpens();
}

export async function addChestOpen(record: ChestOpenRecord): Promise<void> {
  await offlineDb.addChestOpen(record);
}

export async function getCardWallet(): Promise<CardWalletItem[]> {
  return await offlineDb.getAllCards();
}

export async function addCardsToWallet(items: CardWalletItem[]): Promise<void> {
  for (const item of items) {
    await offlineDb.addCardToWallet(item);
  }
}

export async function getModifiers(): Promise<ModifierState> {
  return await offlineDb.getModifiers();
}

export async function saveModifiers(modifiers: ModifierState): Promise<void> {
  await offlineDb.setModifiers(modifiers);
}
