import { useNavigate } from "react-router-dom";
import { Calendar, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Subscription } from "@/hooks/useSubscriptions";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

interface SubscriptionCardProps {
  subscription: Subscription;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const navigate = useNavigate();

  const statusColors = {
    "active": "text-success bg-success/10 border-success/30",
    "cancelled": "text-destructive bg-destructive/10 border-destructive/30",
    "trial": "text-warning bg-warning/10 border-warning/30",
    "paused": "text-muted bg-muted/10 border-muted/30"
  };

  const statusLabels = {
    "active": "Aktif",
    "cancelled": "Berhenti",
    "trial": "Uji Coba",
    "paused": "Dijeda"
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div 
      className="neumo-card neumo-card-hover p-6 cursor-pointer group"
      onClick={() => navigate(`/subscription/${subscription.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="neumo-card p-4 rounded-2xl bg-background-elevated">
          {subscription.logo_url ? (
            <img src={subscription.logo_url} alt={subscription.name} className="w-12 h-12 object-contain" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {subscription.name.charAt(0)}
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="neumo-card rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-foreground mb-1">
          {subscription.name}
        </h3>
        <p className="text-sm text-foreground-muted capitalize">
          {subscription.description || subscription.billing_cycle}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Badge variant="outline" className="border-primary/30 text-primary">
          {subscription.category}
        </Badge>
        <Badge 
          variant="outline" 
          className={statusColors[subscription.status as keyof typeof statusColors]}
        >
          {statusLabels[subscription.status as keyof typeof statusLabels]}
        </Badge>
      </div>

      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground-muted">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              {format(parseISO(subscription.next_billing_date), 'd MMM yyyy', { locale: id })}
            </span>
          </div>
          <span className="text-xl font-bold text-foreground">
            {formatCurrency(Number(subscription.price))}
          </span>
        </div>
      </div>
    </div>
  );
};
