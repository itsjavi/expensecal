ALTER TABLE "subscription" ALTER COLUMN "day_of_month" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "subscription" ALTER COLUMN "recurring_type" SET DEFAULT 'monthly';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "currency" text DEFAULT 'USD';