import { NextResponse } from "next/server";

/**
 * Legacy compatibility endpoint.
 *
 * Earlier Patenhuhn versions used Resend here. The current application stores
 * requests in Supabase and opens the visitor's mail client via mailto: instead,
 * so no mail provider is required anymore.
 *
 * Keeping this dependency-free route intentionally overwrites old GitHub copies
 * of app/api/send-mail/route.ts when upgrading from V0.5/V0.6.
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      deprecated: true,
      message: "Der direkte Mailversand ist deaktiviert. Die Anfrage wird in Supabase gespeichert und per mailto geöffnet.",
    },
    { status: 410 },
  );
}
