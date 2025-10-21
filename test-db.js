// Test script to check Supabase connectivity and show table data
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://cisgtbibblwmcbewkefp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpc2d0YmliYmx3bWNiZXdrZWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTc1NDEsImV4cCI6MjA2NTU3MzU0MX0.nnS9D7snyrHu39mVEiK3t26oy9DhrpekfR9gJEbiUOY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('🔗 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('subscriptions').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connection successful!');
    console.log(`📊 Database connection confirmed`);
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    return false;
  }
}

async function showTableData() {
  console.log('\n📋 Checking available tables and data...\n');
  
  const tables = [
    'subscriptions',
    'payment_history', 
    'payment_methods',
    'subscription_categories',
    'profiles',
    'user_preferences',
    'notifications',
    'currency_rates'
  ];
  
  for (const tableName of tables) {
    try {
      console.log(`📁 Table: ${tableName}`);
      
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
        continue;
      }
      
      console.log(`   📈 Total records: ${count || 0}`);
      
      if (count > 0) {
        // Get sample data
        const { data: sampleData, error: sampleError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (!sampleError && sampleData.length > 0) {
          console.log('   📝 Sample data:');
          console.log('   ', JSON.stringify(sampleData[0], null, 2));
        }
      } else if (tableName === 'subscriptions') {
        console.log('   💡 Example subscription data structure:');
        console.log('   ', {
          id: "uuid-example-123",
          name: "Netflix",
          description: "Premium Plan",
          price: 150000,
          currency: "IDR",
          billing_cycle: "monthly",
          category: "Entertainment",
          status: "active",
          start_date: "2025-01-01",
          next_billing_date: "2025-02-01",
          payment_method: "Credit Card",
          auto_renew: true,
          is_trial: false,
          user_id: "user-uuid-here",
          created_at: "2025-01-01T00:00:00Z"
        });
      }
      
      console.log('');
      
    } catch (err) {
      console.log(`   ❌ Exception: ${err.message}\n`);
    }
  }
}

async function main() {
  const isConnected = await testConnection();
  
  if (isConnected) {
    await showTableData();
  }
  
  console.log('\n🏁 Database test completed!');
}

main().catch(console.error);
