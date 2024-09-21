ALTER TYPE "recurring_type" ADD VALUE 'one-time';--> statement-breakpoint
ALTER TABLE "subscription" RENAME TO "transaction";--> statement-breakpoint
ALTER TABLE "transaction" RENAME COLUMN "cost" TO "amount";--> statement-breakpoint
ALTER TABLE "transaction" RENAME COLUMN "day_of_month" TO "monthly_day";--> statement-breakpoint
ALTER TABLE "transaction" RENAME COLUMN "custom_recurring_months" TO "monthly_recurring_months";--> statement-breakpoint
ALTER TABLE "transaction" DROP CONSTRAINT "subscription_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "start_date" timestamp;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "end_date" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
