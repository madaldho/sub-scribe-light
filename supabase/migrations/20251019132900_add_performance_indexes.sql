-- Performance Optimization: Add indexes for faster queries with large datasets
-- This migration adds indexes to critical columns that are frequently queried

-- Subscriptions table indexes
-- Index on user_id for filtering subscriptions by user (most common query)
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id 
  ON public.subscriptions(user_id);

-- Index on next_billing_date for finding upcoming payments
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing 
  ON public.subscriptions(next_billing_date);

-- Index on status for filtering active/cancelled subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_status 
  ON public.subscriptions(status);

-- Composite index for user + status queries (common filter combination)
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status 
  ON public.subscriptions(user_id, status);

-- Composite index for upcoming payment queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_billing 
  ON public.subscriptions(user_id, next_billing_date) 
  WHERE status = 'active';

-- Payment methods table indexes
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id 
  ON public.payment_methods(user_id);

-- Payment history table indexes
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id 
  ON public.payment_history(user_id);

-- Index on payment_date for date range queries
CREATE INDEX IF NOT EXISTS idx_payment_history_date 
  ON public.payment_history(payment_date);

-- Composite index for user payment history queries
CREATE INDEX IF NOT EXISTS idx_payment_history_user_date 
  ON public.payment_history(user_id, payment_date DESC);

-- Index on subscription_id for joining with subscriptions
CREATE INDEX IF NOT EXISTS idx_payment_history_subscription 
  ON public.payment_history(subscription_id);

-- Notifications table indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id 
  ON public.notifications(user_id);

-- Index on is_read for filtering unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_unread 
  ON public.notifications(user_id, is_read) 
  WHERE is_read = false;

-- Index on scheduled_for for scheduled notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled 
  ON public.notifications(scheduled_for) 
  WHERE sent_at IS NULL;

-- Subscription audit log indexes
CREATE INDEX IF NOT EXISTS idx_audit_log_subscription 
  ON public.subscription_audit_log(subscription_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_user 
  ON public.subscription_audit_log(user_id);

-- Index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_audit_log_created 
  ON public.subscription_audit_log(created_at DESC);

-- User preferences index (already has UNIQUE constraint on user_id)
-- No additional index needed as UNIQUE creates an index

-- Add partial indexes for trial subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_trial_active 
  ON public.subscriptions(user_id, trial_end_date) 
  WHERE is_trial = true AND status = 'active';

-- Add GIN index for jsonb columns for faster JSON queries
CREATE INDEX IF NOT EXISTS idx_user_preferences_notification_gin 
  ON public.user_preferences USING gin(notification_preferences);

CREATE INDEX IF NOT EXISTS idx_audit_log_changes_gin 
  ON public.subscription_audit_log USING gin(changes);

-- Add BRIN index for large tables with sequential data (created_at)
-- BRIN indexes are very space-efficient for large tables
CREATE INDEX IF NOT EXISTS idx_payment_history_created_brin 
  ON public.payment_history USING brin(created_at);

-- Analyze tables to update statistics for query planner
ANALYZE public.subscriptions;
ANALYZE public.payment_methods;
ANALYZE public.payment_history;
ANALYZE public.notifications;
ANALYZE public.subscription_audit_log;
ANALYZE public.user_preferences;

-- Create helpful comments on indexes
COMMENT ON INDEX idx_subscriptions_user_id IS 'Speeds up queries filtering subscriptions by user';
COMMENT ON INDEX idx_subscriptions_next_billing IS 'Optimizes queries for upcoming payments';
COMMENT ON INDEX idx_subscriptions_user_billing IS 'Composite index for active subscriptions with billing dates';
COMMENT ON INDEX idx_payment_history_user_date IS 'Optimizes payment history queries with date sorting';
COMMENT ON INDEX idx_notifications_unread IS 'Fast retrieval of unread notifications';
COMMENT ON INDEX idx_user_preferences_notification_gin IS 'Enables fast JSON queries on notification preferences';
