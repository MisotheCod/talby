import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  assignLandingVariant,
  newVisitorId,
  LANDING_VID_COOKIE,
  LANDING_VARIANT_COOKIE,
  type LandingVariant,
} from "@/lib/landing-experiment";

/**
 * Middleware: refreshes the Supabase auth session cookie on every request,
 * and runs the landing-test experiment (3-way split: control/question/signup).
 * Route protection is handled here via matcher config.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const publicRoutes = ["/", "/login", "/signup", "/terms", "/privacy", "/forgot-password", "/reset-password"];
  const isPublic = publicRoutes.some((r) => path === r || path.startsWith(r + "/"));

  if (!user && (path.startsWith("/app") || path.startsWith("/onboarding"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (user && ["/login", "/signup"].includes(path)) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  // The homepage (marketing, incl. the #pricing comparison) stays reachable for
  // signed-in users so in-app upgrade prompts can link to it. Signing in or up
  // already lands users on /app, so no forced redirect is needed here.

  // ---- landing-test experiment: control / question / signup ----
  // Every top-level pageview carries a variant. Deterministic per visitor id so
  // a visitor always lands the same arm. The "signup" arm redirects straight to
  // /signup so the offer renders immediately (client-side flag evaluation can't
  // do this — the redirect must happen before the page renders). Cookies are
  // first-party and same-origin on the redirect, so the browser keeps the same
  // PostHog ph_phc cookie and distinct_id, which is what makes signup_completed
  // attributable to the experiment.
  if (!user && (path === "/" || path === "/blog" || path === "/privacy" || path === "/terms")) {
    let vid = request.cookies.get(LANDING_VID_COOKIE)?.value;
    let variant: LandingVariant | null = null;
    const existingVariant = request.cookies.get(LANDING_VARIANT_COOKIE)?.value;
    if (existingVariant && (existingVariant === "control" || existingVariant === "question" || existingVariant === "signup")) {
      variant = existingVariant;
    } else if (vid) {
      variant = assignLandingVariant(vid);
    }
    // Always persist the vid, and the variant once computed, on the response so
    // the assignment is stable for the whole visit.
    if (!vid) {
      vid = newVisitorId();
      supabaseResponse.cookies.set(LANDING_VID_COOKIE, vid, {
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }
    if (!variant) variant = assignLandingVariant(vid);
    supabaseResponse.cookies.set(LANDING_VARIANT_COOKIE, variant, {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    // NOTE: the "signup" arm no longer redirects the homepage to /signup. The
    // variant is still assigned + persisted above so signup_completed stays
    // attributable to the experiment client-side, but the homepage always
    // renders — a logo/footer link to "/" must land on the homepage.
  }

  return supabaseResponse;
}
