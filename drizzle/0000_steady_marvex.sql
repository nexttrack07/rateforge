CREATE TYPE "public"."crawl_status" AS ENUM('success', 'error', 'no_change');--> statement-breakpoint
CREATE TYPE "public"."model_type" AS ENUM('image', 'video', 'text');--> statement-breakpoint
CREATE TYPE "public"."price_type" AS ENUM('per_second', 'per_image', 'per_1m_tokens');--> statement-breakpoint
CREATE TABLE "crawl_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"target_url" text NOT NULL,
	"status" "crawl_status" NOT NULL,
	"raw_data" jsonb,
	"error_msg" text,
	"ran_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "model_pricing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" uuid NOT NULL,
	"price_type" "price_type" NOT NULL,
	"resolution" text,
	"audio_included" boolean DEFAULT false NOT NULL,
	"price_usd" numeric(12, 4) NOT NULL,
	"source_url" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"type" "model_type" NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"launched_at" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_model_pricing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform_id" uuid NOT NULL,
	"platform_plan_id" uuid NOT NULL,
	"model_id" uuid NOT NULL,
	"credits_per_gen" integer,
	"price_usd" numeric(12, 4),
	"resolution" text,
	"notes" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform_id" uuid NOT NULL,
	"name" text NOT NULL,
	"price_monthly" numeric(12, 2),
	"price_annual" numeric(12, 2),
	"credits" integer,
	"currency" text DEFAULT 'USD' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platforms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"website" text,
	"affiliate_url" text,
	"affiliate_commission" text,
	"pricing_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pricing_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_name" text NOT NULL,
	"record_id" uuid NOT NULL,
	"field_name" text NOT NULL,
	"old_value" text,
	"new_value" text,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"website" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "model_pricing" ADD CONSTRAINT "model_pricing_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "models" ADD CONSTRAINT "models_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_model_pricing" ADD CONSTRAINT "platform_model_pricing_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_model_pricing" ADD CONSTRAINT "platform_model_pricing_platform_plan_id_platform_plans_id_fk" FOREIGN KEY ("platform_plan_id") REFERENCES "public"."platform_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_model_pricing" ADD CONSTRAINT "platform_model_pricing_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_plans" ADD CONSTRAINT "platform_plans_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "crawl_logs_target_idx" ON "crawl_logs" USING btree ("target_url");--> statement-breakpoint
CREATE INDEX "crawl_logs_status_idx" ON "crawl_logs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "crawl_logs_ran_at_idx" ON "crawl_logs" USING btree ("ran_at");--> statement-breakpoint
CREATE INDEX "model_pricing_model_idx" ON "model_pricing" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "model_pricing_price_type_idx" ON "model_pricing" USING btree ("price_type");--> statement-breakpoint
CREATE UNIQUE INDEX "model_pricing_model_resolution_price_type_idx" ON "model_pricing" USING btree ("model_id","price_type","resolution");--> statement-breakpoint
CREATE UNIQUE INDEX "models_slug_idx" ON "models" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "models_type_idx" ON "models" USING btree ("type");--> statement-breakpoint
CREATE INDEX "models_provider_idx" ON "models" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "models_active_idx" ON "models" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "platform_model_pricing_platform_idx" ON "platform_model_pricing" USING btree ("platform_id");--> statement-breakpoint
CREATE INDEX "platform_model_pricing_plan_idx" ON "platform_model_pricing" USING btree ("platform_plan_id");--> statement-breakpoint
CREATE INDEX "platform_model_pricing_model_idx" ON "platform_model_pricing" USING btree ("model_id");--> statement-breakpoint
CREATE UNIQUE INDEX "platform_model_pricing_platform_plan_model_resolution_idx" ON "platform_model_pricing" USING btree ("platform_plan_id","model_id","resolution");--> statement-breakpoint
CREATE INDEX "platform_plans_platform_idx" ON "platform_plans" USING btree ("platform_id");--> statement-breakpoint
CREATE UNIQUE INDEX "platform_plans_platform_name_idx" ON "platform_plans" USING btree ("platform_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "platforms_slug_idx" ON "platforms" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "platforms_name_idx" ON "platforms" USING btree ("name");--> statement-breakpoint
CREATE INDEX "pricing_history_record_idx" ON "pricing_history" USING btree ("table_name","record_id");--> statement-breakpoint
CREATE INDEX "pricing_history_changed_at_idx" ON "pricing_history" USING btree ("changed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "providers_slug_idx" ON "providers" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "providers_name_idx" ON "providers" USING btree ("name");