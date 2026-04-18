import {
	boolean,
	date,
	decimal,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";

export const modelTypeEnum = pgEnum("model_type", ["image", "video", "text"]);
export const priceTypeEnum = pgEnum("price_type", [
	"per_second",
	"per_image",
	"per_1m_tokens",
]);
export const crawlStatusEnum = pgEnum("crawl_status", [
	"success",
	"error",
	"no_change",
]);

export const providers = pgTable(
	"providers",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		logoUrl: text("logo_url"),
		website: text("website"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		slugIdx: uniqueIndex("providers_slug_idx").on(table.slug),
		nameIdx: index("providers_name_idx").on(table.name),
	}),
);

export const models = pgTable(
	"models",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		providerId: uuid("provider_id")
			.notNull()
			.references(() => providers.id),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		type: modelTypeEnum("type").notNull(),
		description: text("description"),
		isActive: boolean("is_active").notNull().default(true),
		launchedAt: date("launched_at"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		slugIdx: uniqueIndex("models_slug_idx").on(table.slug),
		typeIdx: index("models_type_idx").on(table.type),
		providerIdx: index("models_provider_idx").on(table.providerId),
		activeIdx: index("models_active_idx").on(table.isActive),
	}),
);

export const platforms = pgTable(
	"platforms",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		logoUrl: text("logo_url"),
		website: text("website"),
		affiliateUrl: text("affiliate_url"),
		affiliateCommission: text("affiliate_commission"),
		pricingUrl: text("pricing_url"),
		shortDescription: text("short_description"),
		pros: jsonb("pros").$type<string[]>(),
		cons: jsonb("cons").$type<string[]>(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		slugIdx: uniqueIndex("platforms_slug_idx").on(table.slug),
		nameIdx: index("platforms_name_idx").on(table.name),
	}),
);

export const platformPlans = pgTable(
	"platform_plans",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		platformId: uuid("platform_id")
			.notNull()
			.references(() => platforms.id),
		name: text("name").notNull(),
		priceMonthly: decimal("price_monthly", { precision: 12, scale: 2 }),
		priceAnnual: decimal("price_annual", { precision: 12, scale: 2 }),
		credits: integer("credits"),
		currency: text("currency").notNull().default("USD"),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		platformIdx: index("platform_plans_platform_idx").on(table.platformId),
		platformNameIdx: uniqueIndex("platform_plans_platform_name_idx").on(
			table.platformId,
			table.name,
		),
	}),
);

export const modelPricing = pgTable(
	"model_pricing",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		modelId: uuid("model_id")
			.notNull()
			.references(() => models.id),
		priceType: priceTypeEnum("price_type").notNull(),
		resolution: text("resolution"),
		audioIncluded: boolean("audio_included").notNull().default(false),
		priceUsd: decimal("price_usd", { precision: 12, scale: 4 }).notNull(),
		sourceUrl: text("source_url"),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		modelIdx: index("model_pricing_model_idx").on(table.modelId),
		priceTypeIdx: index("model_pricing_price_type_idx").on(table.priceType),
		modelResolutionPriceTypeIdx: uniqueIndex(
			"model_pricing_model_resolution_price_type_idx",
		).on(table.modelId, table.priceType, table.resolution),
	}),
);

export const platformModelPricing = pgTable(
	"platform_model_pricing",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		platformId: uuid("platform_id")
			.notNull()
			.references(() => platforms.id),
		platformPlanId: uuid("platform_plan_id")
			.notNull()
			.references(() => platformPlans.id),
		modelId: uuid("model_id")
			.notNull()
			.references(() => models.id),
		creditsPerGen: decimal("credits_per_gen", { precision: 10, scale: 2 }),
		priceUsd: decimal("price_usd", { precision: 12, scale: 4 }),
		resolution: text("resolution"),
		notes: text("notes"),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		platformIdx: index("platform_model_pricing_platform_idx").on(table.platformId),
		planIdx: index("platform_model_pricing_plan_idx").on(table.platformPlanId),
		modelIdx: index("platform_model_pricing_model_idx").on(table.modelId),
		platformPlanModelResolutionIdx: uniqueIndex(
			"platform_model_pricing_platform_plan_model_resolution_idx",
		).on(table.platformPlanId, table.modelId, table.resolution),
	}),
);

export const pricingHistory = pgTable(
	"pricing_history",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		tableName: text("table_name").notNull(),
		recordId: uuid("record_id").notNull(),
		fieldName: text("field_name").notNull(),
		oldValue: text("old_value"),
		newValue: text("new_value"),
		changedAt: timestamp("changed_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		recordIdx: index("pricing_history_record_idx").on(
			table.tableName,
			table.recordId,
		),
		changedAtIdx: index("pricing_history_changed_at_idx").on(table.changedAt),
	}),
);

export const crawlLogs = pgTable(
	"crawl_logs",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		targetUrl: text("target_url").notNull(),
		status: crawlStatusEnum("status").notNull(),
		rawData: jsonb("raw_data"),
		errorMsg: text("error_msg"),
		ranAt: timestamp("ran_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => ({
		targetIdx: index("crawl_logs_target_idx").on(table.targetUrl),
		statusIdx: index("crawl_logs_status_idx").on(table.status),
		ranAtIdx: index("crawl_logs_ran_at_idx").on(table.ranAt),
	}),
);
