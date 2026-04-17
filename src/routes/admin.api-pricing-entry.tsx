import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AdminPageSection } from "@/components/admin/AdminPageSection";
import { AdminSelect } from "@/components/admin/AdminSelect";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAdminApiPricing, getAdminPricing } from "@/lib/admin/queries";

type DraftRow = {
	id: string;
	modelId: string;
	priceType: "per_second" | "per_image" | "per_1m_tokens";
	resolution: string;
	priceUsd: string;
	sourceUrl: string;
	audioIncluded: boolean;
};

export const Route = createFileRoute("/admin/api-pricing-entry")({
	loader: () => getAdminPricing(),
	component: AdminApiPricingEntryPage,
});

function AdminApiPricingEntryPage() {
	const { apiPricing, modelOptions } = Route.useLoaderData();
	const router = useRouter();
	const [draftRows, setDraftRows] = useState<DraftRow[]>([
		createDraftRow(modelOptions[0]?.id ?? ""),
	]);
	const [status, setStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

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
			for (const row of draftRows) {
				if (!row.modelId || !row.priceUsd.trim()) {
					throw new Error("Each API pricing row needs a model and a price.");
				}

				await createAdminApiPricing({
					data: {
						modelId: row.modelId,
						priceType: row.priceType,
						resolution: row.resolution,
						priceUsd: row.priceUsd,
						sourceUrl: row.sourceUrl,
						audioIncluded: row.audioIncluded,
					},
				});
			}

			setDraftRows([createDraftRow(modelOptions[0]?.id ?? "")]);
			setStatus(`Saved ${draftRows.length} API pricing row${draftRows.length === 1 ? "" : "s"}.`);
			await router.invalidate();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to save API pricing rows.",
			);
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<AdminShell
			title="API Pricing Entry"
			description="Use this screen for fast direct model pricing entry. Add multiple API pricing rows, then save them together."
		>
			<AdminPageSection
				title="Existing API pricing rows"
				description="Current direct model pricing rows already saved in the database."
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
							No API pricing rows saved yet.
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
				title="Batch entry"
				description="Add multiple API pricing rows quickly, then save them together."
			>
				<div className="space-y-4">
					{draftRows.map((row) => (
						<div
							key={row.id}
							className="grid gap-4 rounded-lg border border-white/10 p-4 md:grid-cols-[1fr_0.8fr_0.8fr_0.8fr_auto]"
						>
							<div className="space-y-2">
								<label className="text-sm font-medium text-foreground">Model</label>
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
									Price type
								</label>
								<AdminSelect
									value={row.priceType}
									onChange={(event) =>
										updateDraftRow(row.id, {
											priceType: event.target.value as DraftRow["priceType"],
										})
									}
								>
									<option value="per_image">per_image</option>
									<option value="per_second">per_second</option>
									<option value="per_1m_tokens">per_1m_tokens</option>
								</AdminSelect>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-foreground">
									Resolution
								</label>
								<Input
									value={row.resolution}
									onChange={(event) =>
										updateDraftRow(row.id, { resolution: event.target.value })
									}
									placeholder="1080p / standard"
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
									placeholder="0.0400"
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
							<div className="space-y-2 md:col-span-3">
								<label className="text-sm font-medium text-foreground">
									Source URL
								</label>
								<Input
									value={row.sourceUrl}
									onChange={(event) =>
										updateDraftRow(row.id, { sourceUrl: event.target.value })
									}
									placeholder="Direct pricing source"
								/>
							</div>
							<div className="flex items-end md:col-span-2">
								<label className="flex items-center gap-2 text-sm text-muted-foreground">
									<input
										type="checkbox"
										checked={row.audioIncluded}
										onChange={(event) =>
											updateDraftRow(row.id, {
												audioIncluded: event.target.checked,
											})
										}
									/>
									Audio included for this row
								</label>
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
		priceType: "per_image",
		resolution: "",
		priceUsd: "",
		sourceUrl: "",
		audioIncluded: false,
	};
}
