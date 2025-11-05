import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, TrendingUp, Users, BookOpen } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const PlatformAnalytics = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["platform-analytics"],
    queryFn: async () => {
      // Get enrollments over time (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("enrolled_at")
        .gte("enrolled_at", thirtyDaysAgo.toISOString());

      // Get payments over time
      const { data: payments } = await supabase
        .from("payments")
        .select("created_at, amount, status")
        .eq("status", "success")
        .gte("created_at", thirtyDaysAgo.toISOString());

      // Get top courses by enrollment
      const { data: courses } = await supabase
        .from("courses")
        .select(`
          id,
          title,
          enrollments (count)
        `)
        .limit(5);

      // Process enrollments by day
      const enrollmentsByDay = enrollments?.reduce((acc: any, e) => {
        const date = new Date(e.enrolled_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const enrollmentData = Object.entries(enrollmentsByDay || {}).map(([date, count]) => ({
        date,
        enrollments: count,
      }));

      // Process revenue by day
      const revenueByDay = payments?.reduce((acc: any, p) => {
        const date = new Date(p.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + Number(p.amount);
        return acc;
      }, {});

      const revenueData = Object.entries(revenueByDay || {}).map(([date, amount]) => ({
        date,
        revenue: amount,
      }));

      // Top courses data
      const topCoursesData = courses?.map(c => ({
        name: c.title,
        enrollments: c.enrollments?.[0]?.count || 0,
      })) || [];

      // Get completion stats
      const { data: allEnrollments } = await supabase
        .from("enrollments")
        .select("course_id, user_id");

      const { data: allCourses } = await supabase
        .from("courses")
        .select("id");

      const { data: progress } = await supabase
        .from("progress")
        .select("user_id, course_id, video_id, completed")
        .eq("completed", true);

      const { data: videos } = await supabase
        .from("videos")
        .select("id, course_id");

      // Calculate completion metrics
      const courseVideoCount = new Map<string, number>();
      videos?.forEach(video => {
        const count = courseVideoCount.get(video.course_id) || 0;
        courseVideoCount.set(video.course_id, count + 1);
      });

      const userCourseProgress = new Map<string, Set<string>>();
      progress?.forEach(p => {
        if (!p.video_id) return;
        const key = `${p.user_id}-${p.course_id}`;
        if (!userCourseProgress.has(key)) {
          userCourseProgress.set(key, new Set());
        }
        userCourseProgress.get(key)?.add(p.video_id);
      });

      let completedCourses = 0;
      userCourseProgress.forEach((videoIds, key) => {
        const courseId = key.split('-')[1];
        const totalVideos = courseVideoCount.get(courseId) || 0;
        if (totalVideos > 0 && videoIds.size === totalVideos) {
          completedCourses++;
        }
      });

      const totalEnrollments = allEnrollments?.length || 0;
      const completionRate = totalEnrollments > 0 
        ? Math.round((completedCourses / totalEnrollments) * 100) 
        : 0;

      let totalProgress = 0;
      let progressCount = 0;
      userCourseProgress.forEach((videoIds, key) => {
        const courseId = key.split('-')[1];
        const totalVideos = courseVideoCount.get(courseId) || 0;
        if (totalVideos > 0) {
          totalProgress += (videoIds.size / totalVideos) * 100;
          progressCount++;
        }
      });
      const avgProgress = progressCount > 0 
        ? Math.round(totalProgress / progressCount) 
        : 0;

      return {
        enrollmentData,
        revenueData,
        topCoursesData,
        totalEnrollments,
        totalCourses: allCourses?.length || 0,
        completedCourses,
        completionRate,
        avgProgress,
        activeStudents: new Set(allEnrollments?.map(e => e.user_id) || []).size,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const completionStats = [
    {
      title: "Total Enrollments",
      value: analytics?.totalEnrollments || 0,
      description: "Across all courses",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Students",
      value: analytics?.activeStudents || 0,
      description: "Unique learners",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Completed Courses",
      value: analytics?.completedCourses || 0,
      description: "Fully finished",
      icon: Trophy,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Completion Rate",
      value: `${analytics?.completionRate || 0}%`,
      description: "Of all enrollments",
      icon: TrendingUp,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Average Progress",
      value: `${analytics?.avgProgress || 0}%`,
      description: "Per student",
      icon: BookOpen,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Total Courses",
      value: analytics?.totalCourses || 0,
      description: "Available courses",
      icon: BookOpen,
      color: "text-accent-foreground",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {completionStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-none shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <CardDescription className="text-xs">
                  {stat.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Enrollments Over Time (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.enrollmentData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="enrollments" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Revenue Over Time (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.revenueData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Top 5 Courses by Enrollment</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.topCoursesData || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="enrollments"
              >
                {analytics?.topCoursesData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
