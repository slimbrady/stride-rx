// Core types for StrideRx

export type RunningType =
  | "casual"
  | "recreational"
  | "short_middle"  // 5K-10K
  | "half_marathon"
  | "competitive"   // racing 5K-HM
  | "marathoner"
  | "ultra";

export type FootStrike = "heel" | "midfoot" | "forefoot";

export type Condition =
  | "none"
  | "knee_valgus"      // overpronation / dynamic valgus
  | "knee_varus"       // supination / cavus
  | "pfps"             // patellofemoral pain
  | "achilles"
  | "plantar_fasciitis"
  | "itbs"
  | "mtss";            // shin splints

export type CushioningLevel = "Low" | "Medium" | "Medium-High" | "High" | "Very High" | "Max";
export type StabilityLevel = "Low" | "Medium" | "High" | "Very High";
export type TerrainType = "Road" | "Trail" | "Mixed" | "All";

export interface Shoe {
  id: string;
  model: string;
  brand: string;
  weight_g: number;
  heel_stack_mm: number;
  forefoot_stack_mm: number;
  drop_mm: number;
  midsole_foam: string;
  cushioning: CushioningLevel;
  plate: string; // "None" | "Carbon" | "Carbon curved" | "Nylon" | etc
  outsole: string;
  toe_box: string;
  stability: StabilityLevel;
  terrain: string;
  lug_depth_mm: number;
  price_usd: number;
  ideal_distance_km: string;
  best_for: string;

  // Prescription metadata
  conditions: Condition[];  // which conditions this shoe is recommended for
  body_mass_fit: ("light" | "average" | "heavy")[]; // <60kg, 60-80kg, >80kg
  foot_strike_fit: FootStrike[];
  running_types: RunningType[];
}

export interface UserProfile {
  // Strava-derived (optional)
  strava_athlete_id?: number;
  strava_access_token?: string;
  weekly_mileage_km?: number;
  avg_pace_min_per_km?: number;
  elevation_per_week_m?: number;
  run_type_split?: {
    road: number;
    trail: number;
  };

  // User-entered — body
  weight_kg?: number;
  height_cm?: number;

  // User-entered — running profile
  running_type: RunningType;
  foot_strike: FootStrike;

  // User-entered — biomechanics / injuries
  conditions: Condition[];  // can select multiple

  // User-entered — preferences (all optional, soft constraints)
  preferences?: {
    brands?: string[];           // empty = any
    max_price_usd?: number;
    min_cushioning?: CushioningLevel;
    max_weight_g?: number;
    drop_min_mm?: number;
    drop_max_mm?: number;
    plate_allowed?: ("none" | "nylon" | "carbon")[];
    terrain?: TerrainType[];
    stack_max_mm?: number;
  };
}

export interface ShoeScore {
  shoe: Shoe;
  total_score: number;
  breakdown: {
    biomechanical: number;  // 0-40
    training: number;       // 0-25
    preferences: number;    // 0-20
    strava: number;         // 0-15
  };
  reasons: string[];        // why this shoe matched
  warnings: string[];       // any cautions
}

export interface RecommendationResult {
  profile: UserProfile;
  recommendations: ShoeScore[]; // top 5
  total_candidates: number;
}
