# StrideRx 🏃

**Biomechanical running shoe recommendations — built on peer-reviewed research, not marketing.**

StrideRx matches running shoes to your body, gait, injury profile, and training data. Pull in your Strava history, fill in your biomechanics, get 5 shoes ranked specifically for YOU.

Built by a DPT, powered by science.

---

## The Research

Recommendations are grounded in 5 peer-reviewed papers:

1. **Waśkiewicz et al. (2025)** — Footwear biomechanics in ultramarathon running. *Front. Bioeng. Biotechnol.*
2. **Kettner et al. (2025)** — Stack height effects on running style and stability
3. **Song et al. (2024)** — Curved carbon plate forefoot load reduction. *Sci Rep.* — 35 citations
4. **Hébert-Losier & Pamment (2022)** — Running shoe tech / running economy overview — 51 citations
5. **Rodrigo Carranza (2023)** — Shoe characteristics → physiology / biomechanics / performance. *PhD Academy Award*

Full research summaries + clinical shoe prescription guide: [Google Doc](https://docs.google.com/document/d/1i_IJXWTfpWhB7ZoaOo7KC3n7p3H3E0SKtPh7qZ0Quco/edit)

Shoe database (150+ shoes across 10 biomechanical categories): [Google Sheets](https://docs.google.com/spreadsheets/d/1YX0YijoEHXyDy49tjinECOa64scGQv_uqpIEr2NNqrk/edit)

---

## Features

- 🔗 **Strava integration** — pull weekly mileage, average pace, elevation, run type distribution
- 🦶 **Biomechanical profiling** — foot strike, pronation, knee alignment (valgus/varus), injury history (PFPS, Achilles, PF, ITBS, MTSS)
- ⚖️ **Body mass stratification** — shoe recommendations weighted by your body mass (heavier runners benefit more from super foams, lighter runners need less stack)
- 🎯 **Preference filters** — brand, stack height, drop, plate type, cushioning level, price range
- 🧠 **Scoring engine** — multi-factor weighted scoring: biomechanical match (40%), training profile match (25%), user preferences (20%), Strava-derived fit (15%)
- 📊 **Explainable results** — every recommendation includes "why this shoe for you" with clinical rationale

---

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Fill in STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, NEXTAUTH_SECRET
npm run dev
```

Open http://localhost:3000

### Strava API Setup

1. Go to https://www.strava.com/settings/api
2. Create an app — set Authorization Callback Domain to `localhost:3000`
3. Copy Client ID + Client Secret into `.env.local`
4. Scopes needed: `read`, `activity:read`

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **Auth:** NextAuth.js (Strava OAuth)
- **DB:** Vercel Postgres (for saved profiles/recommendations) — optional, works without
- **Deploy:** Vercel (one-click)

---

## Shoe Database

`src/lib/shoes/database.ts` — 40+ shoes across 7 clinical conditions + 3 body mass categories:

- Knee valgus / overpronation
- Knee varus / supination (cavus)
- Patellofemoral pain
- Achilles tendinopathy
- Plantar fasciitis
- ITB syndrome
- MTSS / shin splints
- Heavier runners (>80 kg)
- Lighter runners (<60 kg)
- Average runners (60-80 kg)

Each shoe includes: weight, stack (heel/forefoot), drop, midsole foam, cushioning level, plate type, outsole, toe box, stability rating, terrain, price, ideal distance, and condition-specific clinical notes.

---

## Recommendation Engine

`src/lib/recommender/engine.ts`

Scoring weights:
- **Biomechanical match — 40%** — foot strike × condition × alignment → drop/cushioning/plate/stability requirements
- **Training profile match — 25%** — running type + weekly mileage + typical distance → shoe category + durability needs
- **User preferences — 20%** — brand, stack, drop, plate, cushioning, price (soft constraints with penalties, not hard filters)
- **Strava-derived fit — 15%** — pace, elevation gain, surface mix, consistency → refines shoe category weighting

Returns top 5 ranked shoes with per-factor score breakdown and clinical rationale.

---

## License

MIT

---

## Disclaimer

Shoe recommendations are educational / informational. Not medical advice. Consult a qualified physical therapist or podiatrist for clinical shoe prescription, especially with active injuries.
