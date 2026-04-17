import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: AboutPage,
});

function AboutPage() {
	return (
		<div className="space-y-4">
			<h1 className="text-3xl font-bold tracking-tight">About Rateforge</h1>
			<p className="max-w-3xl text-muted-foreground">
				Rateforge is a public pricing comparison product for AI generation
				models and platforms. It is intended to help creators understand actual
				costs, not just nominal credits or marketing plans.
			</p>
		</div>
	);
}
