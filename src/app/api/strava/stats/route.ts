import { auth } from "@/lib/auth";
import { getStravaStats } from "@/lib/strava/client";

export async function GET() {
  const session = await auth();
  const token = (session as any)?.stravaAccessToken as string | undefined;
  if (!token) return Response.json({ error: "Not connected to Strava" }, { status: 401 });
  const stats = await getStravaStats(token);
  return Response.json(stats ?? { error: "No runs found" }, { status: stats ? 200 : 404 });
}
