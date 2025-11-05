-- Drop existing foreign key constraint
ALTER TABLE subscription_audit_log 
DROP CONSTRAINT IF EXISTS subscription_audit_log_subscription_id_fkey;

-- Add new foreign key constraint with ON DELETE SET NULL
ALTER TABLE subscription_audit_log 
ADD CONSTRAINT subscription_audit_log_subscription_id_fkey 
FOREIGN KEY (subscription_id) 
REFERENCES subscriptions(id) 
ON DELETE SET NULL;

-- Ensure the trigger logs before the deletion happens
DROP TRIGGER IF EXISTS log_subscription_changes ON subscriptions;

CREATE TRIGGER log_subscription_changes
  BEFORE INSERT OR UPDATE OR DELETE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION log_subscription_change();