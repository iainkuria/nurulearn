import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, FileText, Users, Plus, BarChart3 } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { CourseManager } from "@/components/CourseManager";
import { FileUploadManager } from "@/components/FileUploadManager";
import { QuizCreator } from "@/components/QuizCreator";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InstructorAnalytics } from "@/components/InstructorAnalytics";

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ courses: 0, videos: 0, materials: 0, students: 0 });
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [courses, videos, materials, enrollments] = await Promise.all([
        supabase.from("courses").select("*", { count: "exact" }).eq("instructor_id", user.id),
        supabase.from("videos").select("*", { count: "exact" }).eq("uploaded_by", user.id),
        supabase.from("notes").select("*", { count: "exact" }).eq("uploaded_by", user.id),
        supabase.from("enrollments")
          .select("*", { count: "exact" })
          .in("course_id", (await supabase.from("courses").select("id").eq("instructor_id", user.id)).data?.map(c => c.id) || []),
      ]);

      setStats({
        courses: courses.count || 0,
        videos: videos.count || 0,
        materials: materials.count || 0,
        students: enrollments.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Instructor Dashboard</h2>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>

        <Card className="mb-8 border-none shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <CardTitle>Analytics & Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <InstructorAnalytics />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">My Courses</CardTitle>
                <BookOpen className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.courses}</div>
              <p className="text-xs text-muted-foreground">Courses created</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Videos</CardTitle>
                <Video className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.videos}</div>
              <p className="text-xs text-muted-foreground">Videos uploaded</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Materials</CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.materials}</div>
              <p className="text-xs text-muted-foreground">Study materials</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.students}</div>
              <p className="text-xs text-muted-foreground">Total enrollments</p>
            </CardContent>
          </Card>
        </div>

        <CourseManager />

        <Card className="mt-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Course Content Management</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogTitle>Add Course Content</DialogTitle>
                  {selectedCourseId ? (
                    <Tabs defaultValue="files">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="files">Upload Files</TabsTrigger>
                        <TabsTrigger value="quiz">Create Quiz</TabsTrigger>
                      </TabsList>
                      <TabsContent value="files">
                        <FileUploadManager courseId={selectedCourseId} />
                      </TabsContent>
                      <TabsContent value="quiz">
                        <QuizCreator courseId={selectedCourseId} onSuccess={() => setDialogOpen(false)} />
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      Please select a course first to add content
                    </p>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Select a course from the list above, then click "Add Content" to upload videos, notes, or create quizzes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstructorDashboard;