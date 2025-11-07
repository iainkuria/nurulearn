import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Loader2, FileText, ExternalLink, Download, Trophy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProgressTracker } from "@/components/ProgressTracker";
import { Badge } from "@/components/ui/badge";

interface CourseViewerProps {
  course: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CourseViewer = ({ course, open, onOpenChange }: CourseViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [activePdf, setActivePdf] = useState<any>(null);
  const [completedVideoIds, setCompletedVideoIds] = useState<string[]>([]);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && course) {
      loadCourseContent();
    }
  }, [open, course]);

  const loadCourseContent = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const [videosRes, notesRes, progressRes] = await Promise.all([
        supabase.from("videos").select("*").eq("course_id", course.id),
        supabase.from("notes").select("*").eq("course_id", course.id),
        user ? supabase.from("progress").select("*").eq("course_id", course.id).eq("user_id", user.id).eq("completed", true) : null
      ]);

      if (videosRes.data) setVideos(videosRes.data);
      if (notesRes.data) setNotes(notesRes.data);
      
      const completedIds = progressRes?.data?.map(p => p.video_id).filter(Boolean) || [];
      setCompletedVideoIds(completedIds);
      
      // Check if course is fully completed
      if (videosRes.data && videosRes.data.length > 0) {
        setCourseCompleted(completedIds.length === videosRes.data.length);
      }

      // Auto-select first video or PDF
      if (videosRes.data && videosRes.data.length > 0) {
        setActiveVideo(videosRes.data[0]);
      } else if (notesRes.data && notesRes.data.length > 0) {
        setActivePdf(notesRes.data[0]);
      }
    } catch (error) {
      console.error("Error loading course content:", error);
      toast({
        title: "Error",
        description: "Failed to load course content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const trackProgress = async (videoId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("progress").upsert({
        user_id: user.id,
        course_id: course.id,
        video_id: videoId || null,
        completed: false
      });
    } catch (error) {
      console.error("Error tracking progress:", error);
    }
  };

  const handleDownload = async (note: any) => {
    try {
      // Try to open PDF in new tab for viewing
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
        
        toast({ 
          title: "Download started",
          description: "If the file doesn't open, check your downloads folder"
        });
      } else {
        toast({ 
          title: "Opening PDF",
          description: "Your resource has opened in a new tab"
        });
      }
      
      // Track progress for PDF viewing
      trackProgress();
    } catch (error: any) {
      toast({
        title: "Could not open resource",
        description: "Please check your browser settings and try again",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (activeVideo) {
      trackProgress(activeVideo.id);
    }
  }, [activeVideo]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
        <DialogHeader className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl md:text-3xl font-bold">{course?.title}</DialogTitle>
              {course?.description && (
                <DialogDescription className="text-base mt-2">{course.description}</DialogDescription>
              )}
            </div>
            {courseCompleted && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white gap-1 px-3 py-1">
                <Trophy className="w-4 h-4" />
                Completed
              </Badge>
            )}
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Video Section */}
            {activeVideo && (
              <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg md:text-xl font-semibold">{activeVideo.title}</h3>
                  {completedVideoIds.includes(activeVideo.id) && (
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Watched
                    </Badge>
                  )}
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <VideoPlayer videoUrl={activeVideo.video_url} title={activeVideo.title} />
                </div>
                {activeVideo.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{activeVideo.description}</p>
                )}
              </div>
            )}

            {/* PDF Section */}
            {activePdf && !activeVideo && (
              <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between gap-3 p-4 rounded-lg bg-muted/50 border">
                  <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="w-5 h-5 flex-shrink-0 text-primary" />
                    <span className="truncate">{activePdf.title}</span>
                  </h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <a href={activePdf.file_url} target="_blank" rel="noopener">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Open in New Tab</span>
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={activePdf.file_url} download>
                        <Download className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    </Button>
                  </div>
                </div>
                {activePdf.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed px-1">{activePdf.description}</p>
                )}
                <div className="border rounded-xl overflow-hidden bg-muted/20 shadow-lg">
                  {loading ? (
                    <div className="flex items-center justify-center h-[600px]">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <iframe
                      src={activePdf.file_url}
                      className="w-full h-[600px]"
                      title={activePdf.title}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Progress Tracker */}
            {videos.length > 0 && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-100">
                <ProgressTracker 
                  courseId={course.id}
                  videos={videos}
                  completedVideoIds={completedVideoIds}
                  onProgressUpdate={loadCourseContent}
                />
              </div>
            )}

            {/* Course Materials List */}
            {(videos.length > 1 || notes.length > 0) && (
              <div className="border-t pt-6 space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-150">
                <h4 className="font-semibold text-lg">Course Materials</h4>
                <div className="grid gap-2">
                  {videos.map((video) => {
                    const isCompleted = completedVideoIds.includes(video.id);
                    return (
                      <Button
                        key={video.id}
                        variant={activeVideo?.id === video.id ? "default" : "outline"}
                        className="justify-start gap-2 h-auto py-3 transition-all duration-200 hover:scale-[1.02]"
                        onClick={() => {
                          setActiveVideo(video);
                          setActivePdf(null);
                        }}
                      >
                        {isCompleted && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                        <span className="text-left flex-1">{video.title}</span>
                      </Button>
                    );
                  })}
                  {notes.map((note) => (
                    <Button
                      key={note.id}
                      variant={activePdf?.id === note.id ? "default" : "outline"}
                      className="justify-start gap-2 h-auto py-3 transition-all duration-200 hover:scale-[1.02]"
                      onClick={() => {
                        setActivePdf(note);
                        setActiveVideo(null);
                      }}
                    >
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="text-left flex-1">{note.title}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {videos.length === 0 && notes.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No course materials available yet.
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
