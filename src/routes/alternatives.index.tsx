import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllPlatforms, type PlatformWithMeta } from "@/lib/pricing/queries";
import { createSEOMeta, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/alternatives/")({
	component: AlternativesIndexPage,
	head: () => ({
		meta: createSEOMeta({
			title: "AI Platform Alternatives",
			description:
				"Find alternatives to popular AI generation platforms. Compare pricing, features, and find the best platform for your needs.",
			canonical: `${SITE_URL}/alternatives`,
			keywords: [
				"AI platform alternatives",
				"Replicate alternatives",
				"Higgsfield alternatives",
				"fal.ai alternatives",
				"AI pricing comparison",
			],
		}),
	}),
	loader: async () => {
		const platforms = await getAllPlatforms();
		return { platforms };
	},
});

function AlternativesIndexPage() {
	const { platforms } = Route.useLoaderData();

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">AI Platform Alternatives</h1>
				<p className="max-w-2xl text-muted-foreground">
					Explore alternatives to popular AI generation platforms. Find the best pricing and
					features for your workflow.
				</p>
			</div>

			{/* Platform Grid */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{platforms.map((platform: PlatformWithMeta) => (
					<Link
						key={platform.id}
						to="/alternatives/$platform"
						params={{ platform: platform.slug }}
						className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition-all hover:border-white/[0.15] hover:bg-white/[0.04]"
					>
						<div className="flex items-start justify-between">
							<div>
								<h2 className="text-lg font-semibold group-hover:text-primary">
									{platform.name} Alternatives
								</h2>
								{platform.shortDescription && (
									<p className="mt-2 text-sm text-muted-foreground line-clamp-2">
										{platform.shortDescription}
									</p>
								)}
							</div>
							<ArrowRight
								size={18}
								className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
							/>
						</div>

						{platform.pros.length > 0 && (
							<div className="mt-4 flex flex-wrap gap-1.5">
								{platform.pros.slice(0, 2).map((pro, i) => (
									<span
										key={i}
										className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-muted-foreground"
									>
										{pro}
									</span>
								))}
							</div>
						)}
					</Link>
				))}
			</div>

			{/* CTA */}
			<div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 text-center">
				<h2 className="text-xl font-bold">Need a direct comparison?</h2>
				<p className="mx-auto mt-2 max-w-md text-muted-foreground">
					View all models and platforms side-by-side with real pricing data.
				</p>
				<Link to="/compare" className="mt-4 inline-block">
					<Button className="gap-2">
						Compare All Pricing
						<ArrowRight size={16} />
					</Button>
				</Link>
			</div>
		</div>
	);
}
