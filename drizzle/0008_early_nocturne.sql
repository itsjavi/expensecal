DO $$ BEGIN
 CREATE TYPE "public"."transaction_type" AS ENUM('expense', 'income');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "expense_category" ADD VALUE 'revenue';--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "transaction_type" "transaction_type" DEFAULT 'expense' NOT NULL;