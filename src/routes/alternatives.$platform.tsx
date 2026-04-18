import { createFileRoute, notFound } from "@tanstack/react-router";
import { ExternalLink, Check, X, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComparisonTable } from "@/components/ComparisonTable";
import {
	getPlatformBySlug,
	getAlternatives,
	getPlatformPricing,
	type PlatformWithMeta,
	type AlternativeComparison,
	type PricingEntry,
} from "@/lib/pricing/queries";
import { createSEOMeta, createFAQSchema, serializeJsonLd, SITE_URL } from "@/lib/seo";

type LoaderData = {
	platform: PlatformWithMeta;
	alternatives: AlternativeComparison[];
	platformPricing: PricingEntry[];
};

function generateFAQs(platform: PlatformWithMeta, alternatives: AlternativeComparison[]) {
	const cheapestAlt = alternatives[0];
	const faqs = [
		{
			question: `What are the best alternatives to ${platform.name}?`,
			answer: `The top alternatives to ${platform.name} include ${alternatives
				.slice(0, 3)
				.map((a) => a.platform.name)
				.join(", ")}. Each offers different pricing models and features for AI generation.`,
		},
		{
			question: `Is there a cheaper option than ${platform.name}?`,
			answer: cheapestAlt
				? `Yes, ${cheapestAlt.platform.name} offers pricing starting from $${cheapestAlt.lowestPrice?.toFixed(4)} per generation, which may be more affordable depending on your usage.`
				: `Pricing varies by model and usage. Compare options on Rateforge to find the best fit for your needs.`,
		},
		{
			question: `How does ${platform.name} pricing work?`,
			answer:
				platform.shortDescription ||
				`${platform.name} offers various pricing plans for AI generation. Visit their website for detailed pricing information.`,
		},
	];
	return faqs;
}

export const Route = createFileRoute("/alternatives/$platform")({
	component: AlternativesPage,
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		const { platform, alternatives } = loaderData;
		const faqs = generateFAQs(platform, alternatives);

		return {
			meta: createSEOMeta({
				title: `Best ${platform.name} Alternatives 2025`,
				description: `Compare ${platform.name} alternatives. Find cheaper AI generation platforms with similar features. Side-by-side pricing comparison of ${alternatives
					.slice(0, 3)
					.map((a) => a.platform.name)
					.join(", ")}, and more.`,
				canonical: `${SITE_URL}/alternatives/${platform.slug}`,
				keywords: [
					`${platform.name} alternatives`,
					`${platform.name} competitors`,
					`cheaper than ${platform.name}`,
					`${platform.name} vs`,
					"AI pricing comparison",
				],
			}),
			scripts: [
				{
					type: "application/ld+json",
					children: serializeJsonLd(createFAQSchema(faqs)),
				},
			],
		};
	},
	loader: async ({ params }) => {
		const platform = await getPlatformBySlug({ data: params.platform });
		if (!platform) {
			throw notFound();
		}

		const [alternatives, platformPricing] = await Promise.all([
			getAlternatives({ data: params.platform }),
			getPlatformPricing({ data: params.platform }),
		]);

		return { platform, alternatives, platformPricing } as LoaderData;
	},
});

function AlternativesPage() {
	const { platform, alternatives, platformPricing } = Route.useLoaderData();

	return (
		<div className="space-y-10">
			{/* Hero Section */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Link to="/compare" className="hover:text-foreground">
						Compare
					</Link>
					<span>/</span>
					<span>Alternatives</span>
				</div>

				<h1 className="text-3xl font-bold tracking-tight md:text-4xl">
					Best {platform.name} Alternatives in 2025
				</h1>

				<p className="max-w-2xl text-lg text-muted-foreground">
					{platform.shortDescription ||
						`Looking for alternatives to ${platform.name}? Compare pricing and features across ${alternatives.length} competing platforms.`}
				</p>

				{platform.website && (
					<a
						href={platform.website}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
					>
						Visit {platform.name}
						<ExternalLink size={14} />
					</a>
				)}
			</div>

			{/* Quick Stats */}
			<div className="grid gap-4 sm:grid-cols-3">
				<div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
					<div className="text-2xl font-bold">{alternatives.length}</div>
					<div className="mt-1 text-sm text-muted-foreground">Alternatives compared</div>
				</div>
				<div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
					<div className="text-2xl font-bold">
						{alternatives[0]?.lowestPrice
							? `$${alternatives[0].lowestPrice.toFixed(4)}`
							: "—"}
					</div>
					<div className="mt-1 text-sm text-muted-foreground">Lowest price found</div>
				</div>
				<div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
					<div className="text-2xl font-bold">{platformPricing.length}</div>
					<div className="mt-1 text-sm text-muted-foreground">
						{platform.name} pricing options
					</div>
				</div>
			</div>

			{/* Platform Pros/Cons */}
			{(platform.pros.length > 0 || platform.cons.length > 0) && (
				<div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
					<h2 className="text-lg font-semibold">About {platform.name}</h2>
					<div className="mt-4 grid gap-6 md:grid-cols-2">
						{platform.pros.length > 0 && (
							<div>
								<h3 className="mb-3 text-sm font-medium text-emerald-400">Pros</h3>
								<ul className="space-y-2">
									{platform.pros.map((pro, i) => (
										<li key={i} className="flex items-start gap-2 text-sm">
											<Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />
											<span className="text-muted-foreground">{pro}</span>
										</li>
									))}
								</ul>
							</div>
						)}
						{platform.cons.length > 0 && (
							<div>
								<h3 className="mb-3 text-sm font-medium text-red-400">Cons</h3>
								<ul className="space-y-2">
									{platform.cons.map((con, i) => (
										<li key={i} className="flex items-start gap-2 text-sm">
											<X size={16} className="mt-0.5 shrink-0 text-red-400" />
											<span className="text-muted-foreground">{con}</span>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Alternatives List */}
			<div className="space-y-6">
				<h2 className="text-2xl font-bold">Top Alternatives to {platform.name}</h2>

				<div className="grid gap-4">
					{alternatives.map((alt, index) => (
						<div
							key={alt.platform.id}
							className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.15] hover:bg-white/[0.04]"
						>
							<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
								<div className="flex-1 space-y-2">
									<div className="flex items-center gap-3">
										<span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.08] text-sm font-medium">
											{index + 1}
										</span>
										<h3 className="text-lg font-semibold">{alt.platform.name}</h3>
										<div className="flex gap-1.5">
											{alt.categories.map((cat) => (
												<Badge key={cat} variant="secondary" className="text-xs capitalize">
													{cat}
												</Badge>
											))}
										</div>
									</div>

									{alt.platform.shortDescription && (
										<p className="text-sm text-muted-foreground">
											{alt.platform.shortDescription}
										</p>
									)}

									{alt.platform.pros.length > 0 && (
										<div className="flex flex-wrap gap-2 pt-1">
											{alt.platform.pros.slice(0, 3).map((pro, i) => (
												<span
													key={i}
													className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400"
												>
													<Check size={12} />
													{pro}
												</span>
											))}
										</div>
									)}
								</div>

								<div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
									<div className="text-right">
										<div className="text-sm text-muted-foreground">From</div>
										<div className="text-xl font-bold">
											{alt.lowestPrice ? `$${alt.lowestPrice.toFixed(4)}` : "—"}
										</div>
										<div className="text-xs text-muted-foreground">per generation</div>
									</div>

									<Link
										to="/alternatives/$platform"
										params={{ platform: alt.platform.slug }}
										className="shrink-0"
									>
										<Button variant="outline" size="sm" className="gap-1.5">
											Compare
											<ArrowRight size={14} />
										</Button>
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Platform Pricing Table */}
			{platformPricing.length > 0 && (
				<div className="space-y-4">
					<h2 className="text-2xl font-bold">{platform.name} Pricing</h2>
					<p className="text-muted-foreground">
						Current pricing options available on {platform.name}.
					</p>
					<ComparisonTable
						entries={platformPricing}
						title=""
						description={`${platformPricing.length} pricing options`}
					/>
				</div>
			)}

			{/* CTA */}
			<div className="rounded-xl border border-primary/20 bg-primary/[0.05] p-6 text-center">
				<h2 className="text-xl font-bold">Compare All AI Pricing</h2>
				<p className="mx-auto mt-2 max-w-md text-muted-foreground">
					See the full comparison across all platforms and models in one place.
				</p>
				<Link to="/compare" className="mt-4 inline-block">
					<Button className="gap-2">
						View Full Comparison
						<ArrowRight size={16} />
					</Button>
				</Link>
			</div>
		</div>
	);
}
