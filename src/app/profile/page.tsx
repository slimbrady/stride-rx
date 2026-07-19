"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { UserProfile, RunningType, FootStrike, Condition } from "@/lib/types";

const RUNNING_TYPES: { value: RunningType; label: string }[] = [
  { value: "casual", label: "Casual / fitness" },
  { value: "recreational", label: "Recreational / regular" },
  { value: "short_middle", label: "5K – 10K racer" },
  { value: "half_marathon", label: "Half marathoner" },
  { value: "competitive", label: "Competitive (5K–HM)" },
  { value: "marathoner", label: "Marathoner" },
  { value: "ultra", label: "Ultra / 50K+" },
];

const CONDITIONS: { value: Condition; label: string }[] = [
  { value: "none", label: "None / no issues" },
  { value: "knee_valgus", label: "Knee valgus / overpronation" },
  { value: "knee_varus", label: "Knee varus / supination / cavus" },
  { value: "pfps", label: "Patellofemoral pain (runner's knee)" },
  { value: "achilles", label: "Achilles tendinopathy" },
  { value: "plantar_fasciitis", label: "Plantar fasciitis" },
  { value: "itbs", label: "ITB syndrome" },
  { value: "mtss", label: "Shin splints / MTSS" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [stravaData, setStravaData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [runningType, setRunningType] = useState<RunningType>("recreational");
  const [footStrike, setFootStrike] = useState<FootStrike>("midfoot");
  const [conditions, setConditions] = useState<Condition[]>(["none"]);

  const [brandFilter, setBrandFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [dropMin, setDropMin] = useState("");
  const [dropMax, setDropMax] = useState("");
  const [maxWeight, setMaxWeight] = useState("");

  useEffect(() => {
    // Try to fetch Strava stats if connected
    fetch("/api/strava/stats").then(r => r.ok ? r.json() : null).then(d => d && setStravaData(d)).catch(()=>{});
  }, []);

  const toggleCondition = (c: Condition) => {
    if (c === "none") { setConditions(["none"]); return; }
    setConditions(prev => {
      const next = prev.filter(x => x !== "none");
      return next.includes(c) ? next.filter(x => x !== c) : [...next, c];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const profile: UserProfile = {
      weight_kg: weight ? Number(weight) : undefined,
      height_cm: height ? Number(height) : undefined,
      running_type: runningType,
      foot_strike: footStrike,
      conditions: conditions.length ? conditions : ["none"],
      preferences: {
        brands: brandFilter ? brandFilter.split(",").map(s => s.trim()).filter(Boolean) : undefined,
        max_price_usd: maxPrice ? Number(maxPrice) : undefined,
        drop_min_mm: dropMin ? Number(dropMin) : undefined,
        drop_max_mm: dropMax ? Number(dropMax) : undefined,
        max_weight_g: maxWeight ? Number(maxWeight) : undefined,
      },
      ...(stravaData || {}),
    };
    sessionStorage.setItem("stride_rx_profile", JSON.stringify(profile));
    const res = await fetch("/api/recommend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
    const result = await res.json();
    sessionStorage.setItem("stride_rx_result", JSON.stringify(result));
    router.push("/recommend");
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Your Running Profile</h1>
        <p className="text-zinc-400 mb-8 text-sm">Fill in what you know — the more detail, the better the match.</p>

        {stravaData && (
          <div className="bg-emerald-950/30 border border-emerald-900 rounded-xl p-4 mb-6 text-sm">
            <b className="text-emerald-400">Strava connected ✓</b>
            <div className="text-zinc-400 mt-1">
              {stravaData.weekly_mileage_km} km/wk · {stravaData.avg_pace_min_per_km} min/km avg · {stravaData.elevation_per_week_m}m elev/wk
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Body */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">Body</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs text-zinc-400">Weight (kg)</span>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm" placeholder="72" />
              </label>
              <label className="block">
                <span className="text-xs text-zinc-400">Height (cm)</span>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm" placeholder="178" />
              </label>
            </div>
          </section>

          {/* Running profile */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">Running</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-xs text-zinc-400">Running type</span>
                <select value={runningType} onChange={e => setRunningType(e.target.value as RunningType)} className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm">
                  {RUNNING_TYPES.map(rt => <option key={rt.value} value={rt.value}>{rt.label}</option>)}
                </select>
              </label>
              <div>
                <span className="text-xs text-zinc-400 block mb-2">Foot strike</span>
                <div className="flex gap-3">
                  {(["heel", "midfoot", "forefoot"] as FootStrike[]).map(fs => (
                    <button type="button" key={fs} onClick={() => setFootStrike(fs)}
                      className={`px-4 py-2 rounded-lg text-sm transition ${footStrike === fs ? "bg-emerald-500 text-zinc-950 font-semibold" : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700"}`}>
                      {fs}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Conditions */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">Biomechanics / Injury History</h2>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(c => (
                <button type="button" key={c.value} onClick={() => toggleCondition(c.value)}
                  className={`px-3 py-1.5 rounded-full text-xs transition ${conditions.includes(c.value) ? "bg-emerald-500 text-zinc-950 font-semibold" : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700"}`}>
                  {c.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-2">Select all that apply. These drive the clinical shoe prescription logic.</p>
          </section>

          {/* Preferences */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">Preferences <span className="normal-case font-normal text-zinc-500">(optional)</span></h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <label className="block">
                <span className="text-xs text-zinc-400">Brands (comma-separated)</span>
                <input value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2" placeholder="HOKA, Brooks, Nike" />
              </label>
              <label className="block">
                <span className="text-xs text-zinc-400">Max price ($)</span>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2" placeholder="200" />
              </label>
              <label className="block">
                <span className="text-xs text-zinc-400">Drop min (mm)</span>
                <input type="number" value={dropMin} onChange={e => setDropMin(e.target.value)} className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2" placeholder="0" />
              </label>
              <label className="block">
                <span className="text-xs text-zinc-400">Drop max (mm)</span>
                <input type="number" value={dropMax} onChange={e => setDropMax(e.target.value)} className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2" placeholder="10" />
              </label>
              <label className="block col-span-2">
                <span className="text-xs text-zinc-400">Max shoe weight (g)</span>
                <input type="number" value={maxWeight} onChange={e => setMaxWeight(e.target.value)} className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2" placeholder="300" />
              </label>
            </div>
          </section>

          <button disabled={loading} className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-semibold rounded-xl transition">
            {loading ? "Finding your shoes…" : "Get My 5 Shoes →"}
          </button>
        </form>
      </div>
    </main>
  );
}
