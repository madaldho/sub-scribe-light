import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Subscription {
  id: string;
  user_id: string;
  name: string;
  next_billing_date: string;
  price: number;
  currency: string;
}

interface UserPreferences {
  user_id: string;
  notification_preferences: {
    email: boolean;
    push: boolean;
    days_before: number[];
  };
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

    console.log('Starting subscription check...');

    // Get all active subscriptions
    const { data: subscriptions, error: subsError } = await supabase
      .from('subscriptions')
      .select('id, user_id, name, next_billing_date, price, currency')
      .eq('status', 'active');

    if (subsError) {
      console.error('Error fetching subscriptions:', subsError);
      throw subsError;
    }

    console.log(`Found ${subscriptions?.length || 0} active subscriptions`);

    let notificationsCreated = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const subscription of subscriptions || []) {
      // Get user preferences
      const { data: prefs, error: prefsError } = await supabase
        .from('user_preferences')
        .select('notification_preferences')
        .eq('user_id', subscription.user_id)
        .single();

      if (prefsError) {
        console.log(`No preferences found for user ${subscription.user_id}, using defaults`);
      }

      const notificationPrefs = prefs?.notification_preferences || {
        email: true,
        push: false,
        days_before: [7, 3, 1]
      };

      // Calculate days until billing
      const billingDate = new Date(subscription.next_billing_date);
      billingDate.setHours(0, 0, 0, 0);
      const daysUntil = Math.ceil((billingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      console.log(`Subscription ${subscription.name}: ${daysUntil} days until billing`);

      // Check if we should send notification
      if (notificationPrefs.days_before.includes(daysUntil)) {
        // Check if notification already exists for this day
        const { data: existing } = await supabase
          .from('notifications')
          .select('id')
          .eq('subscription_id', subscription.id)
          .eq('type', 'upcoming_payment')
          .gte('created_at', today.toISOString())
          .single();

        if (!existing) {
          // Create notification
          const { error: notifError } = await supabase
            .from('notifications')
            .insert({
              user_id: subscription.user_id,
              subscription_id: subscription.id,
              type: 'upcoming_payment',
              title: 'Pembayaran Akan Datang',
              message: `Langganan "${subscription.name}" akan jatuh tempo dalam ${daysUntil} hari. Jumlah: ${subscription.currency} ${subscription.price}`,
              is_read: false,
              scheduled_for: billingDate.toISOString(),
            });

          if (notifError) {
            console.error('Error creating notification:', notifError);
          } else {
            notificationsCreated++;
            console.log(`Created notification for ${subscription.name}`);
          }
        } else {
          console.log(`Notification already exists for ${subscription.name}`);
        }
      }
    }

    console.log(`Completed. Created ${notificationsCreated} notifications`);

    return new Response(
      JSON.stringify({
        success: true,
        subscriptions_checked: subscriptions?.length || 0,
        notifications_created: notificationsCreated,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in check-upcoming-subscriptions:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
