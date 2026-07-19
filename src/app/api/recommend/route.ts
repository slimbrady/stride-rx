import { NextRequest } from "next/server";
import { recommendShoes } from "@/lib/recommender/engine";
import type { UserProfile } from "@/lib/types";

export async function POST(req: NextRequest) {
  const profile = (await req.json()) as UserProfile;
  const result = recommendShoes(profile, 5);
  return Response.json(result);
}
