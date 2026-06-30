import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("dummy-project-id") ||
  process.env.NEXT_PUBLIC_SUPABASE_URL === "";

export async function createMockClient() {
  const cookieStore = await cookies();
  const session = cookieStore.get("reol-nexus-session")?.value;
  const onboarded = cookieStore.get("reol-nexus-onboarded")?.value === "true";

  return {
    auth: {
      async getUser() {
        if (session === "authenticated") {
          return {
            data: {
              user: {
                id: "mock-user-123",
                email: "ebendttl@gmail.com",
                user_metadata: { full_name: "Akinseinde Ebenezer" }
              }
            },
            error: null
          };
        }
        return { data: { user: null }, error: new Error("No session") };
      },
      async signInWithPassword({ email }: any) {
        cookieStore.set("reol-nexus-session", "authenticated", { path: "/" });
        cookieStore.set("reol-nexus-onboarded", "true", { path: "/" });
        return { data: { user: { id: "mock-user-123" } }, error: null };
      },
      async signUp({ email, options }: any) {
        cookieStore.set("reol-nexus-session", "authenticated", { path: "/" });
        cookieStore.set("reol-nexus-fullname", options?.data?.full_name || "Manager", { path: "/" });
        cookieStore.set("reol-nexus-onboarded", "false", { path: "/" });
        return { data: { user: { id: "mock-user-123" } }, error: null };
      },
      async signOut() {
        cookieStore.delete("reol-nexus-session");
        cookieStore.delete("reol-nexus-onboarded");
        cookieStore.delete("reol-nexus-fullname");
        return { error: null };
      }
    },
    from(table: string) {
      return {
        select(fields: string) {
          return {
            eq(field: string, value: any) {
              return {
                single() {
                  const fullName = cookieStore.get("reol-nexus-fullname")?.value || "Akinseinde Ebenezer";
                  if (table === "profiles") {
                    return {
                      data: {
                        id: "mock-user-123",
                        full_name: fullName,
                        org_id: onboarded ? "mock-org-123" : null,
                        organizations: {
                          name: "REOL GLOBAL SOLUTIONS LIMITED"
                        }
                      },
                      error: null
                    };
                  }
                  return { data: null, error: null };
                },
                limit(val: number) {
                  return { data: [], error: null };
                }
              };
            },
            order(field: string, options?: any) {
              return {
                limit(val: number) {
                  return { data: [], error: null };
                },
                then(resolve: any) {
                  resolve({ data: [], error: null });
                }
              };
            },
            then(resolve: any) {
              resolve({ data: [], error: null });
            }
          };
        },
        insert(data: any) {
          return {
            select() {
              return {
                single() {
                  return { data: { id: "mock-inserted-id" }, error: null };
                }
              };
            },
            then(resolve: any) {
              resolve({ data: null, error: null });
            }
          };
        }
      };
    },
    async rpc(fn: string, args: any) {
      if (fn === "initialize_new_organization") {
        cookieStore.set("reol-nexus-onboarded", "true", { path: "/" });
        return { error: null };
      }
      return { error: null };
    }
  } as any;
}

export function createMockClientForRequest(request: NextRequest, response: NextResponse) {
  const session = request.cookies.get("reol-nexus-session")?.value;
  const onboarded = request.cookies.get("reol-nexus-onboarded")?.value === "true";

  return {
    auth: {
      async getUser() {
        if (session === "authenticated") {
          return {
            data: {
              user: {
                id: "mock-user-123",
                email: "ebendttl@gmail.com",
                user_metadata: { full_name: "Akinseinde Ebenezer" }
              }
            },
            error: null
          };
        }
        return { data: { user: null }, error: new Error("No session") };
      }
    },
    from(table: string) {
      return {
        select(fields: string) {
          return {
            eq(field: string, value: any) {
              return {
                single() {
                  const fullName = request.cookies.get("reol-nexus-fullname")?.value || "Akinseinde Ebenezer";
                  if (table === "profiles") {
                    return {
                      data: {
                        id: "mock-user-123",
                        full_name: fullName,
                        org_id: onboarded ? "mock-org-123" : null,
                        organizations: {
                          name: "REOL GLOBAL SOLUTIONS LIMITED"
                        }
                      },
                      error: null
                    };
                  }
                  return { data: null, error: null };
                }
              };
            }
          };
        }
      };
    }
  } as any;
}
