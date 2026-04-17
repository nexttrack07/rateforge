import { Link, useRouterState } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const adminNavItems = [
	{ to: "/admin", label: "Overview" },
	{ to: "/admin/api-pricing-entry", label: "API Pricing" },
	{ to: "/admin/pricing-entry", label: "Pricing Entry" },
	{ to: "/admin/providers", label: "Providers" },
	{ to: "/admin/models", label: "Models" },
	{ to: "/admin/platforms", label: "Platforms" },
	{ to: "/admin/pricing", label: "Pricing" },
] as const;

export function AdminShell({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: React.ReactNode;
}) {
	const pathname = useRouterState({ select: (state) => state.location.pathname });

	return (
		<div className="space-y-8">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Badge variant="outline">Admin</Badge>
						<Badge variant="outline">Internal</Badge>
					</div>
					<div className="space-y-1">
						<h1 className="text-3xl font-semibold tracking-tight text-foreground">
							{title}
						</h1>
						<p className="max-w-3xl text-sm text-muted-foreground">
							{description}
						</p>
					</div>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
				<Card className="h-fit">
					<CardHeader>
						<CardTitle className="text-base">Content Areas</CardTitle>
					</CardHeader>
					<CardContent className="space-y-1">
						{adminNavItems.map((item) => {
							const isActive =
								pathname === item.to ||
								(item.to !== "/admin" && pathname.startsWith(`${item.to}/`));

							return (
								<Link
									key={item.to}
									to={item.to as never}
									className={cn(
										"block rounded-md border border-transparent px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-white/10 hover:bg-white/[0.03] hover:text-foreground",
										isActive &&
											"border-white/10 bg-white/[0.05] text-foreground",
									)}
								>
									{item.label}
								</Link>
							);
						})}
					</CardContent>
				</Card>

				<div className="space-y-6">{children}</div>
			</div>
		</div>
	);
}
