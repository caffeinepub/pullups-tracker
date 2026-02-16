import { Outlet } from '@tanstack/react-router';
import BottomNav from './BottomNav';
import FrostedBackground from './FrostedBackground';

export default function AppShell() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <FrostedBackground />
      <div className="relative z-10 flex flex-col min-h-screen pb-20">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
