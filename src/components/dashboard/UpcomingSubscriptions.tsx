import { Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Subscription } from "@/hooks/useSubscriptions";
import { useMarkAsPaid } from "@/hooks/usePaymentHistory";
import { format, isWithinInterval, addDays, parseISO } from "date-fns";
import { id } from "date-fns/locale";

interface UpcomingSubscriptionsProps {
  subscriptions: Subscription[];
}

export const UpcomingSubscriptions = ({ subscriptions }: UpcomingSubscriptionsProps) => {
  const markAsPaid = useMarkAsPaid();

  // Filter subscriptions due within next 7 days
  const today = new Date();
  const nextWeek = addDays(today, 7);

  const upcomingSubscriptions = subscriptions
    .filter(sub => {
      if (sub.status !== 'active') return false;
      const dueDate = parseISO(sub.next_billing_date);
      return isWithinInterval(dueDate, { start: today, end: nextWeek });
    })
    .sort((a, b) => new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleMarkAsPaid = (sub: Subscription, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsPaid.mutate({
      subscriptionId: sub.id,
      amount: Number(sub.price),
      billingCycle: sub.billing_cycle,
      currentNextBillingDate: sub.next_billing_date
    });
  };

  if (upcomingSubscriptions.length === 0) {
    return (
      <div className="neumo-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Jatuh Tempo Minggu Ini</h2>
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <p className="text-foreground-muted text-center py-8">Tidak ada tagihan minggu ini</p>
      </div>
    );
  }

  return (
    <div className="neumo-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Jatuh Tempo Minggu Ini</h2>
        <Calendar className="h-5 w-5 text-primary" />
      </div>

      <div className="space-y-4">
        {upcomingSubscriptions.map((sub) => (
          <div 
            key={sub.id}
            className="neumo-card neumo-card-hover p-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="neumo-card p-3 rounded-xl text-2xl bg-background-elevated flex-shrink-0">
                {sub.logo_url ? (
                  <img src={sub.logo_url} alt={sub.name} className="w-8 h-8 object-contain" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {sub.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{sub.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-foreground-muted capitalize">{sub.billing_cycle}</span>
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                    {sub.category}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="font-bold text-foreground mb-1">{formatCurrency(Number(sub.price))}</p>
              <p className="text-sm text-foreground-muted">
                {format(parseISO(sub.next_billing_date), 'd MMM', { locale: id })}
              </p>
            </div>

            <Button
              size="icon"
              onClick={(e) => handleMarkAsPaid(sub, e)}
              disabled={markAsPaid.isPending}
              className="neumo-card neumo-card-hover rounded-xl bg-success/10 text-success hover:bg-success hover:text-success-foreground flex-shrink-0"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
