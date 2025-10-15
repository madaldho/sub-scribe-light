import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down";
}

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  subtitle, 
  icon: Icon,
  trend 
}: StatsCardProps) => {
  return (
    <div className="neumo-card neumo-card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="neumo-card p-3 rounded-xl bg-background-elevated">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        {change && (
          <span className={`text-sm font-medium px-3 py-1 rounded-lg ${
            trend === "up" 
              ? "text-success bg-success/10" 
              : "text-destructive bg-destructive/10"
          }`}>
            {change}
          </span>
        )}
      </div>
      
      <h3 className="text-foreground-muted text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      {subtitle && (
        <p className="text-sm text-foreground-muted">{subtitle}</p>
      )}
    </div>
  );
};
