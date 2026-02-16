import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
}

export default function MetricCard({ title, value, icon, subtitle }: MetricCardProps) {
  return (
    <Card className="glass-card border-app-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-app-text-secondary flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-app-text-primary">{value}</div>
        {subtitle && (
          <p className="text-xs text-app-text-secondary mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
