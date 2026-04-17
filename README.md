# Rateforge

Rateforge is a public AI model pricing comparison product built with TanStack Start.

The goal is to compare image, video, and text model costs across:
- raw APIs
- consumer platforms
- subscription plans
- credit-based pricing systems

## Initial Direction

Rateforge starts as a public, SEO-friendly comparison and tools site.
Later it can funnel users into Sceneframe or other creator workflow products.

See the core product plan in:
- `AI_MODEL_PRICING_COMPARISON_SITE_PLAN.md`

## Local Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Stack

- TanStack Start
- TanStack Router
- TanStack Query
- Netlify
- Neon Postgres
- Drizzle ORM
- Tailwind CSS

## Notes

This project was bootstrapped from the Sceneframe codebase as a structural starting point.
The next cleanup pass should remove app-specific media-generation code and replace it with Rateforge-specific routes, schema, and data ingestion.
