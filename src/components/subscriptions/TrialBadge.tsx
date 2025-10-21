import { Badge } from "@/components/ui/badge";
import { differenceInDays, isPast, format } from "date-fns";
import { Clock, AlertTriangle } from "lucide-react";

interface TrialBadgeProps {
  isTrial: boolean;
  trialEndDate?: string;
}

export function TrialBadge({ isTrial, trialEndDate }: TrialBadgeProps) {
  if (!isTrial || !trialEndDate) return null;

  const trialDate = new Date(trialEndDate);
  const today = new Date();
  const daysLeft = differenceInDays(trialDate, today);
  const isExpired = isPast(trialDate);
  const isExpiringSoon = daysLeft <= 3 && daysLeft >= 0;

  if (isExpired) {
    return (
      <Badge 
        variant="destructive"
        className="gap-1"
      >
        <AlertTriangle className="h-3 w-3" />
        Trial Berakhir
      </Badge>
    );
  }

  if (isExpiringSoon) {
    return (
      <Badge 
        variant="destructive"
        className="gap-1"
      >
        <AlertTriangle className="h-3 w-3" />
        Trial: {daysLeft} hari lagi
      </Badge>
    );
  }

  return (
    <Badge 
      variant="secondary"
      className="gap-1"
    >
      <Clock className="h-3 w-3" />
      Trial: {daysLeft} hari lagi
    </Badge>
  );
}
