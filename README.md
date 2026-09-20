# KOHLER Spatia — AI-Powered Bathroom Spatial Intelligence Platform

> **Concept Case Study Note**: This is a CONCEPT / CASE STUDY project referencing Kohler for portfolio purposes only — not an official Kohler product.
> *"Concept case study — not affiliated with Kohler Co."*

---

## Brand & Design System

- **Wordmark**: `KOHLER` in a bold, heavy, confident sans-serif with `Spatia` as a lighter-weight suffix.
- **Palette**:
  - Ink Charcoal: `#1C2126` (Primary dark / text)
  - Porcelain: `#F6F3EE` (Primary light background)
  - Brass: `#AE8A4E` (Default accent)
  - Stone Grey: `#8C8474` (Secondary text / borders)
- **Dynamic Accent Theme**:
  - *Minimalist Modern*: Polished Chrome / Vibrant Polished Nickel (Clean silver tone `#6E7E91`)
  - *Classic Luxury*: Vibrant French Gold / Vibrant Brushed Bronze (Warm gold tone `#AE8A4E`)
  - *Japanese Zen*: Matte Black / Vibrant Titanium (Dark matte tone `#2E343B`)
- **Typography**: Montserrat (used universally across editorial display headlines, titles, navigation, and body copy) paired with JetBrains Mono for technical specs.
- **Product Imagery**: Generic unbranded stock photography sourced via the Pexels API (`VITE_PEXELS_API_KEY`) with curated fallback swatches and mathematical Three.js materials. Never scraped or replicated from actual Kohler product photography.

---

## Core Intelligence Architecture (`src/services/`)

The platform is driven by deterministic spatial, financial, and hydraulic calculation engines:

```
src/services/
├── pexelsService.ts          # Pexels API image fetching + local caching + fallback
├── designEngine.ts           # Central scoring, dynamic priority weights, spatial/budget/plumbing fit
├── constraintEngine.ts       # Physical clash detection, clearance checking, conflict resolution
├── layoutEngine.ts           # Auto-layout generation (Space, Luxury, Accessibility layouts)
├── sustainabilityEngine.ts   # Water/energy consumption modeling, baseline comparison, chart data
├── aiReasoningService.ts     # "Why This", "Why Not This", score breakdown, confidence scoring
└── pdfReportService.ts       # 13-page comprehensive technical design report in jsPDF
```

### 1. Central Design Intelligence Engine (`designEngine.ts`)
- Evaluates complete `BathroomDesignState` (dimensions, shape, door position, plumbing status, accessibility requirements, renovation scope, budget).
- Computes transparent **Spatia Design Score (0–100)** with 8 sub-scores:
  - Spatial & Clearance Fit
  - Budget Capital Allocation
  - Theme & Finish Compatibility
  - Functional Suitability
  - Hydraulic & Plumbing Fit
  - Water & Eco Efficiency
  - Universal Accessibility
  - Future Readiness & Smart Tech
- Dynamically shifts sub-score weights according to user priorities.

### 2. Constraint Conflict Resolver (`constraintEngine.ts`)
- Detects physical clashes: wall width overflow, door swing corridor collisions, minimum passage deficit (< 750mm code minimum), and hydraulic pressure deficits.
- Generates 3 actionable resolution strategies for every clash:
  - **Preserve Luxury**: Keeps statement items and re-orients space.
  - **Preserve Space**: Switches to compact floating / wall-hung models.
  - **Preserve Budget**: Value-engineered alternatives.
- Provides interactive `"Apply AI Resolution"` buttons that update selections instantly.

### 3. Auto-Layout Generation (`layoutEngine.ts`)
- Synthesizes 3 distinct architectural configurations with complete 2D/3D coordinate transformations:
  - **Layout A — Space-Optimized**: Wall-hung fixtures, maximized open corridor (>65% circulation).
  - **Layout B — Luxury-Optimized**: Focal centerpieces, freestanding vanity, dedicated hydrotherapy wet zone.
  - **Layout C — Accessibility-Oriented**: Zero-threshold roll-in entry, 1200mm turning circle, comfort height seating.

### 4. Sustainability & Environmental Engine (`sustainabilityEngine.ts`)
- Deterministic life-cycle calculations comparing builder-grade baseline fixtures against Kohler low-flow Katalyst fixtures.
- Calculates annual water savings (Litres/year), water reduction percentage, water-heating energy savings (kWh), carbon emissions avoided (kg CO2e), and utility cost savings (INR).
- Generates datasets for two custom luxury SVG charts:
  - **Graph 1**: Water Efficiency vs. Cost Scatter Benchmark.
  - **Graph 2**: Luxury vs. Cost vs. Water Savings Multi-Dimensional Bubble Plot.

### 5. Explainable AI Studio (`aiReasoningService.ts`)
- Provides transparent `"Why Spatia Chose This"` rationales for all selected fixtures across Spatial, Material, Hydraulic, and Efficiency dimensions.
- Provides diagnostic `"Why Not This?"` audit for rejected fixture alternatives, citing dimensional overflows and score trade-offs.
- Derives mathematical **Design Confidence Score** based on input data completeness.

### 6. 13-Page Comprehensive Design Report PDF (`pdfReportService.ts`)
- Generates a full 13-page technical report using `jsPDF`:
  1. Cover Page (Project Title, Client, Dimensions, Issue Date, Disclaimer)
  2. Executive Design Summary & Performance Cards
  3. User Requirements & Physical Space Envelope
  4. AI Design Rationale & Ergonomic Directives
  5. Scheduled Fixture Portfolio & Line-Item Pricing
  6. Comparative Selection Analysis ("Why This vs Why Not This")
  7. 2D Architectural Floor Plan (Scale 1:25 with door swing arc and plumbing nodes)
  8. 3D Spatial Geometry & Volumetric Clearance Audit
  9. AI Spatial Visualizations (Attributed as indicative representation)
  10. Environmental Sustainability & Hydro-Efficiency Audit
  11. Renovation Scope, Milestones & Feasibility
  12. Mechanical, Electrical & Plumbing (MEP) Contractor Specification
  13. Final AI Design Scorecard, Executive Rationale & Attestation Sign-off

### 8. Proportional 3D WebGL Room Geometry (`RoomScene3D.tsx`)
- Dynamic scaling derived from entered width and length across `ft`, `cm`, and `m`.
- Proportional camera framing and fixture positioning across small (6×6ft), medium (9×11ft), and large (14×16ft) envelopes.
- On-screen spatial validation badge (`✓ SPATIAL VALIDATION PASSED` or `⚠️ LAYOUT CONFLICT`).

### 9. Version History & Design Snapshots (`UserDashboard.tsx`)
- Every project save creates an immutable version snapshot.
- Compare any two historical versions side-by-side with cost delta and score delta.

---

## Standalone Quickstart

```bash
# 1. Clone repository
cd kohler-spatia

# 2. Configure Environment (Optional Pexels API Key)
cp .env.example .env

# 3. Install Dependencies
npm install

# 4. Start Development Server
npm run dev

# 5. Build for Production
npm run build

# 6. Preview Production Bundle
npm run preview
```

---

## Verification Checklist

- [x] Room dimensions scale accurately in 3D WebGL across Small (6×6ft), Medium (9×11ft), and Large (14×16ft) rooms.
- [x] Pexels API integration fetches unbranded photography with fallback to curated swatches and architectural SVGs.
- [x] Unified Constraint Conflict Resolver detects physical collisions and applies AI resolutions.
- [x] Auto-Layout generates Space, Luxury, and Accessibility configurations.
- [x] Sustainability Dashboard renders Graph 1 & Graph 2 with baseline comparison table.
- [x] What-If Simulator dynamically models trade-offs.
- [x] Explainable AI drawer provides "Why This" and "Why Not This" breakdowns.
- [x] 13-Page Design Report PDF downloads cleanly with all metrics and diagrams.
- [x] Dashboard supports design version history and comparison.
- [x] 0 TypeScript errors on `npm run build`.
