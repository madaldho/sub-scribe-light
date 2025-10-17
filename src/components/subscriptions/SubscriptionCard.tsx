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
      className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:border-primary/30 transition-all duration-200 group"
      onClick={() => navigate(`/subscription/${subscription.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        {subscription.logo_url ? (
          <img src={subscription.logo_url} alt={subscription.name} className="w-10 h-10 rounded-lg object-contain" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {subscription.name.charAt(0)}
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-3">
        <h3 className="text-lg font-bold text-foreground mb-0.5">
          {subscription.name}
        </h3>
        <p className="text-xs text-muted-foreground capitalize">
          {subscription.description || subscription.billing_cycle}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Badge variant="outline" className="border-primary/30 text-primary text-xs">
          {subscription.category}
        </Badge>
        <Badge 
          variant="outline" 
          className={`${statusColors[subscription.status as keyof typeof statusColors]} text-xs`}
        >
          {statusLabels[subscription.status as keyof typeof statusLabels]}
        </Badge>
      </div>

      <div className="pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs">
              {format(parseISO(subscription.next_billing_date), 'd MMM yyyy', { locale: id })}
            </span>
          </div>
          <span className="text-lg font-bold text-foreground">
            {formatCurrency(Number(subscription.price))}
          </span>
        </div>
      </div>
    </div>
  );
};
