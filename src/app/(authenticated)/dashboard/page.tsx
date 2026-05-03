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
  const { data: myFriends } = await supabase
    .from("friends")
    .select("friend_id")
    .eq("user_id", user?.id)
    .eq("status", "accepted");

  const friendIds = myFriends?.map((f) => f.friend_id) || [];

  const { data: recentAchievements } = await supabase
    .from("courses")
    .select(
      `
    id,
    title,
    updated_at,
    profiles:user_id (full_name, avatar_url)
  `,
    )
    .in("user_id", friendIds)
    .filter("completed_lessons", "eq", "total_lessons") // Only fully finished
    .order("updated_at", { ascending: false })
    .limit(5);
  return (
    <DashInfo
      profile={profile}
      tasks={tasks || []}
      courses={enrolledCourses || []}
      achievements={recentAchievements || []}
    />
  );
}
