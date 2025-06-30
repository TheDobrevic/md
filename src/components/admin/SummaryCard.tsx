// components/admin/SummaryCard.tsx
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Accent = "default" | "success" | "info" | "warning" | "destructive";

const ACCENT_STYLES: Record<Accent, { 
  badge: string; 
  label: string;
  gradient?: string;
}> = {
  default: { 
    badge: "bg-primary/10 text-primary border-primary/20", 
    label: "Genel",
    gradient: "from-primary/5 to-primary/10"
  },
  success: { 
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", 
    label: "Güncel",
    gradient: "from-emerald-500/5 to-emerald-500/10"
  },
  info: { 
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20", 
    label: "Bilgi",
    gradient: "from-sky-500/5 to-sky-500/10"
  },
  warning: { 
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", 
    label: "Uyarı",
    gradient: "from-amber-500/5 to-amber-500/10"
  },
  destructive: { 
    badge: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20", 
    label: "Kritik",
    gradient: "from-red-500/5 to-red-500/10"
  },
};

interface SummaryCardProps {
  title: string;
  value: string | number;
  accent?: Accent;
  icon?: LucideIcon;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  loading?: boolean;
}

export function SummaryCard({
  title,
  value,
  accent = "default",
  icon: Icon,
  subtitle,
  trend,
  loading = false,
}: SummaryCardProps) {
  const styles = ACCENT_STYLES[accent];

  if (loading) {
    return (
      <div className="rounded-xl bg-card border border-border shadow-sm p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="h-4 bg-muted rounded w-24"></div>
          {Icon && <div className="h-5 w-5 bg-muted rounded"></div>}
        </div>
        <div className="h-8 bg-muted rounded w-16 mb-3"></div>
        <div className="h-6 bg-muted rounded w-20"></div>
      </div>
    );
  }

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl bg-card border border-border shadow-sm p-6",
      "hover:shadow-md transition-all duration-200",
      styles.gradient && `bg-gradient-to-br ${styles.gradient}`
    )}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
        {Icon && (
          <div className={cn(
            "p-2 rounded-lg transition-colors",
            styles.badge.split(' ')[0] // Extract background color
          )}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <h2 className="text-3xl font-bold leading-none">
          {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
        </h2>
        {trend && (
          <span className={cn(
            "text-xs font-medium",
            trend === "up" ? "text-emerald-600" : 
            trend === "down" ? "text-red-600" : 
            "text-muted-foreground"
          )}>
            {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-muted-foreground mb-3">{subtitle}</p>
      )}

      <Badge 
        variant="outline" 
        className={cn("text-xs", styles.badge)}
      >
        {styles.label}
      </Badge>
    </div>
  );
}
