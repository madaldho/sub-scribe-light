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
import { Subscription, useDeleteSubscription } from "@/hooks/useSubscriptions";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import { TrialBadge } from "./TrialBadge";

interface SubscriptionCardProps {
  subscription: Subscription;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const navigate = useNavigate();
  const deleteSubscription = useDeleteSubscription();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
          <span className="text-lg font-bold text-foreground">
            {formatCurrency(Number(subscription.price))}
          </span>
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
