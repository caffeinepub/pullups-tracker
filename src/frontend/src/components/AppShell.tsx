import { Outlet } from '@tanstack/react-router';
import BottomNav from './BottomNav';
import FrostedBackground from './FrostedBackground';
import { useFocusMode } from '../hooks/useFocusMode';

export default function AppShell() {
  const { isFocusMode } = useFocusMode();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FrostedBackground />
      <div 
        className={`relative z-10 flex flex-col min-h-screen pb-20 transition-all duration-500 ${
          isFocusMode ? 'brightness-50' : ''
        }`}
      >
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
