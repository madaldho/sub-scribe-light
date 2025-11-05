-- Update foreign key to CASCADE delete for audit logs
ALTER TABLE subscription_audit_log 
DROP CONSTRAINT IF EXISTS subscription_audit_log_subscription_id_fkey;

ALTER TABLE subscription_audit_log 
ADD CONSTRAINT subscription_audit_log_subscription_id_fkey 
FOREIGN KEY (subscription_id) 
REFERENCES subscriptions(id) 
ON DELETE CASCADE;

-- Update foreign key to CASCADE delete for notifications
ALTER TABLE notifications 
DROP CONSTRAINT IF EXISTS notifications_subscription_id_fkey;

ALTER TABLE notifications 
ADD CONSTRAINT notifications_subscription_id_fkey 
FOREIGN KEY (subscription_id) 
REFERENCES subscriptions(id) 
ON DELETE CASCADE;

-- Update foreign key to CASCADE delete for payment history
ALTER TABLE payment_history 
DROP CONSTRAINT IF EXISTS payment_history_subscription_id_fkey;

ALTER TABLE payment_history 
ADD CONSTRAINT payment_history_subscription_id_fkey 
FOREIGN KEY (subscription_id) 
REFERENCES subscriptions(id) 
ON DELETE CASCADE;