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
  const { data: progressData } = await supabase
    .from("user_progress")
    .select(
      `
      completed_lessons,
      last_accessed,
      course:course_id (
        id,
        title,
        category,
        total_lessons,
        accent_color,
        is_premium
      )
    `,
    )
    .eq("user_id", user?.id)
    .eq("is_enrolled", true)
    .order("last_accessed", { ascending: false });

  const enrolledCourses =
    progressData?.map((p: any) => ({
      ...p.course,
      completed_lessons: p.completed_lessons,
      last_accessed: p.last_accessed,
      is_enrolled: true,
    })) || [];
  const { data: myFriends } = await supabase
    .from("friends")
    .select("friend_id")
    .eq("user_id", user?.id)
    .eq("status", "accepted");

  const friendIds = myFriends?.map((f) => f.friend_id) || [];

  const { data: recentAchievements } = await supabase
    .from("user_progress")
    .select(
      `
      course_id,
      last_accessed,
      course:course_id ( title, total_lessons ),
      profiles:user_id ( full_name, avatar_url )
    `,
    )
    .in("user_id", friendIds)
    .order("last_accessed", { ascending: false })
    .limit(10);

  const completedAchievements =
    recentAchievements
      ?.filter(
        (item: any) => item.completed_lessons === item.course.total_lessons,
      )
      .slice(0, 5)
      .map((item: any) => ({
        id: item.course_id,
        title: item.course.title,
        updated_at: item.last_accessed,
        profiles: item.profiles,
      })) || [];
  return (
    <DashInfo
      profile={profile}
      tasks={tasks || []}
      courses={enrolledCourses || []}
      achievements={completedAchievements || []}
    />
  );
}
