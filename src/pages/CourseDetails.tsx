import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Download, Video, CheckCircle2, Lock, User, ArrowLeft, ChevronRight, Home } from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CourseViewer } from "@/components/CourseViewer";
import { PaymentButton } from "@/components/PaymentButton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<any>(null);
  const [instructor, setInstructor] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [relatedCourses, setRelatedCourses] = useState<any[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadCourseData();
    }
  }, [id, user]);

  const loadCourseData = async () => {
    try {
      setLoading(true);

      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch instructor details
      if (courseData.instructor_id) {
        const { data: instructorData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", courseData.instructor_id)
          .single();
        
        setInstructor(instructorData);
      }

      // Check enrollment status
      if (user) {
        const { data: enrollmentData } = await supabase
          .from("enrollments")
          .select("*")
          .eq("user_id", user.id)
          .eq("course_id", id)
          .maybeSingle();

        setIsEnrolled(!!enrollmentData);

        if (enrollmentData) {
          // Fetch videos and notes
          const [videosRes, notesRes, progressRes] = await Promise.all([
            supabase.from("videos").select("*").eq("course_id", id).order("created_at"),
            supabase.from("notes").select("*").eq("course_id", id).order("created_at"),
            supabase.from("progress").select("*").eq("user_id", user.id).eq("course_id", id)
          ]);

          setVideos(videosRes.data || []);
          setNotes(notesRes.data || []);
          setProgress(progressRes.data || []);

          // Calculate progress
          const totalItems = (videosRes.data?.length || 0);
          const completedItems = progressRes.data?.filter((p: any) => p.completed).length || 0;
          setProgressPercent(totalItems > 0 ? (completedItems / totalItems) * 100 : 0);
        }
      }

      // Fetch related courses (same instructor or random)
      const { data: related } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .neq("id", id)
        .limit(3);
      
      setRelatedCourses(related || []);

    } catch (error: any) {
      toast({
        title: "Error loading course",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from("enrollments")
        .insert({ user_id: user.id, course_id: id });

      if (error) throw error;

      toast({ title: "Successfully enrolled in course!" });
      loadCourseData();
    } catch (error: any) {
      toast({
        title: "Enrollment failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownloadNotes = async (note: any) => {
    try {
      // Try to open in new tab first
      const newTab = window.open(note.file_url, '_blank');
      
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        // If popup blocked, fall back to download
        const link = document.createElement("a");
        link.href = note.file_url;
        link.download = note.title || 'course-material.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({ title: "Download started" });
      } else {
        toast({ title: "Opening resource in new tab" });
      }
    } catch (error: any) {
      toast({
        title: "Could not open resource",
        description: "Please check your browser settings and try again",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-[400px] w-full rounded-lg" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const completedLessons = progress.filter((p) => p.completed).length;
  const totalLessons = videos.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard" className="hover:text-primary transition-colors">
                  Courses
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary font-medium">
                {course?.title || "Course Details"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            {/* Course Header */}
            <Card className="border-none shadow-lg overflow-hidden">
              <div className="relative">
                {course.thumbnail_url && (
                  <div className="w-full h-[400px] relative overflow-hidden">
                    {isEnrolled ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative">
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-full h-full object-cover blur-sm"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Lock className="w-16 h-16 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                    </div>
                    <CardTitle className="text-3xl mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {course.description}
                    </CardDescription>
                  </div>
                  {course.is_free ? (
                    <Badge variant="secondary" className="text-sm">Free</Badge>
                  ) : (
                    <Badge className="text-sm">KES {course.price}</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {isEnrolled && totalLessons > 0 && (
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Your Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {completedLessons} / {totalLessons} lessons
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {progressPercent.toFixed(0)}% complete
                    </p>
                  </div>
                )}

                {!isEnrolled && (
                  <div className="space-y-4">
                    {course.is_free ? (
                      <Button onClick={handleEnroll} className="w-full" size="lg">
                        Enroll Free
                      </Button>
                    ) : (
                      <PaymentButton
                        contentId={course.id}
                        contentType="course"
                        amount={parseFloat(course.price)}
                      >
                        Enroll Now - KES {course.price}
                      </PaymentButton>
                    )}
                  </div>
                )}

                {isEnrolled && (
                  <Button onClick={() => setViewerOpen(true)} className="w-full" size="lg">
                    {progressPercent === 100 ? "Review Course" : "Continue Learning"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Course Materials */}
            {isEnrolled && (
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Course Materials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {videos.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Videos ({videos.length})
                      </h4>
                      <div className="space-y-2">
                        {videos.map((video, index) => {
                          const isCompleted = progress.some(
                            (p) => p.video_id === video.id && p.completed
                          );
                          return (
                            <div
                              key={video.id}
                              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                                )}
                                <span className="font-medium">
                                  {index + 1}. {video.title}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {notes.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Downloadable Resources ({notes.length})
                      </h4>
                      <div className="space-y-2">
                        {notes.map((note) => (
                          <div
                            key={note.id}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <span className="font-medium">{note.title}</span>
                            <Button variant="outline" size="sm" asChild>
                              <a href={note.file_url} target="_blank" rel="noopener">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {videos.length === 0 && notes.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
                      No materials available yet
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {/* Instructor Card */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{instructor?.name || "Instructor"}</p>
                    <p className="text-sm text-muted-foreground">Course Instructor</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <p className="text-sm text-muted-foreground">
                  Expert educator dedicated to helping students succeed through quality content and engaging learning experiences.
                </p>
              </CardContent>
            </Card>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Related Courses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedCourses.map((related) => (
                    <div
                      key={related.id}
                      className="group cursor-pointer"
                      onClick={() => navigate(`/course/${related.id}`)}
                    >
                      <div className="relative h-32 rounded-lg overflow-hidden mb-2">
                        <img
                          src={related.thumbnail_url || "/placeholder.svg"}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {related.title}
                      </h4>
                      {related.is_free ? (
                        <Badge variant="secondary" className="text-xs mt-1">Free</Badge>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1">
                          KES {related.price}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Course Viewer Modal */}
      {isEnrolled && course && (
        <CourseViewer
          course={course}
          open={viewerOpen}
          onOpenChange={setViewerOpen}
        />
      )}
    </div>
  );
}
