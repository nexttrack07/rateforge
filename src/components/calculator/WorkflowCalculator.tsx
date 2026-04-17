import { useState, useMemo } from "react";
import { Image, Video, Type } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select } from "@/components/ui/select";
import {
	CalculatorShell,
	CalculatorSection,
	CalculatorGrid,
	CalculatorDivider,
} from "./CalculatorShell";
import { ResultsCard, ComparisonResult } from "./ResultsCard";
import { StackedCostBar } from "./CostBar";

// Pricing data (simplified from mock-pricing)
const modelPricing = {
	image: [
		{ id: "gpt-image-api", name: "GPT Image 1.5 (API)", pricePerUnit: 0.11 },
		{ id: "nano-banana-api", name: "Nano Banana Pro (API)", pricePerUnit: 0.09 },
		{ id: "openart-pro", name: "OpenArt Pro", pricePerUnit: 0.18 },
		{ id: "freepik-premium", name: "Freepik Premium+", pricePerUnit: 0.14 },
	],
	video: [
		{ id: "kling-api", name: "Kling 3.0 (API)", pricePerUnit: 1.4, unitSeconds: 5 },
		{ id: "veo-api", name: "Veo 3.1 (API)", pricePerUnit: 4.4, unitSeconds: 8 },
		{ id: "higgsfield-kling", name: "Higgsfield Ultimate", pricePerUnit: 1.35, unitSeconds: 5 },
		{ id: "runway-veo", name: "Runway Unlimited", pricePerUnit: 3.1, unitSeconds: 8 },
	],
	text: [
		{ id: "claude-api", name: "Claude Sonnet 4.5 (API)", pricePerMTokens: 15 },
		{ id: "openrouter-claude", name: "OpenRouter Claude", pricePerMTokens: 16 },
		{ id: "gpt4-api", name: "GPT-4o (API)", pricePerMTokens: 10 },
	],
};

export function WorkflowCalculator() {
	// Image settings
	const [imagesPerMonth, setImagesPerMonth] = useState(100);
	const [imageModel, setImageModel] = useState("gpt-image-api");

	// Video settings
	const [videosPerMonth, setVideosPerMonth] = useState(20);
	const [videoModel, setVideoModel] = useState("kling-api");
	const [videoDuration, setVideoDuration] = useState(5);

	// Text settings
	const [tokensPerMonth, setTokensPerMonth] = useState(100000);
	const [textModel, setTextModel] = useState("claude-api");

	// Calculate costs
	const costs = useMemo(() => {
		const selectedImageModel = modelPricing.image.find((m) => m.id === imageModel);
		const selectedVideoModel = modelPricing.video.find((m) => m.id === videoModel);
		const selectedTextModel = modelPricing.text.find((m) => m.id === textModel);

		const imageCost = imagesPerMonth * (selectedImageModel?.pricePerUnit ?? 0);

		const videoUnitSize = selectedVideoModel?.unitSeconds ?? 5;
		const clipsNeeded = Math.ceil((videosPerMonth * videoDuration) / videoUnitSize);
		const videoCost = clipsNeeded * (selectedVideoModel?.pricePerUnit ?? 0);

		const textCost =
			(tokensPerMonth / 1_000_000) * (selectedTextModel?.pricePerMTokens ?? 0);

		const total = imageCost + videoCost + textCost;

		return { imageCost, videoCost, textCost, total };
	}, [
		imagesPerMonth,
		imageModel,
		videosPerMonth,
		videoModel,
		videoDuration,
		tokensPerMonth,
		textModel,
	]);

	// Find cheapest alternatives
	const alternatives = useMemo(() => {
		const options = [];

		// Calculate costs for different provider combinations
		for (const img of modelPricing.image) {
			for (const vid of modelPricing.video) {
				for (const txt of modelPricing.text) {
					const imgCost = imagesPerMonth * img.pricePerUnit;
					const vidClips = Math.ceil(
						(videosPerMonth * videoDuration) / (vid.unitSeconds ?? 5)
					);
					const vidCost = vidClips * vid.pricePerUnit;
					const txtCost = (tokensPerMonth / 1_000_000) * txt.pricePerMTokens;
					const total = imgCost + vidCost + txtCost;

					options.push({
						id: `${img.id}-${vid.id}-${txt.id}`,
						name: "Combined Stack",
						subtitle: `${img.name} + ${vid.name} + ${txt.name}`,
						cost: total,
						costLabel: `$${total.toFixed(2)}/mo`,
					});
				}
			}
		}

		return options.sort((a, b) => a.cost - b.cost).slice(0, 3);
	}, [imagesPerMonth, videosPerMonth, videoDuration, tokensPerMonth]);

	const handleShare = () => {
		const params = new URLSearchParams({
			images: imagesPerMonth.toString(),
			imageModel,
			videos: videosPerMonth.toString(),
			videoModel,
			videoDuration: videoDuration.toString(),
			tokens: tokensPerMonth.toString(),
			textModel,
		});
		const url = `${window.location.origin}/tools?calc=workflow&${params.toString()}`;
		navigator.clipboard.writeText(url);
	};

	return (
		<CalculatorShell
			title="Workflow Cost Calculator"
			description="Estimate monthly costs for your AI generation workflow"
			onShare={handleShare}
		>
			<CalculatorGrid>
				{/* Inputs */}
				<div className="space-y-8">
					{/* Image Section */}
					<CalculatorSection title="Image Generation">
						<div className="flex items-center gap-2 text-muted-foreground">
							<Image size={16} />
							<span className="text-sm">Configure your image generation needs</span>
						</div>
						<Slider
							label="Images per month"
							value={imagesPerMonth}
							onChange={setImagesPerMonth}
							min={0}
							max={1000}
							step={10}
						/>
						<Select
							label="Image model"
							value={imageModel}
							onChange={setImageModel}
							options={modelPricing.image.map((m) => ({
								value: m.id,
								label: `${m.name} ($${m.pricePerUnit}/img)`,
							}))}
						/>
					</CalculatorSection>

					{/* Video Section */}
					<CalculatorSection title="Video Generation">
						<div className="flex items-center gap-2 text-muted-foreground">
							<Video size={16} />
							<span className="text-sm">Configure your video generation needs</span>
						</div>
						<Slider
							label="Videos per month"
							value={videosPerMonth}
							onChange={setVideosPerMonth}
							min={0}
							max={100}
							step={1}
						/>
						<Slider
							label="Average video duration"
							value={videoDuration}
							onChange={setVideoDuration}
							min={1}
							max={30}
							step={1}
							valueLabel={(v) => `${v}s`}
						/>
						<Select
							label="Video model"
							value={videoModel}
							onChange={setVideoModel}
							options={modelPricing.video.map((m) => ({
								value: m.id,
								label: `${m.name} ($${m.pricePerUnit}/${m.unitSeconds}s)`,
							}))}
						/>
					</CalculatorSection>

					{/* Text Section */}
					<CalculatorSection title="Text Generation">
						<div className="flex items-center gap-2 text-muted-foreground">
							<Type size={16} />
							<span className="text-sm">Configure your text generation needs</span>
						</div>
						<Slider
							label="Output tokens per month"
							value={tokensPerMonth}
							onChange={setTokensPerMonth}
							min={0}
							max={1000000}
							step={10000}
							valueLabel={(v) =>
								v >= 1000000
									? `${(v / 1000000).toFixed(1)}M`
									: `${(v / 1000).toFixed(0)}K`
							}
						/>
						<Select
							label="Text model"
							value={textModel}
							onChange={setTextModel}
							options={modelPricing.text.map((m) => ({
								value: m.id,
								label: `${m.name} ($${m.pricePerMTokens}/1M)`,
							}))}
						/>
					</CalculatorSection>
				</div>

				<CalculatorDivider />

				{/* Results */}
				<div className="space-y-6">
					{/* Total Cost */}
					<ResultsCard
						title="Estimated Monthly Cost"
						value={`$${costs.total.toFixed(2)}`}
						subtitle="Based on your current selections"
						breakdown={[
							{
								label: "Image generation",
								value: `$${costs.imageCost.toFixed(2)}`,
								percentage: Math.round((costs.imageCost / costs.total) * 100) || 0,
							},
							{
								label: "Video generation",
								value: `$${costs.videoCost.toFixed(2)}`,
								percentage: Math.round((costs.videoCost / costs.total) * 100) || 0,
							},
							{
								label: "Text generation",
								value: `$${costs.textCost.toFixed(2)}`,
								percentage: Math.round((costs.textCost / costs.total) * 100) || 0,
							},
						]}
					/>

					{/* Cost Distribution */}
					<CalculatorSection title="Cost Distribution">
						<StackedCostBar
							segments={[
								{ id: "image", label: "Image", value: costs.imageCost, color: "primary" },
								{ id: "video", label: "Video", value: costs.videoCost, color: "warning" },
								{ id: "text", label: "Text", value: costs.textCost, color: "success" },
							]}
						/>
					</CalculatorSection>

					{/* Alternatives */}
					{alternatives.length > 0 && costs.total > 0 && (
						<CalculatorSection title="Top 3 Cheapest Combinations">
							<ComparisonResult options={alternatives} />
						</CalculatorSection>
					)}
				</div>
			</CalculatorGrid>
		</CalculatorShell>
	);
}
