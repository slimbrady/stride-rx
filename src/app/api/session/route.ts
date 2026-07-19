import { auth } from "@/lib/auth";
export const runtime = "nodejs";
export async function GET() {
  const session = await auth();
  return Response.json({ session });
}
