# Requirements - Estimateur des droits de douane au Maroc (Telephones)

## Purpose
Provide a simple, mobile-first web tool that estimates import fees for phones in Morocco using a transparent low/high range. The tool is informational only and not an official decision.

## Scope
- Static website only (no backend, no database).
- Local-only calculation using rules stored in `data/rules.v1.json`.
- Four pages: Home, Estimator, How it works, Legal warning.

## Tech Stack
- Next.js 14 (App Router) with static export (`output: "export"`).
- TypeScript.
- Tailwind CSS.
- Zod for form validation.
- JSON rules file versioned at `data/rules.v1.json`.

## Pages and Routes
- `/` (Home): Explain the problem and guide users to the estimator.
- `/estimer` (Estimator): Form + results table with low/high range.
- `/comment-ca-marche` (How it works): Explain customs value, VAT, and why results vary.
- `/avertissement` (Legal): Clear disclaimer about estimation and authority.

## Form Fields
- Phone price (number).
- Currency: EUR or MAD.
- Condition: new or used.
- Import mode: traveler (luggage) or shipment (parcel).
- Quantity: 1 to 5.

## Calculation Logic
- Use `exchangeRateEurToMad` from `data/rules.v1.json` for EUR conversion.
- Compute base value in MAD: `priceInMad * quantity`.
- Apply condition multiplier from `conditionMultipliers` to get customs value.
- Duties (low/high): customs value * `dutyRateLow` and `dutyRateHigh`.
- Fixed fees (low/high): only when import mode is `envoi` (shipment).
- VAT (low/high): `(customs value + duties + fixed fees) * vatRate`.
- Total (low/high): duties + VAT + fixed fees.
- Round all monetary values to 2 decimals.

## Data Rules Source
All rates and notes must be read from `data/rules.v1.json`. The calculator must not embed any rate in code.

## Validation Rules (Zod)
- `price`: positive number.
- `currency`: EUR or MAD.
- `condition`: new or used.
- `importMode`: traveler or shipment.
- `quantity`: integer between 1 and 5.

## SEO and Static Files
- Use French `<title>` and `<meta description>` per page.
- Provide `public/robots.txt` and `public/sitemap.xml`.
- Clean, readable URLs.

## Deployment
- Target: Cloudflare Pages.
- Build: `npm run build`.
- Output directory: `out`.

## Copy and Tone
- Clear, simple French.
- Avoid technical implementation details in user-facing copy.
- Always show results as a low/high range.
- Emphasize that results are estimates, not official advice.

## Maintenance Note
Keep this file updated whenever features, copy, calculation rules, routes, or the tech stack change.
