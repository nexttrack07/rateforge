import { useState, useMemo } from "react";
import { Zap, CreditCard } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select } from "@/components/ui/select";
import {
	CalculatorShell,
	CalculatorSection,
	CalculatorGrid,
	CalculatorDivider,
} from "./CalculatorShell";
import { ResultsCard } from "./ResultsCard";
import { CostBar, BreakEvenChart } from "./CostBar";

const platforms = [
	{
		id: "higgsfield",
		name: "Higgsfield",
		plans: [
			{ id: "creator", name: "Creator", price: 29, included: 100, overage: 0.25 },
			{ id: "pro", name: "Pro", price: 79, included: 400, overage: 0.18 },
			{ id: "ultimate", name: "Ultimate", price: 199, included: 1500, overage: 0.12 },
		],
		apiEquivalent: { name: "Kling API (Replicate)", pricePerUnit: 0.28, unit: "5s clip" },
	},
	{
		id: "runway",
		name: "Runway",
		plans: [
			{ id: "standard", name: "Standard", price: 15, included: 125, overage: 0.10 },
			{ id: "pro", name: "Pro", price: 35, included: 450, overage: 0.08 },
			{ id: "unlimited", name: "Unlimited", price: 95, included: 2000, overage: 0.05 },
		],
		apiEquivalent: { name: "Veo API (Replicate)", pricePerUnit: 0.55, unit: "second" },
	},
	{
		id: "openart",
		name: "OpenArt",
		plans: [
			{ id: "starter", name: "Starter", price: 12, included: 100, overage: 0.12 },
			{ id: "pro", name: "Pro", price: 36, included: 400, overage: 0.08 },
			{ id: "elite", name: "Elite", price: 80, included: 1200, overage: 0.06 },
		],
		apiEquivalent: { name: "GPT Image API", pricePerUnit: 0.11, unit: "image" },
	},
];

export function ApiVsPlatformCalculator() {
	const [platformId, setPlatformId] = useState("higgsfield");
	const [planId, setPlanId] = useState("pro");
	const [unitsPerMonth, setUnitsPerMonth] = useState(200);

	const platform = platforms.find((p) => p.id === platformId);
	const plan = platform?.plans.find((p) => p.id === planId);

	// Calculate costs
	const costs = useMemo(() => {
		if (!platform || !plan) {
			return { apiCost: 0, subscriptionCost: 0, savings: 0, winner: "tie" as const };
		}

		const apiCost = unitsPerMonth * platform.apiEquivalent.pricePerUnit;

		const overage = Math.max(0, unitsPerMonth - plan.included);
		const subscriptionCost = plan.price + overage * plan.overage;

		const savings = Math.abs(apiCost - subscriptionCost);
		const winner =
			apiCost < subscriptionCost
				? ("api" as const)
				: apiCost > subscriptionCost
					? ("subscription" as const)
					: ("tie" as const);

		return { apiCost, subscriptionCost, savings, winner };
	}, [platform, plan, unitsPerMonth]);

	// Update plan when platform changes
	const handlePlatformChange = (newPlatformId: string) => {
		setPlatformId(newPlatformId);
		const newPlatform = platforms.find((p) => p.id === newPlatformId);
		if (newPlatform && newPlatform.plans.length > 0) {
			setPlanId(newPlatform.plans[0].id);
		}
	};

	const handleShare = () => {
		const params = new URLSearchParams({
			platform: platformId,
			plan: planId,
			units: unitsPerMonth.toString(),
		});
		const url = `${window.location.origin}/tools?calc=api-vs-platform&${params.toString()}`;
		navigator.clipboard.writeText(url);
	};

	return (
		<CalculatorShell
			title="API vs Platform Calculator"
			description="Find the break-even point where subscriptions beat pay-per-use"
			onShare={handleShare}
		>
			<CalculatorGrid>
				{/* Inputs */}
				<div className="space-y-8">
					<CalculatorSection title="Platform & Plan">
						<Select
							label="Platform"
							value={platformId}
							onChange={handlePlatformChange}
							options={platforms.map((p) => ({
								value: p.id,
								label: p.name,
							}))}
						/>

						{platform && (
							<Select
								label="Subscription plan"
								value={planId}
								onChange={setPlanId}
								options={platform.plans.map((p) => ({
									value: p.id,
									label: `${p.name} ($${p.price}/mo, ${p.included} included)`,
								}))}
							/>
						)}
					</CalculatorSection>

					<CalculatorSection title="Usage">
						<Slider
							label={`${platform?.apiEquivalent.unit ?? "Units"} per month`}
							value={unitsPerMonth}
							onChange={setUnitsPerMonth}
							min={0}
							max={2000}
							step={10}
						/>

						{plan && (
							<div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<div className="text-muted-foreground">Included in plan</div>
										<div className="font-semibold text-foreground">
											{plan.included} {platform?.apiEquivalent.unit}s
										</div>
									</div>
									<div>
										<div className="text-muted-foreground">Overage rate</div>
										<div className="font-semibold text-foreground">
											${plan.overage}/{platform?.apiEquivalent.unit}
										</div>
									</div>
									<div>
										<div className="text-muted-foreground">API rate</div>
										<div className="font-semibold text-foreground">
											${platform?.apiEquivalent.pricePerUnit}/{platform?.apiEquivalent.unit}
										</div>
									</div>
									<div>
										<div className="text-muted-foreground">Your usage</div>
										<div className="font-semibold text-foreground">
											{unitsPerMonth} {platform?.apiEquivalent.unit}s
										</div>
									</div>
								</div>
							</div>
						)}
					</CalculatorSection>
				</div>

				<CalculatorDivider />

				{/* Results */}
				<div className="space-y-6">
					{/* Comparison Cards */}
					<div className="grid gap-4 sm:grid-cols-2">
						<ResultsCard
							title="API Cost"
							value={`$${costs.apiCost.toFixed(2)}`}
							subtitle={`${platform?.apiEquivalent.name}`}
							highlight={costs.winner === "api" ? "best" : "default"}
						/>
						<ResultsCard
							title="Subscription Cost"
							value={`$${costs.subscriptionCost.toFixed(2)}`}
							subtitle={`${platform?.name} ${plan?.name}`}
							highlight={costs.winner === "subscription" ? "best" : "default"}
						/>
					</div>

					{/* Verdict */}
					<div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 text-center">
						{costs.winner === "api" ? (
							<>
								<div className="flex items-center justify-center gap-2 text-primary">
									<Zap size={20} />
									<span className="font-semibold">API is cheaper</span>
								</div>
								<div className="mt-2 text-2xl font-bold text-foreground">
									Save ${costs.savings.toFixed(2)}/month
								</div>
								<div className="mt-1 text-sm text-muted-foreground">
									with pay-per-use pricing
								</div>
							</>
						) : costs.winner === "subscription" ? (
							<>
								<div className="flex items-center justify-center gap-2 text-emerald-400">
									<CreditCard size={20} />
									<span className="font-semibold">Subscription is cheaper</span>
								</div>
								<div className="mt-2 text-2xl font-bold text-foreground">
									Save ${costs.savings.toFixed(2)}/month
								</div>
								<div className="mt-1 text-sm text-muted-foreground">
									with {platform?.name} {plan?.name}
								</div>
							</>
						) : (
							<>
								<div className="font-semibold text-muted-foreground">
									Both options cost the same
								</div>
								<div className="mt-2 text-2xl font-bold text-foreground">
									${costs.apiCost.toFixed(2)}/month
								</div>
							</>
						)}
					</div>

					{/* Cost comparison bars */}
					<CalculatorSection title="Cost Comparison">
						<CostBar
							items={[
								{
									id: "api",
									label: `API (${platform?.apiEquivalent.name})`,
									value: costs.apiCost,
									color: costs.winner === "api" ? "success" : "muted",
								},
								{
									id: "subscription",
									label: `Subscription (${plan?.name})`,
									value: costs.subscriptionCost,
									color: costs.winner === "subscription" ? "success" : "muted",
								},
							]}
						/>
					</CalculatorSection>

					{/* Break-even Chart */}
					{platform && plan && (
						<CalculatorSection title="Break-Even Analysis">
							<BreakEvenChart
								apiCostPerUnit={platform.apiEquivalent.pricePerUnit}
								subscriptionCost={plan.price}
								includedUnits={plan.included}
								overageCost={plan.overage}
								maxUnits={Math.max(500, unitsPerMonth * 2)}
								unitLabel={`${platform.apiEquivalent.unit}s`}
							/>
						</CalculatorSection>
					)}
				</div>
			</CalculatorGrid>
		</CalculatorShell>
	);
}
