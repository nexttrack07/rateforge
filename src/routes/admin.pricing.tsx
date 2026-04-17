import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminPageSection } from "@/components/admin/AdminPageSection";
import { AdminSelect } from "@/components/admin/AdminSelect";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	createAdminApiPricing,
	createAdminPlatformPricing,
	getAdminPricing,
} from "@/lib/admin/queries";

export const Route = createFileRoute("/admin/pricing")({
	loader: () => getAdminPricing(),
	component: AdminPricingPage,
});

function AdminPricingPage() {
	const { apiPricing, platformPricing, pricingHistory, modelOptions, platformOptions, planOptions } =
		Route.useLoaderData();
	const router = useRouter();
	const [apiForm, setApiForm] = useState({
		modelId: modelOptions[0]?.id ?? "",
		priceType: "per_image" as "per_second" | "per_image" | "per_1m_tokens",
		resolution: "",
		priceUsd: "",
		sourceUrl: "",
		audioIncluded: false,
	});
	const [platformForm, setPlatformForm] = useState({
		platformId: platformOptions[0]?.id ?? "",
		platformPlanId: planOptions[0]?.id ?? "",
		modelId: modelOptions[0]?.id ?? "",
		creditsPerGen: "",
		priceUsd: "",
		resolution: "",
		notes: "",
	});
	const filteredPlans = useMemo(
		() =>
			planOptions.filter((plan) =>
				platformForm.platformId ? plan.platformId === platformForm.platformId : true,
			),
		[planOptions, platformForm.platformId],
	);
	const [status, setStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isSubmittingApi, setIsSubmittingApi] = useState(false);
	const [isSubmittingPlatform, setIsSubmittingPlatform] = useState(false);

	async function handleApiSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmittingApi(true);
		setStatus(null);
		setError(null);
		try {
			await createAdminApiPricing({ data: apiForm });
			setApiForm({
				modelId: modelOptions[0]?.id ?? "",
				priceType: "per_image",
				resolution: "",
				priceUsd: "",
				sourceUrl: "",
				audioIncluded: false,
			});
			setStatus("API pricing row created.");
			await router.invalidate();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create API pricing.");
		} finally {
			setIsSubmittingApi(false);
		}
	}

	async function handlePlatformSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmittingPlatform(true);
		setStatus(null);
		setError(null);
		try {
			await createAdminPlatformPricing({ data: platformForm });
			setPlatformForm({
				platformId: platformOptions[0]?.id ?? "",
				platformPlanId: planOptions[0]?.id ?? "",
				modelId: modelOptions[0]?.id ?? "",
				creditsPerGen: "",
				priceUsd: "",
				resolution: "",
				notes: "",
			});
			setStatus("Platform pricing row created.");
			await router.invalidate();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to create platform pricing.",
			);
		} finally {
			setIsSubmittingPlatform(false);
		}
	}

	return (
		<AdminShell
			title="Pricing"
			description="Pricing is split into raw API pricing and platform-specific pricing. This section should become the main manual entry surface before any crawler automation goes live."
		>
			<AdminPageSection
				title="Live API pricing rows"
				description="Current direct model pricing records from the live database."
			>
				<div className="overflow-hidden rounded-lg border border-white/10">
					<div className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr] border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground">
						<span>Model</span>
						<span>Price type</span>
						<span>Resolution</span>
						<span>Price</span>
					</div>
					{apiPricing.length === 0 ? (
						<div className="px-4 py-6 text-sm text-muted-foreground">
							No API pricing rows found in the database yet.
						</div>
					) : (
						<div className="divide-y divide-white/10">
							{apiPricing.map((row) => (
								<div
									key={row.id}
									className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr] items-center gap-4 px-4 py-3 text-sm"
								>
									<p className="truncate font-medium text-foreground">
										{row.modelName}
									</p>
									<p className="truncate text-muted-foreground">
										{row.priceType}
									</p>
									<p className="truncate text-muted-foreground">
										{row.resolution ?? "—"}
									</p>
									<p className="truncate text-muted-foreground">
										${row.priceUsd}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</AdminPageSection>

			<AdminPageSection
				title="Live platform pricing rows"
				description="Current plan-specific pricing records from the live database."
			>
				<div className="overflow-hidden rounded-lg border border-white/10">
					<div className="grid grid-cols-[1fr_1fr_1fr_0.8fr] border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground">
						<span>Platform / Plan</span>
						<span>Model</span>
						<span>Resolution</span>
						<span>Price</span>
					</div>
					{platformPricing.length === 0 ? (
						<div className="px-4 py-6 text-sm text-muted-foreground">
							No platform pricing rows found in the database yet.
						</div>
					) : (
						<div className="divide-y divide-white/10">
							{platformPricing.map((row) => (
								<div
									key={row.id}
									className="grid grid-cols-[1fr_1fr_1fr_0.8fr] items-center gap-4 px-4 py-3 text-sm"
								>
									<div className="min-w-0">
										<p className="truncate font-medium text-foreground">
											{row.platformName}
										</p>
										<p className="truncate text-xs text-muted-foreground">
											{row.planName}
										</p>
									</div>
									<p className="truncate text-muted-foreground">
										{row.modelName}
									</p>
									<p className="truncate text-muted-foreground">
										{row.resolution ?? "—"}
									</p>
									<p className="truncate text-muted-foreground">
										{row.priceUsd ? `$${row.priceUsd}` : "—"}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</AdminPageSection>

			<AdminPageSection
				title="Pricing history"
				description="This will become more valuable once edits and crawler imports start logging changes."
			>
				<div className="overflow-hidden rounded-lg border border-white/10">
					<div className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr] border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground">
						<span>Table</span>
						<span>Field</span>
						<span>Old value</span>
						<span>New value</span>
					</div>
					{pricingHistory.length === 0 ? (
						<div className="px-4 py-6 text-sm text-muted-foreground">
							No pricing history rows found yet.
						</div>
					) : (
						<div className="divide-y divide-white/10">
							{pricingHistory.map((row) => (
								<div
									key={row.id}
									className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr] items-center gap-4 px-4 py-3 text-sm"
								>
									<p className="truncate font-medium text-foreground">
										{row.tableName}
									</p>
									<p className="truncate text-muted-foreground">
										{row.fieldName}
									</p>
									<p className="truncate text-muted-foreground">
										{row.oldValue ?? "—"}
									</p>
									<p className="truncate text-muted-foreground">
										{row.newValue ?? "—"}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</AdminPageSection>

			<AdminPageSection
				title="API pricing"
				description="Manual entry surface for direct model pricing."
				actionLabel="Add API price"
			>
				<form className="grid gap-4 md:grid-cols-2" onSubmit={handleApiSubmit}>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Model</label>
						<AdminSelect value={apiForm.modelId} onChange={(e) => setApiForm((c) => ({ ...c, modelId: e.target.value }))}>
							<option value="">Select model</option>
							{modelOptions.map((model) => (
								<option key={model.id} value={model.id}>{model.name}</option>
							))}
						</AdminSelect>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">
							Price type
						</label>
						<AdminSelect value={apiForm.priceType} onChange={(e) => setApiForm((c) => ({ ...c, priceType: e.target.value as typeof c.priceType }))}>
							<option value="per_image">per_image</option>
							<option value="per_second">per_second</option>
							<option value="per_1m_tokens">per_1m_tokens</option>
						</AdminSelect>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">
							Resolution
						</label>
						<Input value={apiForm.resolution} onChange={(e) => setApiForm((c) => ({ ...c, resolution: e.target.value }))} placeholder="1080p / 4K / standard" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">
							Price (USD)
						</label>
						<Input value={apiForm.priceUsd} onChange={(e) => setApiForm((c) => ({ ...c, priceUsd: e.target.value }))} placeholder="0.0400" />
					</div>
					<div className="space-y-2 md:col-span-2">
						<label className="text-sm font-medium text-foreground">
							Source URL
						</label>
						<Input value={apiForm.sourceUrl} onChange={(e) => setApiForm((c) => ({ ...c, sourceUrl: e.target.value }))} placeholder="Direct pricing source" />
					</div>
					<div className="md:col-span-2 flex items-center gap-2">
						<input id="audioIncluded" type="checkbox" checked={apiForm.audioIncluded} onChange={(e) => setApiForm((c) => ({ ...c, audioIncluded: e.target.checked }))} />
						<label htmlFor="audioIncluded" className="text-sm text-muted-foreground">Audio included</label>
					</div>
					<div className="md:col-span-2 flex items-center gap-3">
						<Button type="submit" disabled={isSubmittingApi}>
							{isSubmittingApi ? "Creating..." : "Create API price"}
						</Button>
						{status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
						{error ? <p className="text-sm text-destructive">{error}</p> : null}
					</div>
				</form>
			</AdminPageSection>

			<AdminPageSection
				title="Platform pricing"
				description="Manual entry surface for normalized plan-specific pricing."
				actionLabel="Add platform price"
			>
				<form className="grid gap-4 md:grid-cols-2" onSubmit={handlePlatformSubmit}>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">
							Platform
						</label>
						<AdminSelect value={platformForm.platformId} onChange={(e) => setPlatformForm((c) => ({ ...c, platformId: e.target.value, platformPlanId: filteredPlans[0]?.id ?? "" }))}>
							<option value="">Select platform</option>
							{platformOptions.map((platform) => (
								<option key={platform.id} value={platform.id}>{platform.name}</option>
							))}
						</AdminSelect>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Plan</label>
						<AdminSelect value={platformForm.platformPlanId} onChange={(e) => setPlatformForm((c) => ({ ...c, platformPlanId: e.target.value }))}>
							<option value="">Select plan</option>
							{filteredPlans.map((plan) => (
								<option key={plan.id} value={plan.id}>{plan.platformName} · {plan.name}</option>
							))}
						</AdminSelect>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Model</label>
						<AdminSelect value={platformForm.modelId} onChange={(e) => setPlatformForm((c) => ({ ...c, modelId: e.target.value }))}>
							<option value="">Select model</option>
							{modelOptions.map((model) => (
								<option key={model.id} value={model.id}>{model.name}</option>
							))}
						</AdminSelect>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">
							Credits per generation
						</label>
						<Input value={platformForm.creditsPerGen} onChange={(e) => setPlatformForm((c) => ({ ...c, creditsPerGen: e.target.value }))} placeholder="150" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">
							Normalized price (USD)
						</label>
						<Input value={platformForm.priceUsd} onChange={(e) => setPlatformForm((c) => ({ ...c, priceUsd: e.target.value }))} placeholder="1.2500" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">
							Resolution or unit
						</label>
						<Input value={platformForm.resolution} onChange={(e) => setPlatformForm((c) => ({ ...c, resolution: e.target.value }))} placeholder="5 sec · 1080p" />
					</div>
					<div className="space-y-2 md:col-span-2">
						<label className="text-sm font-medium text-foreground">Notes</label>
						<Textarea value={platformForm.notes} onChange={(e) => setPlatformForm((c) => ({ ...c, notes: e.target.value }))} placeholder="Plan restrictions, audio included, Pro plan only, etc." />
					</div>
					<div className="md:col-span-2 flex items-center gap-3">
						<Button type="submit" disabled={isSubmittingPlatform}>
							{isSubmittingPlatform ? "Creating..." : "Create platform price"}
						</Button>
					</div>
				</form>
			</AdminPageSection>
		</AdminShell>
	);
}
