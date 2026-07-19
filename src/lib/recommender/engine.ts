import { Shoe, UserProfile, ShoeScore, CushioningLevel, Condition } from "../types";
import { SHOES } from "../shoes/database";

const CUSHION_ORDER: CushioningLevel[] = ["Low", "Medium", "Medium-High", "High", "Very High", "Max"];
const cushionRank = (c: string) => Math.max(0, CUSHION_ORDER.indexOf(c as CushioningLevel));

function bodyMassCategory(weight_kg?: number): "light" | "average" | "heavy" | null {
  if (!weight_kg) return null;
  if (weight_kg < 60) return "light";
  if (weight_kg > 80) return "heavy";
  return "average";
}

// Condition → shoe feature requirements (from clinical prescription guide)
const CONDITION_RULES: Record<Exclude<Condition, "none">, {
  drop_min?: number;
  drop_max?: number;
  cushioning_min?: CushioningLevel;
  avoid_plates?: boolean;
  prefer_plate?: boolean;
  prefer_rocker?: boolean;
  stability_min?: "Medium" | "High" | "Very High";
  avoid_stability?: boolean;
  notes: string;
}> = {
  knee_valgus: {
    drop_min: 6, drop_max: 12,
    cushioning_min: "Medium",
    avoid_plates: true,
    stability_min: "High",
    notes: "Stability shoe, 6-10mm drop reduces knee extensor moment. Firm foam resists medial collapse. Avoid carbon plates — reduces natural pronation control.",
  },
  knee_varus: {
    drop_min: 4, drop_max: 10,
    cushioning_min: "High",
    avoid_stability: true,
    notes: "MAX cushioning neutral — rigid cavus feet need impact attenuation. ABSOLUTE avoid stability/motion control (adds varus to already varus foot).",
  },
  pfps: {
    drop_max: 4,
    cushioning_min: "Medium",
    prefer_rocker: true,
    notes: "LOW DROP 0-4mm — decreases knee extensor moment / PFJ stress. Strongest evidence-based Rx. Transition gradually, concurrent calf strengthening mandatory.",
  },
  achilles: {
    drop_min: 8,
    cushioning_min: "Medium",
    prefer_plate: true,
    notes: "HIGH DROP 8-12mm+ — decreases ankle DF → reduces Achilles strain 10-15%. Carbon plate BENEFICIAL — acts as external plantarflexor. Firm heel counter mandatory.",
  },
  plantar_fasciitis: {
    drop_min: 6,
    cushioning_min: "Medium",
    prefer_plate: true,
    prefer_rocker: true,
    notes: "Moderate drop 6-10mm + rocker/plate LIMITS windlass mechanism → reduces PF tensile strain. Firm heel, avoid flexible forefoot.",
  },
  itbs: {
    drop_max: 4,
    cushioning_min: "Medium",
    notes: "LOW DROP 0-4mm — reduces knee extensor moment → decreases ITB compression at 30° impingement. Increase step rate +5-10%.",
  },
  mtss: {
    drop_min: 6,
    cushioning_min: "High",
    notes: "MAX CUSHIONING — MTSS is bone stress. Attenuate impact transient. Higher drop unloads calf/posterior tibialis (periosteal traction).",
  },
};

function scoreBiomechanical(shoe: Shoe, profile: UserProfile): { score: number; reasons: string[]; warnings: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const warnings: string[] = [];
  const maxScore = 40;

  // Condition matching (highest weight)
  if (profile.conditions.length > 0 && !profile.conditions.includes("none")) {
    let conditionScore = 0;
    for (const cond of profile.conditions) {
      if (cond === "none") continue;
      const rule = CONDITION_RULES[cond];
      if (!rule) continue;

      let passed = true;
      if (rule.drop_min !== undefined && shoe.drop_mm < rule.drop_min) { passed = false; warnings.push(`${cond}: drop ${shoe.drop_mm}mm below recommended ${rule.drop_min}mm+`); }
      if (rule.drop_max !== undefined && shoe.drop_mm > rule.drop_max) { passed = false; warnings.push(`${cond}: drop ${shoe.drop_mm}mm above recommended ≤${rule.drop_max}mm`); }
      if (rule.cushioning_min && cushionRank(shoe.cushioning) < cushionRank(rule.cushioning_min)) { passed = false; warnings.push(`${cond}: cushioning ${shoe.cushioning} below ${rule.cushioning_min}`); }
      if (rule.avoid_plates && shoe.plate !== "None") { passed = false; warnings.push(`${cond}: avoid plated shoes`); }
      if (rule.avoid_stability && (shoe.stability === "High" || shoe.stability === "Very High") && shoe.model.toLowerCase().includes("stability")) { warnings.push(`${cond}: caution with stability features`); }

      if (passed) {
        conditionScore += 1;
        reasons.push(`✓ Matches ${cond} prescription: ${rule.notes.split(".")[0]}`);
      }
      // Bonus for preferred features
      if (rule.prefer_plate && shoe.plate !== "None") { conditionScore += 0.3; reasons.push(`+ Carbon/nylon plate therapeutically indicated for ${cond}`); }
    }
    score += Math.min(25, (conditionScore / profile.conditions.filter(c => c !== "none").length) * 25);
  } else {
    score += 12; // neutral baseline
  }

  // Foot strike ↔ drop matching
  const fs = profile.foot_strike;
  if (fs === "heel" && shoe.drop_mm >= 8) { score += 5; reasons.push("Drop matches heel strike pattern"); }
  else if (fs === "forefoot" && shoe.drop_mm <= 4) { score += 5; reasons.push("Low drop suits forefoot strike"); }
  else if (fs === "midfoot" && shoe.drop_mm >= 4 && shoe.drop_mm <= 8) { score += 5; reasons.push("Mid drop suits midfoot strike"); }
  else { score += 2; }

  // Body mass ↔ shoe weight/cushioning
  const massCat = bodyMassCategory(profile.weight_kg);
  if (massCat && shoe.body_mass_fit.includes(massCat)) {
    score += 5;
    reasons.push(`Designed for ${massCat} runners`);
  } else if (massCat) {
    score += 1;
    warnings.push(`Shoe optimized for ${shoe.body_mass_fit.join("/")} body mass (you: ${massCat})`);
  } else {
    score += 3;
  }

  // Condition-specific shoe tagging bonus
  const matchedConditions = profile.conditions.filter(c => c !== "none" && shoe.conditions.includes(c));
  if (matchedConditions.length > 0) {
    score += Math.min(5, matchedConditions.length * 2.5);
  }

  return { score: Math.min(maxScore, score), reasons, warnings };
}

function scoreTraining(shoe: Shoe, profile: UserProfile): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  
  if (shoe.running_types.includes(profile.running_type)) {
    score += 15;
    reasons.push(`Suitable for ${profile.running_type} training`);
  } else {
    score += 5;
  }

  // Mileage durability
  const weeklyKm = profile.weekly_mileage_km ?? 40;
  const isDurable = shoe.cushioning === "High" || shoe.cushioning === "Very High" || shoe.cushioning === "Max";
  if (weeklyKm > 60 && isDurable) { score += 5; reasons.push("Durable foam for high mileage"); }
  else if (weeklyKm <= 30) { score += 5; }
  else { score += 3; }

  // Terrain match from Strava if available
  if (profile.run_type_split) {
    const trailPct = profile.run_type_split.trail;
    const isTrail = shoe.terrain.toLowerCase().includes("trail");
    if ((trailPct > 0.5 && isTrail) || (trailPct <= 0.5 && !isTrail)) {
      score += 5;
      reasons.push(trailPct > 0.5 ? "Trail-appropriate" : "Road-appropriate");
    } else {
      score += 1;
    }
  } else {
    score += 3;
  }

  return { score: Math.min(25, score), reasons };
}

function scorePreferences(shoe: Shoe, profile: UserProfile): { score: number; reasons: string[]; warnings: string[] } {
  const pref = profile.preferences;
  if (!pref) return { score: 15, reasons: [], warnings: [] };

  let score = 20;
  const reasons: string[] = [];
  const warnings: string[] = [];

  if (pref.brands && pref.brands.length > 0) {
    if (pref.brands.map(b => b.toLowerCase()).includes(shoe.brand.toLowerCase())) {
      reasons.push(`Preferred brand: ${shoe.brand}`);
    } else {
      score -= 5; warnings.push(`Brand ${shoe.brand} not in preferences`);
    }
  }
  if (pref.max_price_usd && shoe.price_usd > pref.max_price_usd) {
    score -= 8; warnings.push(`$${shoe.price_usd} exceeds budget $${pref.max_price_usd}`);
  }
  if (pref.max_weight_g && shoe.weight_g > pref.max_weight_g) {
    score -= 4; warnings.push(`${shoe.weight_g}g exceeds ${pref.max_weight_g}g limit`);
  }
  if (pref.drop_min_mm !== undefined && shoe.drop_mm < pref.drop_min_mm) { score -= 4; warnings.push(`Drop ${shoe.drop_mm}mm < min ${pref.drop_min_mm}mm`); }
  if (pref.drop_max_mm !== undefined && shoe.drop_mm > pref.drop_max_mm) { score -= 4; warnings.push(`Drop ${shoe.drop_mm}mm > max ${pref.drop_max_mm}mm`); }
  if (pref.min_cushioning && cushionRank(shoe.cushioning) < cushionRank(pref.min_cushioning)) { score -= 4; warnings.push(`Cushioning ${shoe.cushioning} < ${pref.min_cushioning}`); }
  if (pref.plate_allowed && pref.plate_allowed.length > 0) {
    const plateType = shoe.plate.toLowerCase().includes("carbon") ? "carbon" : shoe.plate.toLowerCase().includes("nylon") ? "nylon" : "none";
    if (!pref.plate_allowed.includes(plateType as any)) { score -= 4; warnings.push(`Plate ${plateType} not allowed`); }
  }

  return { score: Math.max(0, score), reasons, warnings };
}

function scoreStrava(shoe: Shoe, profile: UserProfile): { score: number; reasons: string[] } {
  let score = 8; // baseline
  const reasons: string[] = [];
  if (!profile.weekly_mileage_km) return { score, reasons };

  const pace = profile.avg_pace_min_per_km ?? 5.5;
  const mileage = profile.weekly_mileage_km;
  
  // Fast runners benefit more from plates / light weight
  if (pace < 4.5 && shoe.plate !== "None" && shoe.weight_g < 260) {
    score += 4; reasons.push("Fast pace — plate + light weight will benefit you");
  }
  // High mileage → need durability/cushioning
  if (mileage > 70 && (shoe.cushioning === "High" || shoe.cushioning === "Very High" || shoe.cushioning === "Max")) {
    score += 3; reasons.push("High weekly mileage — cushioning will protect legs");
  }
  // Hilly → need grip + stability
  const elev = profile.elevation_per_week_m ?? 0;
  if (elev > 800 && shoe.lug_depth_mm >= 4) {
    score += 2; reasons.push("Hilly terrain — lug depth provides grip");
  }

  return { score: Math.min(15, score), reasons };
}

export function recommendShoes(profile: UserProfile, limit = 5) {
  const scored = SHOES.map(shoe => {
    const bio = scoreBiomechanical(shoe, profile);
    const training = scoreTraining(shoe, profile);
    const pref = scorePreferences(shoe, profile);
    const strava = scoreStrava(shoe, profile);

    const total = bio.score + training.score + pref.score + strava.score;

    return {
      shoe,
      total_score: Math.round(total * 10) / 10,
      breakdown: {
        biomechanical: Math.round(bio.score * 10) / 10,
        training: Math.round(training.score * 10) / 10,
        preferences: Math.round(pref.score * 10) / 10,
        strava: Math.round(strava.score * 10) / 10,
      },
      reasons: [...bio.reasons, ...training.reasons, ...pref.reasons, ...strava.reasons],
      warnings: [...bio.warnings, ...pref.warnings],
    };
  });

  scored.sort((a, b) => b.total_score - a.total_score);
  return {
    profile,
    recommendations: scored.slice(0, limit),
    total_candidates: SHOES.length,
  };
}
