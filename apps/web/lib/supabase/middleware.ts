import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
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

  const isProtectedPath =
    path.startsWith("/dashboard") ||
    path.startsWith("/admin") ||
    path === "/onboarding";
  const isAuthPath = path === "/login" || path === "/signup";

  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    // Query the database to check if user has an org_id
    const { data: profile } = await supabase
      .from("profiles")
      .select("org_id")
      .eq("id", user.id)
      .single();

    if (isAuthPath) {
      const url = request.nextUrl.clone();
      url.pathname = profile?.org_id ? "/dashboard" : "/onboarding";
      return NextResponse.redirect(url);
    }

    // Redirect to onboarding if they don't have an organization yet
    if (!profile?.org_id && path !== "/onboarding" && (path.startsWith("/dashboard") || path.startsWith("/admin"))) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }

    // Redirect to dashboard if onboarding is complete and they hit onboarding
    if (profile?.org_id && path === "/onboarding") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
