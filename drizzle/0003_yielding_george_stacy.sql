DO $$ BEGIN
 CREATE TYPE "public"."expense_category" AS ENUM('housing', 'utilities', 'food', 'transportation', 'insurances', 'health', 'subscriptions', 'lifestyle', 'investments', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "category" "expense_category" DEFAULT 'other' NOT NULL;