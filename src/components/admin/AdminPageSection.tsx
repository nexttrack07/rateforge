import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminPageSection({
	title,
	description,
	actionLabel,
	children,
}: {
	title: string;
	description: string;
	actionLabel?: string;
	children: React.ReactNode;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-start justify-between gap-4">
				<div className="space-y-1.5">
					<CardTitle className="text-base">{title}</CardTitle>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>
				{actionLabel ? (
					<Button type="button" size="sm" variant="outline">
						{actionLabel}
					</Button>
				) : null}
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}
