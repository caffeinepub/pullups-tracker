import { useState, useEffect } from 'react';
import WheelPicker from './WheelPicker';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFocusMode } from '../hooks/useFocusMode';
import { useSfx } from '../hooks/useSfx';
import { triggerHaptic } from '../lib/haptics';

interface SessionBuilderProps {
  onComplete: (sets: Array<{ reps: number; weight?: number }>, duration?: number) => void;
}

export default function SessionBuilder({ onComplete }: SessionBuilderProps) {
  const [numSets, setNumSets] = useState(3);
  const [repsPerSet, setRepsPerSet] = useState(10);
  const [weight, setWeight] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSetsPicker, setShowSetsPicker] = useState(false);
  const [showRepsPicker, setShowRepsPicker] = useState(false);
  const [showWeightPicker, setShowWeightPicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  
  const { enterFocusMode, exitFocusMode } = useFocusMode();
  const { play, stop } = useSfx();

  const isAnyPickerOpen = showSetsPicker || showRepsPicker || showWeightPicker || showDurationPicker;

  useEffect(() => {
    if (isAnyPickerOpen) {
      enterFocusMode();
      play('focus-ambient-pulse');
    } else {
      exitFocusMode();
      stop('focus-ambient-pulse');
    }
  }, [isAnyPickerOpen, enterFocusMode, exitFocusMode, play, stop]);

  const handleComplete = () => {
    const sets = Array(numSets).fill(null).map(() => ({
      reps: repsPerSet,
      weight: weight > 0 ? weight : undefined,
    }));

    play('button-click');
    triggerHaptic('medium');
    onComplete(sets, duration > 0 ? duration : undefined);
  };

  const handlePickerOpen = () => {
    play('button-click');
    triggerHaptic('light');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => {
            handlePickerOpen();
            setShowSetsPicker(true);
          }}
          className="glass-card border-app-border p-6 rounded-xl text-center hover:border-app-accent transition-colors"
        >
          <div className="text-app-text-secondary text-sm mb-2">Sets</div>
          <div className="text-4xl font-bold text-app-accent">{numSets}</div>
        </button>

        <button
          onClick={() => {
            handlePickerOpen();
            setShowRepsPicker(true);
          }}
          className="glass-card border-app-border p-6 rounded-xl text-center hover:border-app-accent transition-colors"
        >
          <div className="text-app-text-secondary text-sm mb-2">Reps</div>
          <div className="text-4xl font-bold text-app-accent">{repsPerSet}</div>
        </button>

        <button
          onClick={() => {
            handlePickerOpen();
            setShowWeightPicker(true);
          }}
          className="glass-card border-app-border p-6 rounded-xl text-center hover:border-app-accent transition-colors"
        >
          <div className="text-app-text-secondary text-sm mb-2">Weight (kg)</div>
          <div className="text-4xl font-bold text-app-accent">{weight || '-'}</div>
        </button>

        <button
          onClick={() => {
            handlePickerOpen();
            setShowDurationPicker(true);
          }}
          className="glass-card border-app-border p-6 rounded-xl text-center hover:border-app-accent transition-colors"
        >
          <div className="text-app-text-secondary text-sm mb-2">Duration (min)</div>
          <div className="text-4xl font-bold text-app-accent">{duration || '-'}</div>
        </button>
      </div>

      <Button
        onClick={handleComplete}
        className="w-full h-14 text-lg font-bold bg-app-accent hover:bg-app-accent/90 text-app-bg-primary"
      >
        Continue
      </Button>

      <Dialog open={showSetsPicker} onOpenChange={setShowSetsPicker}>
        <DialogContent className="glass-panel border-app-border">
          <DialogHeader>
            <DialogTitle className="text-app-text-primary">Select Sets</DialogTitle>
          </DialogHeader>
          <WheelPicker min={1} max={20} value={numSets} onChange={setNumSets} />
          <Button onClick={() => setShowSetsPicker(false)} className="bg-app-accent hover:bg-app-accent/90 text-app-bg-primary">
            Done
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showRepsPicker} onOpenChange={setShowRepsPicker}>
        <DialogContent className="glass-panel border-app-border">
          <DialogHeader>
            <DialogTitle className="text-app-text-primary">Select Reps</DialogTitle>
          </DialogHeader>
          <WheelPicker min={1} max={50} value={repsPerSet} onChange={setRepsPerSet} />
          <Button onClick={() => setShowRepsPicker(false)} className="bg-app-accent hover:bg-app-accent/90 text-app-bg-primary">
            Done
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showWeightPicker} onOpenChange={setShowWeightPicker}>
        <DialogContent className="glass-panel border-app-border">
          <DialogHeader>
            <DialogTitle className="text-app-text-primary">Select Weight (kg)</DialogTitle>
          </DialogHeader>
          <WheelPicker min={0} max={100} value={weight} onChange={setWeight} step={5} />
          <Button onClick={() => setShowWeightPicker(false)} className="bg-app-accent hover:bg-app-accent/90 text-app-bg-primary">
            Done
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showDurationPicker} onOpenChange={setShowDurationPicker}>
        <DialogContent className="glass-panel border-app-border">
          <DialogHeader>
            <DialogTitle className="text-app-text-primary">Select Duration (min)</DialogTitle>
          </DialogHeader>
          <WheelPicker min={0} max={120} value={duration} onChange={setDuration} step={5} />
          <Button onClick={() => setShowDurationPicker(false)} className="bg-app-accent hover:bg-app-accent/90 text-app-bg-primary">
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
