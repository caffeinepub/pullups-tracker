import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Plus, History, BarChart3, Settings } from 'lucide-react';
import { useSfx } from '../hooks/useSfx';
import { useFocusMode } from '../hooks/useFocusMode';
import { triggerHaptic } from '../lib/haptics';

export default function BottomNav() {
  const navigate = useNavigate();
  const { play } = useSfx();
  const { isFocusMode } = useFocusMode();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/log', icon: Plus, label: 'Log' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleNav = (path: string) => {
    if (isFocusMode) return;
    play('button-click');
    triggerHaptic('light');
    navigate({ to: path });
  };

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-app-border transition-all duration-500 ${
        isFocusMode ? 'opacity-20 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex items-center justify-around h-20 px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = currentPath === path;
          return (
            <button
              key={path}
              onClick={() => handleNav(path)}
              disabled={isFocusMode}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-app-accent scale-110'
                  : 'text-app-text-secondary hover:text-app-text-primary'
              }`}
              style={{
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
