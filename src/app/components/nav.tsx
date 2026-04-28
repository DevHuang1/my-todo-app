import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url, username")
    .eq("id", user.id)
    .single();

  const displayName = profile?.username || "user";
  const userImage =
    profile?.avatar_url || "https://www.gravatar.com/avatar/?d=mp";

  return (
    <NavbarClient
      user={{ email: user.email }}
      displayName={displayName}
      userImage={userImage}
    />
  );
}
