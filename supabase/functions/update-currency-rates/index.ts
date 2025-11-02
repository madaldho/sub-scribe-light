import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Free currency API - no key required
const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

interface ExchangeRates {
  rates: Record<string, number>;
  base: string;
  date: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Fetching latest currency rates...');

    // Fetch exchange rates from API
    const response = await fetch(EXCHANGE_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch rates: ${response.statusText}`);
    }

    const data: ExchangeRates = await response.json();
    console.log(`Fetched rates for ${Object.keys(data.rates).length} currencies`);

    // Currencies we're interested in
    const targetCurrencies = ['IDR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'SGD', 'MYR'];
    
    let ratesUpdated = 0;

    // Update rates for each currency pair
    for (const toCurrency of targetCurrencies) {
      if (!data.rates[toCurrency]) continue;

      for (const fromCurrency of targetCurrencies) {
        if (fromCurrency === toCurrency || !data.rates[fromCurrency]) continue;

        // Calculate conversion rate
        const rate = data.rates[toCurrency] / data.rates[fromCurrency];

        // Upsert rate
        const { error } = await supabase
          .from('currency_rates')
          .upsert({
            from_currency: fromCurrency,
            to_currency: toCurrency,
            rate: rate,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'from_currency,to_currency'
          });

        if (error) {
          console.error(`Error updating ${fromCurrency} to ${toCurrency}:`, error);
        } else {
          ratesUpdated++;
        }
      }
    }

    console.log(`Successfully updated ${ratesUpdated} currency rates`);

    return new Response(
      JSON.stringify({
        success: true,
        rates_updated: ratesUpdated,
        last_update: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in update-currency-rates:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
