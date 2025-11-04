import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Loader2, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    if (open && course) {
      loadCourseContent();
    }
  }, [open, course]);

  const loadCourseContent = async () => {
    setLoading(true);
    try {
      const [videosRes, notesRes] = await Promise.all([
        supabase.from("videos").select("*").eq("course_id", course.id),
        supabase.from("notes").select("*").eq("course_id", course.id)
      ]);

      if (videosRes.data) setVideos(videosRes.data);
      if (notesRes.data) setNotes(notesRes.data);

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

  const openPdfInNewTab = (url: string) => {
    window.open(url, "_blank");
    trackProgress();
  };

  useEffect(() => {
    if (activeVideo) {
      trackProgress(activeVideo.id);
    }
  }, [activeVideo]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{course?.title}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Video Section */}
            {activeVideo && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{activeVideo.title}</h3>
                <VideoPlayer videoUrl={activeVideo.video_url} title={activeVideo.title} />
                {activeVideo.description && (
                  <p className="text-sm text-muted-foreground">{activeVideo.description}</p>
                )}
              </div>
            )}

            {/* PDF Section */}
            {activePdf && !activeVideo && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {activePdf.title}
                  </h3>
                  <Button onClick={() => openPdfInNewTab(activePdf.file_url)} variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
                {activePdf.description && (
                  <p className="text-sm text-muted-foreground mb-4">{activePdf.description}</p>
                )}
                <div className="border rounded-lg overflow-hidden bg-muted/20">
                  <iframe
                    src={activePdf.file_url}
                    className="w-full h-[600px]"
                    title={activePdf.title}
                  />
                </div>
              </div>
            )}

            {/* Course Materials List */}
            {(videos.length > 1 || notes.length > 0) && (
              <div className="border-t pt-6 space-y-4">
                <h4 className="font-semibold">Course Materials</h4>
                <div className="grid gap-2">
                  {videos.map((video) => (
                    <Button
                      key={video.id}
                      variant={activeVideo?.id === video.id ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => {
                        setActiveVideo(video);
                        setActivePdf(null);
                      }}
                    >
                      {video.title}
                    </Button>
                  ))}
                  {notes.map((note) => (
                    <Button
                      key={note.id}
                      variant={activePdf?.id === note.id ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => {
                        setActivePdf(note);
                        setActiveVideo(null);
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {note.title}
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
