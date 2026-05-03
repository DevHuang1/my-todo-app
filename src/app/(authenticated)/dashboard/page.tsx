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
  const { data: enrolledCourses } = await supabase
    .from("courses")
    .select("*")
    .eq("is_enrolled", true)
    .order("last_accessed", { ascending: false });

  return (
    <DashInfo
      profile={profile}
      tasks={tasks || []}
      courses={enrolledCourses || []}
    />
  );
}
