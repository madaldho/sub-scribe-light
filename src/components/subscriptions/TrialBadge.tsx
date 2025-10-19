import { Badge } from "@/components/ui/badge";
import { differenceInDays } from "date-fns";
import { Clock } from "lucide-react";

interface TrialBadgeProps {
  isTrial: boolean;
  trialEndDate?: string;
}

export function TrialBadge({ isTrial, trialEndDate }: TrialBadgeProps) {
  if (!isTrial || !trialEndDate) return null;

  const daysLeft = differenceInDays(new Date(trialEndDate), new Date());
  const isExpiringSoon = daysLeft <= 3;

  return (
    <Badge 
      variant={isExpiringSoon ? "destructive" : "secondary"}
      className="gap-1"
    >
      <Clock className="h-3 w-3" />
      Trial: {daysLeft > 0 ? `${daysLeft} hari lagi` : "Berakhir hari ini"}
    </Badge>
  );
}
