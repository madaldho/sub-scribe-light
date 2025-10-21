import { addDays, addWeeks, addMonths, addYears, format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export type BillingCycle = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface DateCalculationResult {
  nextBillingDate: string;
  formattedDate: string;
  daysUntil: number;
}

/**
 * Calculates the next billing date based on start date and billing cycle
 */
export const calculateNextBillingDate = (startDate: string, billingCycle: BillingCycle): DateCalculationResult => {
  const start = parseISO(startDate);
  let nextDate: Date;

  switch (billingCycle) {
    case 'daily':
      nextDate = addDays(start, 1);
      break;
    case 'weekly':
      nextDate = addWeeks(start, 1);
      break;
    case 'monthly':
      nextDate = addMonths(start, 1);
      break;
    case 'yearly':
      nextDate = addYears(start, 1);
      break;
    default:
      nextDate = addMonths(start, 1);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  nextDate.setHours(0, 0, 0, 0);

  const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return {
    nextBillingDate: nextDate.toISOString().split('T')[0],
    formattedDate: format(nextDate, 'd MMMM yyyy', { locale: id }),
    daysUntil: Math.max(0, daysUntil)
  };
};

/**
 * Recalculates next billing date based on current next billing date
 */
export const recalculateNextBillingDate = (currentNextBillingDate: string, billingCycle: BillingCycle): DateCalculationResult => {
  return calculateNextBillingDate(currentNextBillingDate, billingCycle);
};

/**
 * Formats billing cycle for display
 */
export const formatBillingCycle = (cycle: BillingCycle): string => {
  const cycles: Record<BillingCycle, string> = {
    daily: "Harian",
    weekly: "Mingguan", 
    monthly: "Bulanan",
    yearly: "Tahunan"
  };
  return cycles[cycle] || cycle;
};

/**
 * Validates if a date is in the past
 */
export const isDatePast = (dateString: string): boolean => {
  const date = parseISO(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Gets days remaining until a date
 */
export const getDaysRemaining = (dateString: string): number => {
  const date = parseISO(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};
