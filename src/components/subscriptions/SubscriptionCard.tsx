import { useNavigate } from "react-router-dom";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Subscription, useDeleteSubscription, useUpdateSubscriptionStatus } from "@/hooks/useSubscriptions";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { useState, useEffect } from "react";
import { TrialBadge } from "./TrialBadge";
import { getDaysRemaining } from "@/lib/dateUtils";

interface SubscriptionCardProps {
  subscription: Subscription;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const navigate = useNavigate();
  const deleteSubscription = useDeleteSubscription();
  const updateStatus = useUpdateSubscriptionStatus();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Auto-cancel expired subscriptions
  useEffect(() => {
    if (subscription.status === 'active' || subscription.status === 'trial') {
      const daysRemaining = getDaysRemaining(subscription.next_billing_date);
      if (daysRemaining < 0) {
        updateStatus.mutate({ id: subscription.id, status: 'cancelled' });
      }
    }
  }, [subscription.id, subscription.status, subscription.next_billing_date]);

  const statusColors = {
    "active": "text-success bg-success/10 border-success/30",
    "cancelled": "text-destructive bg-destructive/10 border-destructive/30",
    "inactive": "text-destructive bg-destructive/10 border-destructive/30",
    "trial": "text-warning bg-warning/10 border-warning/30",
    "paused": "text-muted bg-muted/10 border-muted/30"
  };

  const statusLabels: Record<string, string> = {
    "active": "Aktif",
    "cancelled": "Dibatalkan",
    "inactive": "Berhenti",
    "trial": "Uji Coba",
    "paused": "Dijeda"
  };

  const formatCurrency = (amount: number, currency: string = "IDR") => {
    const currencySymbols: Record<string, string> = {
      IDR: "Rp",
      USD: "$",
      EUR: "€",
      GBP: "£",
      SGD: "S$",
      MYR: "RM",
      JPY: "¥",
      CNY: "¥",
      AUD: "A$",
      CAD: "C$",
    };

    const symbol = currencySymbols[currency] || currency;
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

    return `${symbol} ${formatted}`;
  };

  const daysRemaining = getDaysRemaining(subscription.next_billing_date);
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining >= 0;

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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => navigate(`/subscription/${subscription.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
        {(subscription.status === 'active' || subscription.status === 'trial') && daysRemaining >= 0 && (
          <Badge 
            variant="outline" 
            className={`${isExpiringSoon ? 'border-warning/30 text-warning' : 'border-muted/30 text-muted-foreground'} text-xs`}
          >
            {daysRemaining} hari lagi
          </Badge>
        )}
        {subscription.is_trial && subscription.trial_end_date && (
          <TrialBadge 
            isTrial={subscription.is_trial} 
            trialEndDate={subscription.trial_end_date} 
          />
        )}
      </div>

      <div className="pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs">
              {format(parseISO(subscription.next_billing_date), 'd MMM yyyy', { locale: id })}
            </span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-foreground block">
              {formatCurrency(Number(subscription.price), subscription.currency)}
            </span>
            {subscription.currency !== 'IDR' && subscription.price > 0 && (
              <span className="text-xs text-muted-foreground">
                ≈ {formatCurrency(Number(subscription.price) * 15800, 'IDR')}
              </span>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Langganan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus langganan {subscription.name}? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteSubscription.mutate(subscription.id);
                setShowDeleteDialog(false);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
