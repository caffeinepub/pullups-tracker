// Card drawing logic with modifier support
import { ChestTier, CHEST_DEFINITIONS } from './chestsTypes';
import { DRAW_TABLES, weightedDraw } from './drawTables';
import { ModifierState, applyModifiers } from './modifiers';

export function drawCards(tier: ChestTier, modifiers: ModifierState): number[] {
  const definition = CHEST_DEFINITIONS[tier];
  const baseTable = DRAW_TABLES[tier];
  const modifiedTable = applyModifiers(baseTable, tier, modifiers);
  
  const cards: number[] = [];
  for (let i = 0; i < definition.cardCount; i++) {
    cards.push(weightedDraw(modifiedTable));
  }
  
  return cards;
}
