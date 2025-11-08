import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, FileText, Trophy, Award } from "lucide-react";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { CourseCard } from "@/components/CourseCard";
import { CourseViewer } from "@/components/CourseViewer";
import { useToast } from "@/hooks/use-toast";
import { PaymentHistory } from "@/components/PaymentHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Users, Star, TrendingUp } from "lucide-react";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({ enrolled: 0, videos: 0, quizzes: 0, avgScore: 0, completed: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [platformStats, setPlatformStats] = useState({
    activeStudents: 0,
    totalCourses: 0,
    averageRating: 4.8,
    completionRate: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Auto-refresh platform stats every 30 seconds
    const interval = setInterval(() => {
      fetchPlatformStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchPlatformStats = async () => {
    try {
      const [coursesRes, enrollmentsRes, progressRes] = await Promise.all([
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("enrollments").select("user_id"),
        supabase.from("progress").select("*"),
      ]);

      const totalCourses = coursesRes.count || 0;
      const uniqueStudents = new Set(enrollmentsRes.data?.map((e: any) => e.user_id)).size;
      
      const totalProgress = progressRes.data?.length || 0;
      const completedProgress = progressRes.data?.filter((p: any) => p.completed).length || 0;
      const completionRate = totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0;

      setPlatformStats({
        activeStudents: uniqueStudents,
        totalCourses,
        averageRating: 4.8,
        completionRate: Math.round(completionRate),
      });
    } catch (error: any) {
      console.error("Error loading platform stats:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchCourses(), fetchPlatformStats()]);
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

      const [videos, quizzes, progress] = await Promise.all([
        supabase.from("videos").select("*", { count: "exact" }).in("course_id", enrolledIds.length ? enrolledIds : ['']),
        supabase.from("quizzes").select("*", { count: "exact" }).in("course_id", enrolledIds.length ? enrolledIds : ['']),
        supabase.from("progress").select("course_id, video_id, completed").eq("user_id", user.id).eq("completed", true).in("course_id", enrolledIds.length ? enrolledIds : [''])
      ]);

      // Count completed courses (all videos watched)
      const { data: allVideos } = await supabase
        .from("videos")
        .select("id, course_id")
        .in("course_id", enrolledIds.length ? enrolledIds : ['']);

      const courseVideoCount = new Map<string, number>();
      allVideos?.forEach(video => {
        const count = courseVideoCount.get(video.course_id) || 0;
        courseVideoCount.set(video.course_id, count + 1);
      });

      const userCourseProgress = new Map<string, Set<string>>();
      progress.data?.forEach(p => {
        if (!p.video_id) return;
        if (!userCourseProgress.has(p.course_id)) {
          userCourseProgress.set(p.course_id, new Set());
        }
        userCourseProgress.get(p.course_id)?.add(p.video_id);
      });

      let completedCourses = 0;
      userCourseProgress.forEach((videoIds, courseId) => {
        const totalVideos = courseVideoCount.get(courseId) || 0;
        if (totalVideos > 0 && videoIds.size === totalVideos) {
          completedCourses++;
        }
      });

      const avgScore = quizResults.data && quizResults.data.length > 0
        ? quizResults.data.reduce((sum, r) => sum + (r.percent || 0), 0) / quizResults.data.length
        : 0;

      setStats({
        enrolled: enrollments.count || 0,
        videos: videos.count || 0,
        quizzes: quizzes.count || 0,
        avgScore: Math.round(avgScore),
        completed: completedCourses,
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

  const handleViewCourse = (course: any) => {
    setSelectedCourse(course);
    setViewerOpen(true);
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

            {/* Platform Statistics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6 animate-fade-in">
              <Card className="border-none shadow-md bg-gradient-to-br from-primary/10 to-primary/5 hover:shadow-lg transition-all duration-300 card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Students
                    </CardTitle>
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    <AnimatedCounter end={platformStats.activeStudents} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Currently enrolled</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-gradient-to-br from-blue-500/10 to-blue-500/5 hover:shadow-lg transition-all duration-300 card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Courses Available
                    </CardTitle>
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    <AnimatedCounter end={platformStats.totalCourses} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Real learning resources</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-gradient-to-br from-green-500/10 to-green-500/5 hover:shadow-lg transition-all duration-300 card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Platform Rating
                    </CardTitle>
                    <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    <AnimatedCounter end={platformStats.averageRating} decimals={1} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Quality focused</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-gradient-to-br from-orange-500/10 to-orange-500/5 hover:shadow-lg transition-all duration-300 card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Success Rate
                    </CardTitle>
                    <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    <AnimatedCounter end={platformStats.completionRate} suffix="%" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Course completion</p>
                </CardContent>
              </Card>
            </div>

            {/* Personal Statistics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8 animate-fade-in-up">
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
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <Trophy className="w-4 h-4 text-green-600 dark:text-green-400 icon-hover" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
                  <p className="text-xs text-muted-foreground">Courses finished</p>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Videos Available</CardTitle>
                    <Video className="w-4 h-4 text-muted-foreground icon-hover" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.videos}</div>
                  <p className="text-xs text-muted-foreground">Learning materials</p>
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="enrolled" className="transition-all duration-300">My Courses</TabsTrigger>
                <TabsTrigger value="completed" className="transition-all duration-300">Completed</TabsTrigger>
                <TabsTrigger value="available" className="transition-all duration-300">Browse</TabsTrigger>
                <TabsTrigger value="payments" className="transition-all duration-300">Payments</TabsTrigger>
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
                        onViewCourse={handleViewCourse}
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

              <TabsContent value="completed" className="animate-fade-in">
                <Card className="card-hover">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <Trophy className="w-5 h-5 text-green-600 dark:text-green-400 icon-hover" />
                      </div>
                      <div>
                        <CardTitle>Completed Courses</CardTitle>
                        <CardDescription>Courses you've finished - well done!</CardDescription>
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
                    ) : stats.completed > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {myCourses.map((course) => (
                          <CourseCard
                            key={course.id}
                            course={course}
                            enrolled={true}
                            showPrice={false}
                            onViewCourse={handleViewCourse}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No completed courses yet.</p>
                        <p className="text-sm mt-2">Keep learning to earn your first completion badge!</p>
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
                        onViewCourse={enrolledCourses.has(course.id) ? handleViewCourse : undefined}
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

      <CourseViewer 
        course={selectedCourse} 
        open={viewerOpen} 
        onOpenChange={setViewerOpen} 
      />
    </div>
  );
};

export default StudentDashboard;