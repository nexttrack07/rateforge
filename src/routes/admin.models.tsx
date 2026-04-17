import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AdminPageSection } from "@/components/admin/AdminPageSection";
import { AdminSelect } from "@/components/admin/AdminSelect";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createAdminModel, getAdminModels } from "@/lib/admin/queries";

export const Route = createFileRoute("/admin/models")({
	loader: () => getAdminModels(),
	component: AdminModelsPage,
});

function AdminModelsPage() {
	const { models: modelRows, providers: providerRows } = Route.useLoaderData();
	const router = useRouter();
	const [form, setForm] = useState({
		name: "",
		slug: "",
		type: "image" as "image" | "video" | "text",
		providerId: providerRows[0]?.id ?? "",
		description: "",
	});
	const [status, setStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);
		setStatus(null);
		setError(null);

		try {
			await createAdminModel({ data: form });
			setForm({
				name: "",
				slug: "",
				type: "image",
				providerId: providerRows[0]?.id ?? "",
				description: "",
			});
			setStatus("Model created.");
			await router.invalidate();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create model.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<AdminShell
			title="Models"
			description="Models are the main objects that the comparison engine revolves around. This page will manage metadata, type, provider relation, and active status."
		>
			<AdminPageSection
				title="Model table"
				description="Current model records from the live database."
				actionLabel="Add model"
			>
				<div className="overflow-hidden rounded-lg border border-white/10">
					<div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr] border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground">
						<span>Name</span>
						<span>Provider</span>
						<span>Type</span>
						<span>Status</span>
					</div>
					{modelRows.length === 0 ? (
						<div className="px-4 py-6 text-sm text-muted-foreground">
							No models found in the database yet.
						</div>
					) : (
						<div className="divide-y divide-white/10">
							{modelRows.map((model) => (
								<div
									key={model.id}
									className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr] items-center gap-4 px-4 py-3 text-sm"
								>
									<div className="min-w-0">
										<p className="truncate font-medium text-foreground">
											{model.name}
										</p>
										<p className="mt-1 truncate text-xs text-muted-foreground">
											{model.slug}
										</p>
									</div>
									<p className="truncate text-muted-foreground">
										{model.providerName}
									</p>
									<p className="truncate text-muted-foreground capitalize">
										{model.type}
									</p>
									<p className="truncate text-muted-foreground">
										{model.isActive ? "Active" : "Inactive"}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</AdminPageSection>

			<AdminPageSection
				title="Model form"
				description="Create a new model record."
			>
				<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">
							Model name
						</label>
						<Input value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} placeholder="Kling 3.0" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Slug</label>
						<Input value={form.slug} onChange={(e) => setForm((c) => ({ ...c, slug: e.target.value }))} placeholder="kling-3-0" />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">
							Provider
						</label>
						<AdminSelect
							value={form.providerId}
							onChange={(event) =>
								setForm((current) => ({
									...current,
									providerId: event.target.value,
								}))
							}
						>
							<option value="">Select provider</option>
							{providerRows.map((provider) => (
								<option key={provider.id} value={provider.id}>
									{provider.name}
								</option>
							))}
						</AdminSelect>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Type</label>
						<AdminSelect
							value={form.type}
							onChange={(event) =>
								setForm((current) => ({
									...current,
									type: event.target.value as "image" | "video" | "text",
								}))
							}
						>
							<option value="image">image</option>
							<option value="video">video</option>
							<option value="text">text</option>
						</AdminSelect>
					</div>
					<div className="space-y-2 md:col-span-2">
						<label className="text-sm font-medium text-foreground">
							Description
						</label>
						<Textarea
							value={form.description}
							onChange={(event) =>
								setForm((current) => ({
									...current,
									description: event.target.value,
								}))
							}
							placeholder="Short editorial description used across the public site."
						/>
					</div>
					<div className="md:col-span-2 flex items-center gap-3">
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Creating..." : "Create model"}
						</Button>
						{status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
						{error ? <p className="text-sm text-destructive">{error}</p> : null}
					</div>
				</form>
			</AdminPageSection>
		</AdminShell>
	);
}
