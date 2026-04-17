import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AdminPageSection } from "@/components/admin/AdminPageSection";
import { AdminSelect } from "@/components/admin/AdminSelect";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	createAdminPlatform,
	createAdminPlatformPlan,
	getAdminPlatforms,
} from "@/lib/admin/queries";

export const Route = createFileRoute("/admin/platforms")({
	loader: () => getAdminPlatforms(),
	component: AdminPlatformsPage,
});

function AdminPlatformsPage() {
	const { platforms: platformRows, plans: planRows } = Route.useLoaderData();
	const router = useRouter();
	const [platformForm, setPlatformForm] = useState({
		name: "",
		slug: "",
		website: "",
		pricingUrl: "",
		affiliateUrl: "",
		affiliateCommission: "",
	});
	const [planForm, setPlanForm] = useState({
		platformId: platformRows[0]?.id ?? "",
		name: "",
		priceMonthly: "",
		priceAnnual: "",
		credits: "",
		currency: "USD",
	});
	const [status, setStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isSubmittingPlatform, setIsSubmittingPlatform] = useState(false);
	const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);

	async function handlePlatformSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmittingPlatform(true);
		setStatus(null);
		setError(null);
		try {
			await createAdminPlatform({ data: platformForm });
			setPlatformForm({
				name: "",
				slug: "",
				website: "",
				pricingUrl: "",
				affiliateUrl: "",
				affiliateCommission: "",
			});
			setStatus("Platform created.");
			await router.invalidate();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create platform.");
		} finally {
			setIsSubmittingPlatform(false);
		}
	}

	async function handlePlanSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmittingPlan(true);
		setStatus(null);
		setError(null);
		try {
			await createAdminPlatformPlan({ data: planForm });
			setPlanForm({
				platformId: platformRows[0]?.id ?? "",
				name: "",
				priceMonthly: "",
				priceAnnual: "",
				credits: "",
				currency: "USD",
			});
			setStatus("Platform plan created.");
			await router.invalidate();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create plan.");
		} finally {
			setIsSubmittingPlan(false);
		}
	}

	return (
		<AdminShell
			title="Platforms"
			description="Platforms capture subscription products, affiliate links, pricing pages, and plan structure. This section will eventually include both platform and platform-plan editing."
		>
			<AdminPageSection
				title="Platform table"
				description="Current platform records from the live database."
				actionLabel="Add platform"
			>
				<div className="overflow-hidden rounded-lg border border-white/10">
					<div className="grid grid-cols-[1fr_1fr_1fr_1fr] border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground">
						<span>Name</span>
						<span>Slug</span>
						<span>Pricing URL</span>
						<span>Affiliate URL</span>
					</div>
					{platformRows.length === 0 ? (
						<div className="px-4 py-6 text-sm text-muted-foreground">
							No platforms found in the database yet.
						</div>
					) : (
						<div className="divide-y divide-white/10">
							{platformRows.map((platform) => (
								<div
									key={platform.id}
									className="grid grid-cols-[1fr_1fr_1fr_1fr] items-center gap-4 px-4 py-3 text-sm"
								>
									<p className="truncate font-medium text-foreground">
										{platform.name}
									</p>
									<p className="truncate text-muted-foreground">
										{platform.slug}
									</p>
									<p className="truncate text-muted-foreground">
										{platform.pricingUrl ?? "—"}
									</p>
									<p className="truncate text-muted-foreground">
										{platform.affiliateUrl ?? "—"}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</AdminPageSection>

			<AdminPageSection
				title="Platform plans"
				description="Current plan records from the live database."
				actionLabel="Add plan"
			>
				<div className="overflow-hidden rounded-lg border border-white/10">
					<div className="grid grid-cols-[1fr_1fr_0.8fr_0.8fr] border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground">
						<span>Platform</span>
						<span>Plan</span>
						<span>Monthly</span>
						<span>Credits</span>
					</div>
					{planRows.length === 0 ? (
						<div className="px-4 py-6 text-sm text-muted-foreground">
							No platform plans found in the database yet.
						</div>
					) : (
						<div className="divide-y divide-white/10">
							{planRows.map((plan) => (
								<div
									key={plan.id}
									className="grid grid-cols-[1fr_1fr_0.8fr_0.8fr] items-center gap-4 px-4 py-3 text-sm"
								>
									<p className="truncate font-medium text-foreground">
										{plan.platformName}
									</p>
									<p className="truncate text-muted-foreground">
										{plan.name}
									</p>
									<p className="truncate text-muted-foreground">
										{plan.priceMonthly ? `$${plan.priceMonthly}` : "—"}
									</p>
									<p className="truncate text-muted-foreground">
										{plan.credits ?? "—"}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</AdminPageSection>

			<AdminPageSection
				title="Platform form"
				description="Create a new platform record."
			>
				<form className="grid gap-4 md:grid-cols-2" onSubmit={handlePlatformSubmit}>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">
							Platform name
						</label>
						<Input value={platformForm.name} onChange={(e) => setPlatformForm((c) => ({ ...c, name: e.target.value }))} placeholder="OpenArt" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Slug</label>
						<Input value={platformForm.slug} onChange={(e) => setPlatformForm((c) => ({ ...c, slug: e.target.value }))} placeholder="openart" />
					</div>
					<div className="space-y-2 md:col-span-2">
						<label className="text-sm font-medium text-foreground">
							Website
						</label>
						<Input value={platformForm.website} onChange={(e) => setPlatformForm((c) => ({ ...c, website: e.target.value }))} placeholder="https://openart.ai" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">
							Pricing URL
						</label>
						<Input value={platformForm.pricingUrl} onChange={(e) => setPlatformForm((c) => ({ ...c, pricingUrl: e.target.value }))} placeholder="https://openart.ai/pricing" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">
							Affiliate URL
						</label>
						<Input value={platformForm.affiliateUrl} onChange={(e) => setPlatformForm((c) => ({ ...c, affiliateUrl: e.target.value }))} placeholder="https://..." />
					</div>
					<div className="space-y-2 md:col-span-2">
						<label className="text-sm font-medium text-foreground">
							Commission notes
						</label>
						<Textarea value={platformForm.affiliateCommission} onChange={(e) => setPlatformForm((c) => ({ ...c, affiliateCommission: e.target.value }))} placeholder="Example: 20% recurring via direct affiliate program." />
					</div>
					<div className="md:col-span-2 flex items-center gap-3">
						<Button type="submit" disabled={isSubmittingPlatform}>
							{isSubmittingPlatform ? "Creating..." : "Create platform"}
						</Button>
						{status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
						{error ? <p className="text-sm text-destructive">{error}</p> : null}
					</div>
				</form>
			</AdminPageSection>

			<AdminPageSection
				title="Plan form"
				description="Create a new platform plan."
			>
				<form className="grid gap-4 md:grid-cols-2" onSubmit={handlePlanSubmit}>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Platform</label>
						<AdminSelect value={planForm.platformId} onChange={(e) => setPlanForm((c) => ({ ...c, platformId: e.target.value }))}>
							<option value="">Select platform</option>
							{platformRows.map((platform) => (
								<option key={platform.id} value={platform.id}>{platform.name}</option>
							))}
						</AdminSelect>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Plan name</label>
						<Input value={planForm.name} onChange={(e) => setPlanForm((c) => ({ ...c, name: e.target.value }))} placeholder="Creator" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Monthly price</label>
						<Input value={planForm.priceMonthly} onChange={(e) => setPlanForm((c) => ({ ...c, priceMonthly: e.target.value }))} placeholder="29.00" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Annual price</label>
						<Input value={planForm.priceAnnual} onChange={(e) => setPlanForm((c) => ({ ...c, priceAnnual: e.target.value }))} placeholder="24.00" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Credits</label>
						<Input value={planForm.credits} onChange={(e) => setPlanForm((c) => ({ ...c, credits: e.target.value }))} placeholder="4000" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Currency</label>
						<Input value={planForm.currency} onChange={(e) => setPlanForm((c) => ({ ...c, currency: e.target.value }))} placeholder="USD" />
					</div>
					<div className="md:col-span-2 flex items-center gap-3">
						<Button type="submit" disabled={isSubmittingPlan}>
							{isSubmittingPlan ? "Creating..." : "Create plan"}
						</Button>
					</div>
				</form>
			</AdminPageSection>
		</AdminShell>
	);
}
