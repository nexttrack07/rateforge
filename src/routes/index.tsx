import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	BarChart3,
	Calculator,
	CreditCard,
	GitCompare,
	Sparkles,
	TrendingUp,
	Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { featuredPricingEntries } from "@/lib/mock-pricing";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	return (
		<div className="space-y-20 pb-16">
			{/* Hero Section */}
			<section className="relative py-12 lg:py-20">
				<div className="mx-auto max-w-4xl text-center">
					<Badge className="mb-6">Stop overpaying for AI</Badge>
					<h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
						Find the cheapest way to run{" "}
						<span className="text-primary">any AI model</span>
					</h1>
					<p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
						Compare pricing across Replicate, Higgsfield, OpenArt, Runway, and more.
						We normalize credits, subscriptions, and API costs so you can actually compare.
					</p>
					<div className="mt-8 flex flex-wrap items-center justify-center gap-4">
						<Link to="/compare">
							<Button size="lg" className="gap-2">
								Compare prices
								<ArrowRight size={16} />
							</Button>
						</Link>
						<Link to="/tools">
							<Button variant="outline" size="lg" className="gap-2">
								<Calculator size={16} />
								Cost calculators
							</Button>
						</Link>
					</div>
				</div>

				{/* Stats Bar */}
				<div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4">
					<StatCard value="40+" label="AI models" icon={<Sparkles size={16} />} />
					<StatCard value="18+" label="Platforms" icon={<BarChart3 size={16} />} />
					<StatCard value="Daily" label="Updates" icon={<TrendingUp size={16} />} />
				</div>
			</section>

			{/* Quick Compare Preview */}
			<section>
				<div className="mb-8 text-center">
					<h2 className="text-2xl font-bold tracking-tight">See it in action</h2>
					<p className="mt-2 text-muted-foreground">
						Real pricing data, updated daily
					</p>
				</div>
				<Card className="overflow-hidden">
					<div className="overflow-x-auto">
						<table className="min-w-full text-left text-sm">
							<thead className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] uppercase tracking-wider text-muted-foreground">
								<tr>
									<th className="px-5 py-4 font-medium">Model</th>
									<th className="px-5 py-4 font-medium">Platform</th>
									<th className="px-5 py-4 font-medium">Type</th>
									<th className="px-5 py-4 font-medium text-right">Price</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/[0.04]">
								{featuredPricingEntries.map((entry) => (
									<tr
										key={entry.id}
										className="transition-colors hover:bg-white/[0.02]"
									>
										<td className="px-5 py-4">
											<div className="font-medium text-foreground">
												{entry.modelName}
											</div>
											<div className="mt-0.5 text-xs text-muted-foreground">
												{entry.providerName}
											</div>
										</td>
										<td className="px-5 py-4 text-muted-foreground">
											{entry.platformName}
											{entry.planName && (
												<span className="text-xs opacity-60"> · {entry.planName}</span>
											)}
										</td>
										<td className="px-5 py-4">
											<Badge variant={entry.surface === "api" ? "default" : "outline"}>
												{entry.surface}
											</Badge>
										</td>
										<td className="px-5 py-4 text-right">
											<div className="font-semibold text-foreground">
												{entry.priceLabel}
											</div>
											<div className="mt-0.5 text-xs text-muted-foreground">
												{entry.unitLabel}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="border-t border-white/[0.06] bg-white/[0.01] px-5 py-4">
						<Link to="/compare" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
							View full comparison table
							<ArrowRight size={14} />
						</Link>
					</div>
				</Card>
			</section>

			{/* Features */}
			<section className="grid gap-6 md:grid-cols-3">
				<FeatureCard
					icon={<GitCompare size={20} />}
					title="API vs Platform"
					description="Compare raw API pricing against platform subscriptions and credit systems."
				/>
				<FeatureCard
					icon={<CreditCard size={20} />}
					title="Credit conversion"
					description="See what platform credits actually cost in real dollars per generation."
				/>
				<FeatureCard
					icon={<Zap size={20} />}
					title="Break-even analysis"
					description="Find when switching from a subscription to direct API access saves money."
				/>
			</section>

			{/* Tools Section */}
			<section>
				<div className="mb-8 flex items-end justify-between">
					<div>
						<h2 className="text-2xl font-bold tracking-tight">Free calculators</h2>
						<p className="mt-2 text-muted-foreground">
							Answer your cost questions in seconds
						</p>
					</div>
					<Link to="/tools">
						<Button variant="ghost" className="gap-2">
							All tools
							<ArrowRight size={14} />
						</Button>
					</Link>
				</div>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<ToolCard
						icon={<CreditCard size={18} />}
						title="Credit converter"
						description="Turn platform credits into actual USD cost per generation."
						badge="Popular"
					/>
					<ToolCard
						icon={<Calculator size={18} />}
						title="Workflow estimator"
						description="Estimate monthly costs based on your image and video volume."
					/>
					<ToolCard
						icon={<GitCompare size={18} />}
						title="API vs Platform"
						description="Find the break-even point for switching to direct API."
					/>
				</div>
			</section>

			{/* CTA Section */}
			<section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-primary/10 via-transparent to-transparent p-8 lg:p-12">
				<div className="relative z-10 max-w-2xl">
					<h2 className="text-2xl font-bold tracking-tight lg:text-3xl">
						Stop guessing. Start comparing.
					</h2>
					<p className="mt-3 text-muted-foreground">
						Whether you're choosing between Midjourney and Replicate, or figuring out
						if Higgsfield's credits are worth it — Rateforge has the data.
					</p>
					<div className="mt-6 flex flex-wrap gap-3">
						<Link to="/compare">
							<Button size="lg">
								Open comparison table
								<ArrowRight size={16} />
							</Button>
						</Link>
					</div>
				</div>
				<div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
			</section>
		</div>
	);
}

function StatCard({
	value,
	label,
	icon,
}: {
	value: string;
	label: string;
	icon: React.ReactNode;
}) {
	return (
		<div className="rounded-xl border border-white/[0.08] bg-card/60 px-4 py-5 text-center backdrop-blur-sm">
			<div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
				{icon}
			</div>
			<p className="text-2xl font-bold text-foreground">{value}</p>
			<p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
		</div>
	);
}

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="rounded-xl border border-white/[0.08] bg-card/60 p-6 backdrop-blur-sm">
			<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
				{icon}
			</div>
			<h3 className="mt-4 font-semibold text-foreground">{title}</h3>
			<p className="mt-2 text-sm text-muted-foreground">{description}</p>
		</div>
	);
}

function ToolCard({
	icon,
	title,
	description,
	badge,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	badge?: string;
}) {
	return (
		<Link to="/tools" className="group">
			<div className="h-full rounded-xl border border-white/[0.08] bg-card/60 p-5 backdrop-blur-sm transition-colors group-hover:border-primary/30 group-hover:bg-card/80">
				<div className="flex items-start justify-between gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
						{icon}
					</div>
					{badge && <Badge variant="default">{badge}</Badge>}
				</div>
				<h3 className="mt-4 font-semibold text-foreground group-hover:text-primary">
					{title}
				</h3>
				<p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
			</div>
		</Link>
	);
}
