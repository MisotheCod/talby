import { createBrowserClient } from "@supabase/ssr";

// Untyped client — the Supabase project isn't provisioned yet, so we
// can't `supabase gen types`. Call sites cast rows explicitly.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
