import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calculator, ArrowLeftRight, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WorkflowCalculator, ApiVsPlatformCalculator } from "@/components/calculator";
import { cn } from "@/lib/utils";
import { createSEOMeta, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/tools")({
	component: ToolsPage,
	head: () => ({
		meta: createSEOMeta({
			title: "AI Cost Calculators",
			description:
				"Free calculators to estimate your AI generation costs. Workflow estimator, API vs Platform break-even analysis, and credit converter tools.",
			canonical: `${SITE_URL}/tools`,
			keywords: [
				"AI cost calculator",
				"AI pricing calculator",
				"API vs subscription calculator",
				"AI credit converter",
			],
		}),
	}),
});

const tools = [
	{
		id: "workflow",
		title: "Workflow Calculator",
		description: "Estimate monthly costs for your exact mix of image, video, and text generations.",
		icon: Calculator,
		status: "available" as const,
	},
	{
		id: "api-vs-platform",
		title: "API vs Platform",
		description: "Find the break-even point where subscriptions become cheaper than pay-per-use.",
		icon: ArrowLeftRight,
		status: "available" as const,
	},
	{
		id: "credit-converter",
		title: "Credit Converter",
		description: "Turn confusing credit systems into actual dollar costs per generation.",
		icon: Coins,
		status: "coming-soon" as const,
	},
];

function ToolsPage() {
	const [activeTool, setActiveTool] = useState<string | null>("workflow");

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">AI Cost Tools</h1>
				<p className="text-muted-foreground">
					Calculate, compare, and optimize your AI generation costs.
				</p>
			</div>

			{/* Tool Selector */}
			<div className="flex flex-wrap gap-3">
				{tools.map((tool) => {
					const Icon = tool.icon;
					const isActive = activeTool === tool.id;
					const isAvailable = tool.status === "available";

					return (
						<button
							key={tool.id}
							type="button"
							onClick={() => isAvailable && setActiveTool(tool.id)}
							disabled={!isAvailable}
							className={cn(
								"group relative flex flex-1 min-w-[200px] max-w-sm flex-col items-start gap-3 rounded-xl border p-5 text-left transition-all",
								isActive
									? "border-primary/50 bg-primary/[0.08]"
									: isAvailable
										? "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]"
										: "border-white/[0.04] bg-white/[0.01] opacity-60 cursor-not-allowed"
							)}
						>
							<div className="flex w-full items-start justify-between">
								<div
									className={cn(
										"flex h-10 w-10 items-center justify-center rounded-lg",
										isActive
											? "bg-primary/20 text-primary"
											: "bg-white/[0.06] text-muted-foreground group-hover:text-foreground"
									)}
								>
									<Icon size={20} />
								</div>
								{tool.status === "coming-soon" && (
									<Badge variant="outline" className="text-xs">
										Coming soon
									</Badge>
								)}
							</div>
							<div>
								<div
									className={cn(
										"font-semibold",
										isActive ? "text-primary" : "text-foreground"
									)}
								>
									{tool.title}
								</div>
								<div className="mt-1 text-sm text-muted-foreground">
									{tool.description}
								</div>
							</div>
						</button>
					);
				})}
			</div>

			{/* Active Calculator */}
			<div className="min-h-[400px]">
				{activeTool === "workflow" && <WorkflowCalculator />}
				{activeTool === "api-vs-platform" && <ApiVsPlatformCalculator />}
				{activeTool === "credit-converter" && (
					<div className="flex h-[400px] items-center justify-center rounded-xl border border-dashed border-white/[0.1] bg-white/[0.01]">
						<div className="text-center">
							<Coins size={48} className="mx-auto text-muted-foreground/50" />
							<div className="mt-4 font-medium text-foreground">
								Credit Converter
							</div>
							<div className="mt-1 text-sm text-muted-foreground">
								Coming soon — convert platform credits to real costs
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
