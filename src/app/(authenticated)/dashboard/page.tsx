import { createClient } from "@/utils/supabase/server";

import { cookies } from "next/headers";
import DashInfo from "@/app/components/dashInfo";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user?.id);
  const { data: courses } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user?.id);

  return (
    <DashInfo profile={profile} tasks={tasks || []} courses={courses || []} />
  );
}
