import { supabase } from "@/integrations/supabase/client";

// Default exchange rates (fallback)
const DEFAULT_RATES: Record<string, number> = {
  IDR: 1,
  USD: 15800,
  EUR: 17200,
  GBP: 20100,
  SGD: 11700,
  MYR: 3500,
  JPY: 106,
  CNY: 2200,
  AUD: 10300,
  CAD: 11500,
};

/**
 * Fetch latest currency rates from database
 */
export const fetchCurrencyRates = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from("currency_rates")
      .select("from_currency, to_currency, rate")
      .eq("to_currency", "IDR");

    if (error) throw error;

    const rates: Record<string, number> = { IDR: 1 };
    data?.forEach((rate) => {
      rates[rate.from_currency] = Number(rate.rate);
    });

    return { ...DEFAULT_RATES, ...rates };
  } catch (error) {
    console.error("Failed to fetch currency rates:", error);
    return DEFAULT_RATES;
  }
};

/**
 * Convert amount to IDR for analytics
 */
export const convertToIDR = async (amount: number, fromCurrency: string): Promise<number> => {
  if (!amount || amount === 0) return 0;
  if (fromCurrency === "IDR") return amount;

  const rates = await fetchCurrencyRates();
  const rate = rates[fromCurrency] || DEFAULT_RATES[fromCurrency] || 1;
  
  return amount * rate;
};

/**
 * Format currency display
 */
export const formatCurrency = (amount: number, currency: string = "IDR"): string => {
  if (!amount && amount !== 0) return "-";
  
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

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
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
  return symbols[currency] || currency;
};

/**
 * Calculate equivalent in IDR (for display purposes)
 */
export const calculateIDREquivalent = async (amount: number, currency: string): Promise<string> => {
  if (!amount || amount === 0) return "Rp 0";
  if (currency === "IDR") return formatCurrency(amount, "IDR");
  
  const idrAmount = await convertToIDR(amount, currency);
  return `≈ ${formatCurrency(idrAmount, "IDR")}`;
};
