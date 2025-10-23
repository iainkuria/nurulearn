import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

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

      return {
        enrollmentData,
        revenueData,
        topCoursesData,
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

  return (
    <div className="space-y-6">
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
