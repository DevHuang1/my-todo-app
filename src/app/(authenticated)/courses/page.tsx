// app/courses/page.tsx
import CoursesPage from "@/app/components/coursePage";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Database fetch error:", error);
  }

  return <CoursesPage courses={courses || []} />;
}
