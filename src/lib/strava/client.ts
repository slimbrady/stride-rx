export async function getStravaStats(accessToken: string) {
  try {
    const res = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=30", {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const activities = await res.json();
    const runs = activities.filter((a: any) => a.type === "Run");
    if (runs.length === 0) return null;

    const totalDist = runs.reduce((s: number, a: any) => s + a.distance, 0);
    const totalTime = runs.reduce((s: number, a: any) => s + a.moving_time, 0);
    const totalElev = runs.reduce((s: number, a: any) => s + (a.total_elevation_gain || 0), 0);
    const days = Math.max(1, (Date.now() - new Date(runs[runs.length - 1].start_date).getTime()) / 86400000);
    const weeks = Math.max(1, days / 7);

    return {
      weekly_mileage_km: Math.round((totalDist / 1000 / weeks) * 10) / 10,
      avg_pace_min_per_km: Math.round((totalTime / 60 / (totalDist / 1000)) * 10) / 10,
      elevation_per_week_m: Math.round(totalElev / weeks),
      run_count: runs.length,
    };
  } catch { return null; }
}
