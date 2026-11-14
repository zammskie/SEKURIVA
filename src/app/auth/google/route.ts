import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";

export async function POST(request: NextRequest) {
  if (!supabaseConfigured()) return NextResponse.redirect(new URL("/login?error=config", request.url), 303);
  const client = await createClient();
  const { data, error } = await client.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${request.nextUrl.origin}/auth/callback`, skipBrowserRedirect: true } });
  if (error || !data.url) return NextResponse.redirect(new URL("/login?error=oauth", request.url), 303);
  return NextResponse.redirect(data.url, 303);
}
