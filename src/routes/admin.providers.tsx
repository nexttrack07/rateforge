import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AdminPageSection } from "@/components/admin/AdminPageSection";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createAdminProvider, getAdminProviders } from "@/lib/admin/queries";

export const Route = createFileRoute("/admin/providers")({
	loader: () => getAdminProviders(),
	component: AdminProvidersPage,
});

function AdminProvidersPage() {
	const providerRows = Route.useLoaderData();
	const router = useRouter();
	const [form, setForm] = useState({
		name: "",
		slug: "",
		website: "",
		logoUrl: "",
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
			await createAdminProvider({ data: form });
			setForm({ name: "", slug: "", website: "", logoUrl: "" });
			setStatus("Provider created.");
			await router.invalidate();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create provider.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<AdminShell
			title="Providers"
			description="Providers are the source organizations behind the models. This page will eventually manage provider metadata and relationships to models."
		>
			<AdminPageSection
				title="Provider table"
				description="Current provider records from the live database."
				actionLabel="Add provider"
			>
				<div className="overflow-hidden rounded-lg border border-white/10">
					<div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground">
						<span>Name</span>
						<span>Slug</span>
						<span>Website</span>
					</div>
					{providerRows.length === 0 ? (
						<div className="px-4 py-6 text-sm text-muted-foreground">
							No providers found in the database yet.
						</div>
					) : (
						<div className="divide-y divide-white/10">
							{providerRows.map((provider) => (
								<div
									key={provider.id}
									className="grid grid-cols-[1.2fr_1fr_1fr] items-center gap-4 px-4 py-3 text-sm"
								>
									<div className="min-w-0">
										<p className="truncate font-medium text-foreground">
											{provider.name}
										</p>
										{provider.logoUrl ? (
											<p className="mt-1 truncate text-xs text-muted-foreground">
												{provider.logoUrl}
											</p>
										) : null}
									</div>
									<p className="truncate text-muted-foreground">
										{provider.slug}
									</p>
									<p className="truncate text-muted-foreground">
										{provider.website ?? "—"}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</AdminPageSection>

			<AdminPageSection
				title="Provider form"
				description="Create a new provider record."
			>
				<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">
							Provider name
						</label>
						<Input
							placeholder="OpenAI"
							value={form.name}
							onChange={(event) =>
								setForm((current) => ({ ...current, name: event.target.value }))
							}
						/>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Slug</label>
						<Input
							placeholder="openai"
							value={form.slug}
							onChange={(event) =>
								setForm((current) => ({ ...current, slug: event.target.value }))
							}
						/>
					</div>
					<div className="space-y-2 md:col-span-2">
						<label className="text-sm font-medium text-foreground">
							Website
						</label>
						<Input
							placeholder="https://openai.com"
							value={form.website}
							onChange={(event) =>
								setForm((current) => ({ ...current, website: event.target.value }))
							}
						/>
					</div>
					<div className="space-y-2 md:col-span-2">
						<label className="text-sm font-medium text-foreground">
							Logo URL
						</label>
						<Input
							placeholder="https://..."
							value={form.logoUrl}
							onChange={(event) =>
								setForm((current) => ({ ...current, logoUrl: event.target.value }))
							}
						/>
					</div>
					<div className="space-y-2 md:col-span-2">
						<label className="text-sm font-medium text-foreground">
							Internal notes
						</label>
						<Textarea
							placeholder="Optional context for internal admin use."
							disabled
						/>
					</div>
					<div className="md:col-span-2 flex items-center gap-3">
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Creating..." : "Create provider"}
						</Button>
						{status ? (
							<p className="text-sm text-muted-foreground">{status}</p>
						) : null}
						{error ? <p className="text-sm text-destructive">{error}</p> : null}
					</div>
				</form>
			</AdminPageSection>
		</AdminShell>
	);
}
