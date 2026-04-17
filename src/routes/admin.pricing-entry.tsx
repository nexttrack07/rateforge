import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminPageSection } from "@/components/admin/AdminPageSection";
import { AdminSelect } from "@/components/admin/AdminSelect";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createAdminPlatformPricing, getAdminPricing } from "@/lib/admin/queries";

type DraftRow = {
	id: string;
	modelId: string;
	creditsPerGen: string;
	priceUsd: string;
	resolution: string;
	notes: string;
};

export const Route = createFileRoute("/admin/pricing-entry")({
	loader: () => getAdminPricing(),
	component: AdminPricingEntryPage,
});

function AdminPricingEntryPage() {
	const { platformPricing, modelOptions, platformOptions, planOptions } =
		Route.useLoaderData();
	const router = useRouter();

	const [platformId, setPlatformId] = useState(platformOptions[0]?.id ?? "");
	const filteredPlans = useMemo(
		() =>
			planOptions.filter((plan) =>
				platformId ? plan.platformId === platformId : true,
			),
		[planOptions, platformId],
	);
	const [platformPlanId, setPlatformPlanId] = useState(
		filteredPlans[0]?.id ?? planOptions[0]?.id ?? "",
	);
	const [draftRows, setDraftRows] = useState<DraftRow[]>([
		createDraftRow(modelOptions[0]?.id ?? ""),
	]);
	const [status, setStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	const existingRows = useMemo(
		() =>
			platformPricing.filter(
				(row) =>
					row.platformId === platformId && row.platformPlanId === platformPlanId,
			),
		[platformId, platformPlanId, platformPricing],
	);

	function updateDraftRow(id: string, patch: Partial<DraftRow>) {
		setDraftRows((current) =>
			current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
		);
	}

	function addDraftRow() {
		setDraftRows((current) => [...current, createDraftRow(modelOptions[0]?.id ?? "")]);
	}

	function removeDraftRow(id: string) {
		setDraftRows((current) =>
			current.length === 1 ? current : current.filter((row) => row.id !== id),
		);
	}

	async function handleSaveAll() {
		setIsSaving(true);
		setStatus(null);
		setError(null);

		try {
			if (!platformId || !platformPlanId) {
				throw new Error("Select a platform and plan first.");
			}

			for (const row of draftRows) {
				if (!row.modelId) {
					throw new Error("Each draft row requires a model.");
				}

				await createAdminPlatformPricing({
					data: {
						platformId,
						platformPlanId,
						modelId: row.modelId,
						creditsPerGen: row.creditsPerGen,
						priceUsd: row.priceUsd,
						resolution: row.resolution,
						notes: row.notes,
					},
				});
			}

			setDraftRows([createDraftRow(modelOptions[0]?.id ?? "")]);
			setStatus(`Saved ${draftRows.length} pricing row${draftRows.length === 1 ? "" : "s"}.`);
			await router.invalidate();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to save pricing rows.",
			);
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<AdminShell
			title="Pricing Entry"
			description="Use this as the main workflow for rapid platform pricing entry. Pick a platform and plan, review what already exists, then add multiple rows in one pass."
		>
			<AdminPageSection
				title="Entry context"
				description="Choose the platform and plan you are currently populating."
			>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Platform</label>
						<AdminSelect
							value={platformId}
							onChange={(event) => {
								const nextPlatformId = event.target.value;
								const nextPlans = planOptions.filter(
									(plan) => plan.platformId === nextPlatformId,
								);
								setPlatformId(nextPlatformId);
								setPlatformPlanId(nextPlans[0]?.id ?? "");
							}}
						>
							<option value="">Select platform</option>
							{platformOptions.map((platform) => (
								<option key={platform.id} value={platform.id}>
									{platform.name}
								</option>
							))}
						</AdminSelect>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Plan</label>
						<AdminSelect
							value={platformPlanId}
							onChange={(event) => setPlatformPlanId(event.target.value)}
						>
							<option value="">Select plan</option>
							{filteredPlans.map((plan) => (
								<option key={plan.id} value={plan.id}>
									{plan.platformName} · {plan.name}
								</option>
							))}
						</AdminSelect>
					</div>
				</div>
			</AdminPageSection>

			<AdminPageSection
				title="Existing rows"
				description="Review the rows already saved for this platform plan before adding more."
			>
				<div className="overflow-hidden rounded-lg border border-white/10">
					<div className="grid grid-cols-[1fr_0.7fr_0.7fr_0.9fr] border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground">
						<span>Model</span>
						<span>Credits</span>
						<span>Price</span>
						<span>Resolution / unit</span>
					</div>
					{existingRows.length === 0 ? (
						<div className="px-4 py-6 text-sm text-muted-foreground">
							No saved rows yet for this plan.
						</div>
					) : (
						<div className="divide-y divide-white/10">
							{existingRows.map((row) => (
								<div
									key={row.id}
									className="grid grid-cols-[1fr_0.7fr_0.7fr_0.9fr] items-center gap-4 px-4 py-3 text-sm"
								>
									<p className="truncate font-medium text-foreground">
										{row.modelName}
									</p>
									<p className="truncate text-muted-foreground">
										{row.creditsPerGen ?? "—"}
									</p>
									<p className="truncate text-muted-foreground">
										{row.priceUsd ? `$${row.priceUsd}` : "—"}
									</p>
									<p className="truncate text-muted-foreground">
										{row.resolution ?? "—"}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</AdminPageSection>

			<AdminPageSection
				title="Batch entry"
				description="Add several pricing rows quickly, then save them together."
			>
				<div className="space-y-4">
					{draftRows.map((row, index) => (
						<div
							key={row.id}
							className="grid gap-4 rounded-lg border border-white/10 p-4 md:grid-cols-[1.1fr_0.7fr_0.7fr_0.9fr_auto]"
						>
							<div className="space-y-2">
								<label className="text-sm font-medium text-foreground">
									Model
								</label>
								<AdminSelect
									value={row.modelId}
									onChange={(event) =>
										updateDraftRow(row.id, { modelId: event.target.value })
									}
								>
									<option value="">Select model</option>
									{modelOptions.map((model) => (
										<option key={model.id} value={model.id}>
											{model.name}
										</option>
									))}
								</AdminSelect>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-foreground">
									Credits
								</label>
								<Input
									value={row.creditsPerGen}
									onChange={(event) =>
										updateDraftRow(row.id, {
											creditsPerGen: event.target.value,
										})
									}
									placeholder="150"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-foreground">
									Price (USD)
								</label>
								<Input
									value={row.priceUsd}
									onChange={(event) =>
										updateDraftRow(row.id, { priceUsd: event.target.value })
									}
									placeholder="1.2500"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-foreground">
									Resolution / unit
								</label>
								<Input
									value={row.resolution}
									onChange={(event) =>
										updateDraftRow(row.id, { resolution: event.target.value })
									}
									placeholder="5 sec · 1080p"
								/>
							</div>
							<div className="flex items-end">
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => removeDraftRow(row.id)}
									disabled={draftRows.length === 1}
								>
									Remove
								</Button>
							</div>
							<div className="space-y-2 md:col-span-5">
								<label className="text-sm font-medium text-foreground">
									Notes
								</label>
								<Textarea
									value={row.notes}
									onChange={(event) =>
										updateDraftRow(row.id, { notes: event.target.value })
									}
									placeholder={`Optional notes for row ${index + 1}`}
								/>
							</div>
						</div>
					))}

					<div className="flex flex-wrap items-center gap-3">
						<Button type="button" variant="outline" onClick={addDraftRow}>
							Add row
						</Button>
						<Button type="button" onClick={handleSaveAll} disabled={isSaving}>
							{isSaving ? "Saving..." : "Save all rows"}
						</Button>
						{status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
						{error ? <p className="text-sm text-destructive">{error}</p> : null}
					</div>
				</div>
			</AdminPageSection>
		</AdminShell>
	);
}

function createDraftRow(modelId: string): DraftRow {
	return {
		id: crypto.randomUUID(),
		modelId,
		creditsPerGen: "",
		priceUsd: "",
		resolution: "",
		notes: "",
	};
}
