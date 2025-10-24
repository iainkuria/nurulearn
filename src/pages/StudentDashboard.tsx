import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, FileText, Trophy, Award } from "lucide-react";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { CourseCard } from "@/components/CourseCard";
import { useToast } from "@/hooks/use-toast";
import { PaymentHistory } from "@/components/PaymentHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({ enrolled: 0, videos: 0, quizzes: 0, avgScore: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchCourses()]);
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [enrollments, quizResults] = await Promise.all([
        supabase.from("enrollments").select("*", { count: "exact" }).eq("user_id", user.id),
        supabase.from("quiz_results").select("percent").eq("user_id", user.id),
      ]);

      const enrolledIds = enrollments.data?.map(e => e.course_id) || [];
      setEnrolledCourses(new Set(enrolledIds));

      // Fetch enrolled courses with details
      if (enrolledIds.length > 0) {
        const { data: enrolledCoursesData } = await supabase
          .from("courses")
          .select("*")
          .in("id", enrolledIds);
        setMyCourses(enrolledCoursesData || []);
      }

      const [videos, quizzes] = await Promise.all([
        supabase.from("videos").select("*", { count: "exact" }).in("course_id", enrolledIds.length ? enrolledIds : ['']),
        supabase.from("quizzes").select("*", { count: "exact" }).in("course_id", enrolledIds.length ? enrolledIds : ['']),
      ]);

      const avgScore = quizResults.data && quizResults.data.length > 0
        ? quizResults.data.reduce((sum, r) => sum + (r.percent || 0), 0) / quizResults.data.length
        : 0;

      setStats({
        enrolled: enrollments.count || 0,
        videos: videos.count || 0,
        quizzes: quizzes.count || 0,
        avgScore: Math.round(avgScore),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading courses",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // For demo purposes, allow free enrollment
      const { error } = await supabase
        .from("enrollments")
        .insert({ user_id: user.id, course_id: courseId });

      if (error) {
        if (error.code === '23505') {
          toast({ title: "Already enrolled in this course" });
        } else {
          throw error;
        }
      } else {
        toast({ title: "Successfully enrolled!" });
        fetchData();
      }
    } catch (error: any) {
      toast({
        title: "Enrollment failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="mb-8 animate-fade-in">
              <h2 className="text-3xl font-bold mb-2">Student Dashboard</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-fade-in-up">
              <Card className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                    <BookOpen className="w-4 h-4 text-muted-foreground icon-hover" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.enrolled}</div>
                  <p className="text-xs text-muted-foreground">Active enrollments</p>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Videos Watched</CardTitle>
                    <Video className="w-4 h-4 text-muted-foreground icon-hover" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.videos}</div>
                  <p className="text-xs text-muted-foreground">Available videos</p>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
                    <FileText className="w-4 h-4 text-muted-foreground icon-hover" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.quizzes}</div>
                  <p className="text-xs text-muted-foreground">Available quizzes</p>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Avg Quiz Score</CardTitle>
                    <Trophy className="w-4 h-4 text-muted-foreground icon-hover" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgScore}%</div>
                  <p className="text-xs text-muted-foreground">Overall performance</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="enrolled" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="enrolled" className="transition-all duration-300">My Courses</TabsTrigger>
                <TabsTrigger value="available" className="transition-all duration-300">Browse Courses</TabsTrigger>
                <TabsTrigger value="payments" className="transition-all duration-300">Payment History</TabsTrigger>
              </TabsList>

              <TabsContent value="enrolled" className="animate-fade-in">
                <Card className="card-hover">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <BookOpen className="w-5 h-5 text-primary icon-hover" />
                  </div>
                  <div>
                    <CardTitle>My Enrolled Courses</CardTitle>
                    <CardDescription>Continue your learning journey</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-64 w-full" />
                    ))}
                  </div>
                ) : myCourses.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {myCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        enrolled={true}
                        showPrice={false}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>You haven't enrolled in any courses yet.</p>
                    <p className="text-sm mt-2">Browse available courses to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

              <TabsContent value="available" className="animate-fade-in">
                <Card className="card-hover">
              <CardHeader>
                <CardTitle>Available Courses</CardTitle>
                <CardDescription>Browse and enroll in courses</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-64 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        enrolled={enrolledCourses.has(course.id)}
                        onEnroll={handleEnroll}
                      />
                    ))}
                  </div>
                )}
                {!loading && courses.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No courses available yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

              <TabsContent value="payments" className="animate-fade-in">
                <PaymentHistory />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;