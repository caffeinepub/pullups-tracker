// Core chest opening transaction logic
import { ChestTier, ChestOpenRecord, CardWalletItem, CHEST_DEFINITIONS } from './chestsTypes';
import { drawCards } from './drawCards';
import { deductCoins, addChestOpen, addCardsToWallet, getModifiers, saveModifiers } from './economyStore';
import { updateModifiersAfterOpen } from './modifiers';

export interface ChestOpenResult {
  success: boolean;
  cards?: number[];
  error?: string;
}

export async function openChest(tier: ChestTier): Promise<ChestOpenResult> {
  const definition = CHEST_DEFINITIONS[tier];
  
  // Check and deduct coins
  const deducted = await deductCoins(definition.cost);
  if (!deducted) {
    return { success: false, error: 'Insufficient coins' };
  }

  try {
    // Get modifiers and draw cards
    const modifiers = await getModifiers();
    const cards = drawCards(tier, modifiers);

    // Update modifiers
    const updatedModifiers = updateModifiersAfterOpen(modifiers);
    await saveModifiers(updatedModifiers);

    // Persist chest open record
    const record: ChestOpenRecord = {
      id: `chest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tier,
      cost: definition.cost,
      cards,
      timestamp: Date.now(),
    };
    await addChestOpen(record);

    // Add cards to wallet
    const walletItems: CardWalletItem[] = cards.map(value => ({
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      value,
      tier,
      timestamp: Date.now(),
    }));
    await addCardsToWallet(walletItems);

    return { success: true, cards };
  } catch (error) {
    // Refund coins on error
    const { addCoins } = await import('./economyStore');
    await addCoins(definition.cost);
    return { success: false, error: 'Failed to open chest' };
  }
}
