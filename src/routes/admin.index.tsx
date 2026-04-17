import { Link, createFileRoute } from "@tanstack/react-router";
import { AdminPageSection } from "@/components/admin/AdminPageSection";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";

const adminAreas = [
	{
		title: "API Pricing Entry",
		description: "Fast workflow for entering multiple direct model pricing rows.",
		to: "/admin/api-pricing-entry",
		status: "Primary",
	},
	{
		title: "Pricing Entry",
		description: "Fast platform-first workflow for entering multiple pricing rows.",
		to: "/admin/pricing-entry",
		status: "Primary",
	},
	{
		title: "Providers",
		description: "Manage source providers like OpenAI, Google, and Kuaishou.",
		to: "/admin/providers",
		status: "Live",
	},
	{
		title: "Models",
		description: "Define individual image, video, and text models plus metadata.",
		to: "/admin/models",
		status: "Live",
	},
	{
		title: "Platforms",
		description: "Maintain platform records and subscription plans.",
		to: "/admin/platforms",
		status: "Live",
	},
	{
		title: "Pricing",
		description: "Enter API pricing and platform pricing in normalized units.",
		to: "/admin/pricing",
		status: "Live",
	},
] as const;

export const Route = createFileRoute("/admin/")({
	component: AdminOverviewPage,
});

function AdminOverviewPage() {
	return (
		<AdminShell
			title="Rateforge Admin"
			description="Manage pricing data, models, platforms, and providers."
		>
			<AdminPageSection
				title="Content Areas"
				description="Select an area below to manage data."
			>
				<div className="grid gap-4 md:grid-cols-2">
					{adminAreas.map((area) => (
						<Link
							key={area.to}
							to={area.to as never}
							className="rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="space-y-1">
									<p className="font-medium text-foreground">{area.title}</p>
									<p className="text-sm text-muted-foreground">
										{area.description}
									</p>
								</div>
								<Badge variant="outline">{area.status}</Badge>
							</div>
						</Link>
					))}
				</div>
			</AdminPageSection>

		</AdminShell>
	);
}
