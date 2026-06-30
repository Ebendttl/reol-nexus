"use server";

import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password || !fullName) {
    return { error: "Full name, email, and password are required" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/onboarding");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function onboardingAction(formData: FormData) {
  const orgName = formData.get("orgName") as string;
  const ownerName = formData.get("ownerName") as string;
  const ownerPhone = formData.get("ownerPhone") as string;

  if (!orgName || !ownerName) {
    return { error: "Organization name and owner name are required" };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Authentication required" };
  }

  // Call the Postgres RPC function we created in the migration
  const { error: orgError } = await supabase.rpc(
    "initialize_new_organization",
    {
      p_org_name: orgName,
      p_owner_id: user.id,
      p_owner_name: ownerName,
      p_owner_phone: ownerPhone || null,
    }
  );

  if (orgError) {
    return { error: orgError.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
