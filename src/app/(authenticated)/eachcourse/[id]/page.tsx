import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

import { cookies } from "next/headers";
import CourseClientPage from "@/app/components/courseClient";

export default async function CoursePage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { id } = params;

  // Fetch Course + Lessons in one join query
  const { data: course, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      lessons (*)
    `,
    )
    .eq("id", id)
    .single();

  if (error || !course) {
    return notFound();
  }

  // Sort lessons by order_index
  const sortedLessons = course.lessons.sort(
    (a: any, b: any) => a.order_index - b.order_index,
  );

  return <CourseClientPage course={{ ...course, lessons: sortedLessons }} />;
}
