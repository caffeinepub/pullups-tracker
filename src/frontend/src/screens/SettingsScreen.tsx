import StickmanVolumeControl from '../components/StickmanVolumeControl';
import BackupRestorePanel from '../components/BackupRestorePanel';
import ResetDataDialog from '../components/ResetDataDialog';
import { usePullupStore } from '../hooks/usePullupStore';
import { Label } from '@/components/ui/label';
import WheelPicker from '../components/WheelPicker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
import { useState } from 'react';

export default function SettingsScreen() {
  const { settings, updateSettings } = usePullupStore();
  const [showGoalPicker, setShowGoalPicker] = useState(false);

  return (
    <div className="min-h-screen p-6 space-y-6">
      <h1 className="text-3xl font-bold text-app-text-primary">Settings</h1>

      <div className="glass-card border-app-border p-6 rounded-xl">
        <h2 className="text-app-text-primary font-semibold mb-4">Volume Control</h2>
        <StickmanVolumeControl />
      </div>

      <div className="glass-card border-app-border p-6 rounded-xl">
        <h2 className="text-app-text-primary font-semibold mb-4">Daily Goal</h2>
        <button
          onClick={() => setShowGoalPicker(true)}
          className="w-full glass-card border-app-border p-6 rounded-xl text-center hover:border-app-accent transition-colors"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-5 h-5 text-app-accent" />
            <span className="text-app-text-secondary text-sm">Target Pull-ups</span>
          </div>
          <div className="text-5xl font-bold text-app-accent">{settings.dailyGoal}</div>
        </button>

        <Dialog open={showGoalPicker} onOpenChange={setShowGoalPicker}>
          <DialogContent className="glass-panel border-app-border">
            <DialogHeader>
              <DialogTitle className="text-app-text-primary">Set Daily Goal</DialogTitle>
            </DialogHeader>
            <WheelPicker
              min={10}
              max={500}
              value={settings.dailyGoal}
              onChange={(val) => updateSettings({ dailyGoal: val })}
              step={5}
            />
            <Button
              onClick={() => setShowGoalPicker(false)}
              className="bg-app-accent hover:bg-app-accent/90 text-app-bg-primary"
            >
              Done
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card border-app-border p-6 rounded-xl">
        <h2 className="text-app-text-primary font-semibold mb-4">Backup & Restore</h2>
        <BackupRestorePanel />
      </div>

      <div className="glass-card border-app-border p-6 rounded-xl">
        <h2 className="text-app-text-primary font-semibold mb-4">Danger Zone</h2>
        <ResetDataDialog />
      </div>

      <footer className="text-center py-8 text-app-text-secondary text-sm">
        <p>© {new Date().getFullYear()} Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-app-accent hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
