import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("dummy-project-id") ||
  process.env.NEXT_PUBLIC_SUPABASE_URL === "";

function createMockQueryBuilder(table: string, cookieStoreOrRequest: any, isMiddleware = false) {
  const getCookie = (name: string) => {
    if (isMiddleware) {
      return cookieStoreOrRequest.cookies.get(name)?.value;
    } else {
      return cookieStoreOrRequest.get(name)?.value;
    }
  };

  const fullName = getCookie("reol-nexus-fullname") || "Akinseinde Ebenezer";
  const onboarded = getCookie("reol-nexus-onboarded") === "true";

  let isSingle = false;
  let isInsert = false;

  let mockData: any = [];
  if (table === "profiles") {
    mockData = {
      id: "mock-user-123",
      full_name: fullName,
      org_id: onboarded ? "mock-org-123" : null,
      organizations: {
        name: "REOL GLOBAL SOLUTIONS LIMITED"
      }
    };
  } else if (table === "business_units") {
    mockData = [
      { id: "bu1", name: "Event Center", org_id: "mock-org-123" },
      { id: "bu2", name: "Eatery", org_id: "mock-org-123" },
      { id: "bu3", name: "Laundry", org_id: "mock-org-123" },
    ];
  } else {
    mockData = [];
  }

  const builder: any = {
    select(fields?: string) {
      return builder;
    },
    eq(field: string, value: any) {
      return builder;
    },
    order(field: string, options?: any) {
      return builder;
    },
    limit(val: number) {
      return builder;
    },
    single() {
      isSingle = true;
      return builder;
    },
    insert(data: any) {
      isInsert = true;
      return builder;
    },
    then(resolve: any) {
      let resolvedData = mockData;
      if (isInsert) {
        resolvedData = { id: "mock-inserted-id" };
      }
      
      const result = {
        data: isSingle ? (Array.isArray(resolvedData) ? resolvedData[0] || null : resolvedData) : resolvedData,
        error: null
      };
      
      if (resolve) {
        resolve(result);
      }
      return Promise.resolve(result);
    }
  };

  return builder;
}

export async function createMockClient() {
  const cookieStore = await cookies();
  const session = cookieStore.get("reol-nexus-session")?.value;

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
      return createMockQueryBuilder(table, cookieStore, false);
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
      return createMockQueryBuilder(table, request, true);
    }
  } as any;
}
