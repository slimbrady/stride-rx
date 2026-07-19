"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { RecommendationResult } from "@/lib/types";

export default function RecommendPage() {
  const [result, setResult] = useState<RecommendationResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("stride_rx_result");
    if (raw) setResult(JSON.parse(raw));
  }, []);

  if (!result) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">No recommendations yet.</p>
          <Link href="/profile" className="text-emerald-400 hover:underline">Go build your profile →</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Top 5 Shoes</h1>
            <p className="text-sm text-zinc-400 mt-1">Ranked from {result.total_candidates} candidates · scored on biomechanics, training, preferences & Strava data</p>
          </div>
          <Link href="/profile" className="text-sm text-emerald-400 hover:underline">Edit profile</Link>
        </div>

        <div className="space-y-5">
          {result.recommendations.map((r, i) => (
            <div key={r.shoe.id} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-xs text-zinc-500">#{i + 1} · Score {r.total_score}/100</div>
                  <div className="text-xl font-bold">{r.shoe.brand} {r.shoe.model}</div>
                  <div className="text-xs text-zinc-400 mt-1">
                    {r.shoe.weight_g}g · {r.shoe.drop_mm}mm drop · {r.shoe.heel_stack_mm}/{r.shoe.forefoot_stack_mm}mm stack · {r.shoe.cushioning} · ${r.shoe.price_usd}
                  </div>
                </div>
                <div className="text-right text-xs text-zinc-500 shrink-0">
                  <div>Bio {r.breakdown.biomechanical}/40</div>
                  <div>Train {r.breakdown.training}/25</div>
                  <div>Pref {r.breakdown.preferences}/20</div>
                  <div>Strava {r.breakdown.strava}/15</div>
                </div>
              </div>

              {r.reasons.length > 0 && (
                <ul className="text-sm text-zinc-300 space-y-1 mb-2">
                  {r.reasons.slice(0, 4).map((reason, j) => <li key={j}>• {reason}</li>)}
                </ul>
              )}
              {r.warnings.length > 0 && (
                <div className="text-xs text-amber-400/80 mt-2">
                  ⚠ {r.warnings.join(" · ")}
                </div>
              )}
              <div className="text-xs text-zinc-500 mt-3">
                {r.shoe.best_for} · {r.shoe.terrain} · {r.shoe.ideal_distance_km}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-xs text-zinc-500 text-center">
          Shoe database & clinical prescription logic based on peer-reviewed research.
          {" "}<a href="https://docs.google.com/document/d/1i_IJXWTfpWhB7ZoaOo7KC3n7p3H3E0SKtPh7qZ0Quco/edit" target="_blank" className="text-emerald-400 hover:underline">Read the research →</a>
        </div>
      </div>
    </main>
  );
}
