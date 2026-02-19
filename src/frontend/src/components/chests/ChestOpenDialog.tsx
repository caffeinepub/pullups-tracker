import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChestTier, CHEST_DEFINITIONS } from '../../lib/economy/chestsTypes';
import { openChest } from '../../lib/economy/chestOpenFlow';
import { usePullupStore } from '../../hooks/usePullupStore';
import { useSfx } from '../../hooks/useSfx';
import { triggerHaptic } from '../../lib/haptics';
import { toast } from 'sonner';
import { ASSETS } from '../../assets/generated';
import CardReveal from './CardReveal';
import { getModifiers } from '../../lib/economy/economyStore';
import { checkDailyBonus } from '../../lib/economy/modifiers';

interface ChestOpenDialogProps {
  tier: ChestTier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export default function ChestOpenDialog({ tier, open, onOpenChange, onComplete }: ChestOpenDialogProps) {
  const { refreshCoins } = usePullupStore();
  const { play } = useSfx();
  const [stage, setStage] = useState<'confirm' | 'opening' | 'revealing'>('confirm');
  const [cards, setCards] = useState<number[]>([]);
  const [bonusActive, setBonusActive] = useState(false);

  const handleConfirm = async () => {
    if (!tier) return;

    // Check for active bonuses
    const modifiers = await getModifiers();
    const hasBonus = modifiers.streakBonusEnabled || checkDailyBonus(modifiers);
    setBonusActive(hasBonus);

    setStage('opening');
    
    const sfxType = tier === 'common' ? 'chest-common-open' :
                    tier === 'rare' ? 'chest-rare-open' :
                    'chest-epic-open';
    play(sfxType);
    triggerHaptic('chest-open');

    // Opening animation duration
    setTimeout(async () => {
      const result = await openChest(tier);
      
      if (!result.success) {
        toast.error(result.error || 'Failed to open chest');
        onOpenChange(false);
        resetDialog();
        return;
      }

      setCards(result.cards || []);
      setStage('revealing');
      await refreshCoins();
    }, 2000);
  };

  const handleRevealComplete = (index: number, value: number) => {
    const isHighValue = value >= 100;
    play(isHighValue ? 'card-reveal-high' : 'card-reveal');
    if (isHighValue) {
      triggerHaptic('card-reveal-high');
    }

    if (index === cards.length - 1) {
      setTimeout(() => {
        onComplete();
        onOpenChange(false);
        resetDialog();
      }, 1000);
    }
  };

  const resetDialog = () => {
    setStage('confirm');
    setCards([]);
    setBonusActive(false);
  };

  if (!tier) return null;

  const definition = CHEST_DEFINITIONS[tier];
  const chestImage = tier === 'common' ? ASSETS.chestCommon :
                     tier === 'rare' ? ASSETS.chestRare :
                     ASSETS.chestEpic;

  return (
    <Dialog open={open} onOpenChange={(o) => {
      onOpenChange(o);
      if (!o) resetDialog();
    }}>
      <DialogContent className="glass-panel border-app-border max-w-2xl">
        {stage === 'confirm' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-app-text-primary text-2xl">
                Open {definition.name}?
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-8 flex flex-col items-center">
              <img 
                src={chestImage} 
                alt={definition.name}
                className="w-48 h-48 object-contain"
              />
              
              <div className="mt-6 text-center">
                <p className="text-app-text-secondary mb-2">Cost</p>
                <p className="text-app-accent text-3xl font-bold">{definition.cost} coins</p>
              </div>

              {bonusActive && (
                <div className="mt-4 px-4 py-2 bg-app-accent/20 border border-app-accent rounded-lg">
                  <p className="text-app-accent text-sm font-semibold">✨ Bonus Active</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-app-accent hover:bg-app-accent/90 text-app-bg-primary"
              >
                Open Chest
              </Button>
            </div>
          </>
        )}

        {stage === 'opening' && (
          <div className="py-16 flex flex-col items-center">
            <img 
              src={chestImage} 
              alt={definition.name}
              className={`w-64 h-64 object-contain chest-opening-animation chest-${tier}`}
            />
            <p className="text-app-text-primary text-xl font-semibold mt-8 animate-pulse">
              Opening...
            </p>
          </div>
        )}

        {stage === 'revealing' && (
          <div className="py-8">
            <DialogHeader>
              <DialogTitle className="text-app-text-primary text-2xl text-center mb-6">
                Your Cards
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {cards.map((value, index) => (
                <CardReveal
                  key={`card-${index}`}
                  value={value}
                  tier={tier}
                  delay={index * 300}
                  onRevealComplete={() => handleRevealComplete(index, value)}
                />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
