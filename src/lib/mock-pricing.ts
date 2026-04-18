export type ModelCategory = "image" | "video" | "text";
export type PricingSurface = "api" | "platform";

export type PricingEntry = {
	id: string;
	modelName: string;
	providerName: string;
	category: ModelCategory;
	surface: PricingSurface;
	platformName: string;
	planName: string | null;
	unitLabel: string;
	priceLabel: string;
	priceValue: number;
	resolution: string | null;
	audioIncluded: boolean;
	lastUpdatedLabel: string;
	notes: string | null;
};

export const featuredPricingEntries: PricingEntry[] = [
	{
		id: "kling-api",
		modelName: "Kling 3.0",
		providerName: "Kuaishou",
		category: "video",
		surface: "api",
		platformName: "Replicate API",
		planName: null,
		unitLabel: "per second",
		priceLabel: "$0.28/sec",
		priceValue: 0.28,
		resolution: "1080p",
		audioIncluded: false,
		lastUpdatedLabel: "2 hours ago",
		notes: null,
	},
	{
		id: "higgsfield-ultimate-kling",
		modelName: "Kling 3.0",
		providerName: "Kuaishou",
		category: "video",
		surface: "platform",
		platformName: "Higgsfield",
		planName: "Ultimate",
		unitLabel: "per 5s clip",
		priceLabel: "$1.35/clip",
		priceValue: 1.35,
		resolution: "1080p",
		audioIncluded: true,
		lastUpdatedLabel: "Today",
		notes: "Audio included on plan output.",
	},
	{
		id: "gpt-image-api",
		modelName: "GPT Image 1.5",
		providerName: "OpenAI",
		category: "image",
		surface: "api",
		platformName: "OpenAI API",
		planName: null,
		unitLabel: "per image",
		priceLabel: "$0.11/image",
		priceValue: 0.11,
		resolution: "1024",
		audioIncluded: false,
		lastUpdatedLabel: "1 day ago",
		notes: null,
	},
	{
		id: "openart-pro-gpt-image",
		modelName: "GPT Image 1.5",
		providerName: "OpenAI",
		category: "image",
		surface: "platform",
		platformName: "OpenArt",
		planName: "Pro",
		unitLabel: "per image",
		priceLabel: "$0.18/image",
		priceValue: 0.18,
		resolution: "1024",
		audioIncluded: false,
		lastUpdatedLabel: "3 days ago",
		notes: null,
	},
];

export const pricingEntries: PricingEntry[] = [
	...featuredPricingEntries,
	{
		id: "veo-api",
		modelName: "Veo 3.1",
		providerName: "Google",
		category: "video",
		surface: "api",
		platformName: "Replicate API",
		planName: null,
		unitLabel: "per 8s render",
		priceLabel: "$4.40/render",
		priceValue: 4.4,
		resolution: "1080p",
		audioIncluded: true,
		lastUpdatedLabel: "Today",
		notes: null,
	},
	{
		id: "runway-veo",
		modelName: "Veo 3.1",
		providerName: "Google",
		category: "video",
		surface: "platform",
		platformName: "Runway",
		planName: "Unlimited",
		unitLabel: "effective per render",
		priceLabel: "$3.10/render",
		priceValue: 3.1,
		resolution: "1080p",
		audioIncluded: true,
		lastUpdatedLabel: "2 days ago",
		notes: null,
	},
	{
		id: "nano-banana-api",
		modelName: "Nano Banana Pro",
		providerName: "Google",
		category: "image",
		surface: "api",
		platformName: "Replicate API",
		planName: null,
		unitLabel: "per image",
		priceLabel: "$0.09/image",
		priceValue: 0.09,
		resolution: "2K",
		audioIncluded: false,
		lastUpdatedLabel: "5 hours ago",
		notes: null,
	},
	{
		id: "freepik-nano-banana",
		modelName: "Nano Banana Pro",
		providerName: "Google",
		category: "image",
		surface: "platform",
		platformName: "Freepik",
		planName: "Premium+",
		unitLabel: "per image",
		priceLabel: "$0.14/image",
		priceValue: 0.14,
		resolution: "2K",
		audioIncluded: false,
		lastUpdatedLabel: "1 day ago",
		notes: null,
	},
	{
		id: "claude-sonnet-api",
		modelName: "Claude Sonnet 4.5",
		providerName: "Anthropic",
		category: "text",
		surface: "api",
		platformName: "Anthropic API",
		planName: null,
		unitLabel: "per 1M output tokens",
		priceLabel: "$15 / 1M",
		priceValue: 15,
		resolution: null,
		audioIncluded: false,
		lastUpdatedLabel: "4 days ago",
		notes: null,
	},
	{
		id: "openrouter-claude",
		modelName: "Claude Sonnet 4.5",
		providerName: "Anthropic",
		category: "text",
		surface: "platform",
		platformName: "OpenRouter",
		planName: null,
		unitLabel: "per 1M output tokens",
		priceLabel: "$16 / 1M",
		priceValue: 16,
		resolution: null,
		audioIncluded: false,
		lastUpdatedLabel: "4 days ago",
		notes: null,
	},
];

export const featuredTools = [
	{
		title: "Workflow calculator",
		description:
			"Estimate monthly costs for the exact mix of image and video generations you run.",
	},
	{
		title: "API vs platform calculator",
		description:
			"See the break-even point where raw API access becomes cheaper than subscriptions.",
	},
	{
		title: "Credit converter",
		description:
			"Turn confusing credit systems into actual dollar cost per generation.",
	},
] as const;
