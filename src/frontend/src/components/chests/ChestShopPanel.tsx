import { useState, useEffect } from 'react';
import { usePullupStore } from '../../hooks/usePullupStore';
import { ChestTier } from '../../lib/economy/chestsTypes';
import { getChestHistory, getModifiers, saveModifiers } from '../../lib/economy/economyStore';
import { ChestOpenRecord } from '../../lib/economy/chestsTypes';
import ChestTile from './ChestTile';
import ChestOpenDialog from './ChestOpenDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Coins } from 'lucide-react';

export default function ChestShopPanel() {
  const { coins, refreshCoins } = usePullupStore();
  const [selectedTier, setSelectedTier] = useState<ChestTier | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [history, setHistory] = useState<ChestOpenRecord[]>([]);
  const [streakBonus, setStreakBonus] = useState(false);
  const [dailyBonus, setDailyBonus] = useState(false);

  useEffect(() => {
    loadHistory();
    loadModifiers();
  }, []);

  const loadHistory = async () => {
    const records = await getChestHistory();
    setHistory(records.slice(0, 10));
  };

  const loadModifiers = async () => {
    const modifiers = await getModifiers();
    setStreakBonus(modifiers.streakBonusEnabled);
    setDailyBonus(modifiers.dailyBonusEnabled);
  };

  const handleChestClick = (tier: ChestTier) => {
    setSelectedTier(tier);
    setDialogOpen(true);
  };

  const handleOpenComplete = async () => {
    await refreshCoins();
    await loadHistory();
  };

  const handleStreakToggle = async (enabled: boolean) => {
    setStreakBonus(enabled);
    const modifiers = await getModifiers();
    await saveModifiers({ ...modifiers, streakBonusEnabled: enabled });
  };

  const handleDailyToggle = async (enabled: boolean) => {
    setDailyBonus(enabled);
    const modifiers = await getModifiers();
    await saveModifiers({ ...modifiers, dailyBonusEnabled: enabled });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-app-text-primary font-semibold text-lg">Your Balance</h3>
        <div className="flex items-center gap-2 px-4 py-2 glass-card border-app-border rounded-full">
          <Coins className="w-5 h-5 text-app-accent" />
          <span className="text-app-accent font-bold text-xl">{coins}</span>
        </div>
      </div>

      <Separator className="bg-app-border" />

      <div>
        <h3 className="text-app-text-primary font-semibold text-lg mb-4">Chest Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ChestTile tier="common" coins={coins} onClick={() => handleChestClick('common')} />
          <ChestTile tier="rare" coins={coins} onClick={() => handleChestClick('rare')} />
          <ChestTile tier="epic" coins={coins} onClick={() => handleChestClick('epic')} />
        </div>
      </div>

      <Separator className="bg-app-border" />

      <div>
        <h3 className="text-app-text-primary font-semibold text-lg mb-4">Bonus Modifiers</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between glass-card border-app-border p-4 rounded-lg">
            <div>
              <Label htmlFor="streak-bonus" className="text-app-text-primary font-medium">
                Streak Bonus
              </Label>
              <p className="text-app-text-secondary text-sm mt-1">
                Higher value cards when opening multiple chests in a row
              </p>
            </div>
            <Switch
              id="streak-bonus"
              checked={streakBonus}
              onCheckedChange={handleStreakToggle}
            />
          </div>

          <div className="flex items-center justify-between glass-card border-app-border p-4 rounded-lg">
            <div>
              <Label htmlFor="daily-bonus" className="text-app-text-primary font-medium">
                Daily First Chest Bonus
              </Label>
              <p className="text-app-text-secondary text-sm mt-1">
                Slightly higher chances for your first chest each day
              </p>
            </div>
            <Switch
              id="daily-bonus"
              checked={dailyBonus}
              onCheckedChange={handleDailyToggle}
            />
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <>
          <Separator className="bg-app-border" />
          
          <div>
            <h3 className="text-app-text-primary font-semibold text-lg mb-4">Recent Openings</h3>
            <ScrollArea className="h-64 glass-card border-app-border rounded-lg p-4">
              <div className="space-y-3">
                {history.map((record) => (
                  <div key={record.id} className="glass-card border-app-border p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-app-text-primary font-medium capitalize">
                        {record.tier} Chest
                      </span>
                      <span className="text-app-text-secondary text-sm">
                        {new Date(record.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {record.cards.map((value, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-app-accent/20 text-app-accent text-xs font-semibold rounded"
                        >
                          {value}rs
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </>
      )}

      <ChestOpenDialog
        tier={selectedTier}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onComplete={handleOpenComplete}
      />
    </div>
  );
}
