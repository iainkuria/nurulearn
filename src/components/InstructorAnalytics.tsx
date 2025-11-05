import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const InstructorAnalytics = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["instructor-analytics"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get instructor's courses
      const { data: courses } = await supabase
        .from("courses")
        .select("id")
        .eq("instructor_id", user.id);

      const courseIds = courses?.map(c => c.id) || [];

      // Get enrollments
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("*")
        .in("course_id", courseIds.length ? courseIds : ['']);

      // Get revenue from payments
      const { data: payments } = await supabase
        .from("payments")
        .select("amount")
        .eq("status", "success")
        .in("content_id", courseIds.length ? courseIds : [''])
        .eq("content_type", "course");

      // Get completion stats
      const { data: progress } = await supabase
        .from("progress")
        .select("user_id, course_id, completed")
        .in("course_id", courseIds.length ? courseIds : [''])
        .eq("completed", true);

      // Calculate completion rate
      const totalEnrollments = enrollments?.length || 0;
      const uniqueCompletions = new Set(progress?.map(p => `${p.user_id}-${p.course_id}`) || []).size;
      const completionRate = totalEnrollments > 0 ? Math.round((uniqueCompletions / totalEnrollments) * 100) : 0;

      const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const avgRevenuePerCourse = courseIds.length > 0 ? totalRevenue / courseIds.length : 0;

      return {
        totalRevenue,
        totalEnrollments,
        avgRevenuePerCourse,
        totalCourses: courseIds.length,
        completionRate,
      };
    },
  });

  const stats = [
    {
      title: "Total Revenue",
      value: `KES ${analytics?.totalRevenue.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Enrollments",
      value: analytics?.totalEnrollments || 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Courses",
      value: analytics?.totalCourses || 0,
      icon: BookOpen,
      color: "text-accent-foreground",
      bgColor: "bg-accent/10",
    },
    {
      title: "Completion Rate",
      value: `${analytics?.completionRate || 0}%`,
      icon: TrendingUp,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
