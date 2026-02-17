import { Award, Flame, Zap, Target, Heart, Eye, Mountain, Flag, ArrowUp, ArrowUpCircle, Crown, Calendar, Shield, Sun, AlertTriangle, TrendingUp, Medal, Gauge, Star, Sparkles, Circle } from 'lucide-react';

interface TrophyIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export default function TrophyIcon({ icon, size = 24, className = '' }: TrophyIconProps) {
  const iconMap: Record<string, any> = {
    'bar-single': () => <div className={`w-${size} h-${size} flex items-end justify-center`}><div className="w-1 h-3 bg-current" /></div>,
    'bars-five': () => <div className={`w-${size} h-${size} flex items-end justify-center gap-0.5`}>{[...Array(5)].map((_, i) => <div key={i} className="w-0.5 h-2 bg-current" />)}</div>,
    'bars-ten': () => <div className={`w-${size} h-${size} flex items-end justify-center gap-0.5`}>{[...Array(5)].map((_, i) => <div key={i} className="w-0.5 h-3 bg-current" />)}</div>,
    'bars-twenty': () => <div className={`w-${size} h-${size} flex items-end justify-center gap-0.5 flex-wrap`}>{[...Array(8)].map((_, i) => <div key={i} className="w-0.5 h-2 bg-current" />)}</div>,
    'bars-stacked': () => <div className={`w-${size} h-${size} flex flex-col items-center justify-center gap-0.5`}>{[...Array(3)].map((_, i) => <div key={i} className="w-4 h-1 bg-current" />)}</div>,
    'trophy-silver': Award,
    'clipboard': () => <div className={`w-${size} h-${size} border-2 border-current rounded flex items-center justify-center`}><div className="w-2 h-2 border-t-2 border-current" /></div>,
    'stopwatch': () => <Circle size={size} className={className} />,
    'flame': Flame,
    'flame-large': () => <Flame size={size * 1.2} className={className} />,
    'flame-triple': () => <div className="flex gap-0.5"><Flame size={size * 0.7} /><Flame size={size * 0.7} /><Flame size={size * 0.7} /></div>,
    'flame-wreath': () => <div className="relative"><Flame size={size} className={className} /><div className="absolute inset-0 rounded-full border-2 border-current" /></div>,
    'flame-rotating': () => <Flame size={size} className={`${className} animate-spin`} />,
    'flame-gold': () => <Flame size={size} className={`${className} text-yellow-500`} />,
    'flame-elite': () => <Flame size={size} className={`${className} text-purple-500`} />,
    'fist-small': () => <div className={`w-${size} h-${size} rounded-sm bg-current`} />,
    'fist-clenched': () => <div className={`w-${size} h-${size} rounded bg-current`} />,
    'fist-glowing': () => <div className={`w-${size} h-${size} rounded bg-current shadow-lg shadow-current`} />,
    'fist-radiant': () => <div className={`w-${size} h-${size} rounded-full bg-current shadow-xl shadow-current animate-pulse`} />,
    'fist-pedestal': () => <div className="flex flex-col items-center"><div className={`w-${size * 0.7} h-${size * 0.7} rounded bg-current`} /><div className="w-6 h-2 bg-current mt-1" /></div>,
    'starburst': Star,
    'speedometer': Gauge,
    'speedometer-glow': () => <Gauge size={size} className={`${className} text-yellow-400`} />,
    'medal': Medal,
    'medal-triple': () => <div className="flex gap-0.5"><Medal size={size * 0.7} /><Medal size={size * 0.7} /><Medal size={size * 0.7} /></div>,
    'heart': Heart,
    'heart-glow': () => <Heart size={size} className={`${className} fill-current`} />,
    'orb': () => <Circle size={size} className={`${className} fill-current`} />,
    'orb-double': () => <div className="flex gap-1"><Circle size={size * 0.7} className="fill-current" /><Circle size={size * 0.7} className="fill-current" /></div>,
    'orb-radiant': () => <Circle size={size} className={`${className} fill-current animate-pulse shadow-lg shadow-current`} />,
    'shield-check': Shield,
    'shield-wreath': () => <Shield size={size} className={`${className} fill-current`} />,
    'shield-gold': () => <Shield size={size} className={`${className} text-yellow-500 fill-current`} />,
    'target': Target,
    'target-glow': () => <Target size={size} className={`${className} text-red-500`} />,
    'sun': Sun,
    'warning': AlertTriangle,
    'eye': Eye,
    'mountain': Mountain,
    'flag-peak': Flag,
    'arrow-up': ArrowUp,
    'arrow-double': ArrowUpCircle,
    'diamond': () => <div className={`w-${size} h-${size} rotate-45 bg-current`} />,
    'crown': Crown,
    'diamond-triple': () => <div className="flex gap-0.5">{[...Array(3)].map((_, i) => <div key={i} className={`w-${size * 0.6} h-${size * 0.6} rotate-45 bg-current`} />)}</div>,
    'crown-triple': () => <div className="flex gap-0.5"><Crown size={size * 0.7} /><Crown size={size * 0.7} /><Crown size={size * 0.7} /></div>,
    'spark': Zap,
    'spark-cluster': Sparkles,
    'spark-glow': () => <Sparkles size={size} className={`${className} text-yellow-400 animate-pulse`} />,
    'calendar': Calendar,
  };

  const IconComponent = iconMap[icon];

  if (!IconComponent) {
    return <Award size={size} className={className} />;
  }

  if (typeof IconComponent === 'function' && IconComponent.prototype === undefined) {
    return <div className={className}>{IconComponent()}</div>;
  }

  return <IconComponent size={size} className={className} />;
}
