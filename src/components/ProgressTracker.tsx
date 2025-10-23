import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ProgressTrackerProps {
  courseId: string;
  videos: any[];
  completedVideoIds: string[];
  onProgressUpdate: () => void;
}

export const ProgressTracker = ({ courseId, videos, completedVideoIds, onProgressUpdate }: ProgressTrackerProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const progressPercent = videos.length > 0 
    ? Math.round((completedVideoIds.length / videos.length) * 100)
    : 0;

  const markComplete = async (videoId: string, completed: boolean) => {
    setLoading(videoId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (completed) {
        // Mark as incomplete
        await supabase
          .from("progress")
          .delete()
          .eq("user_id", user.id)
          .eq("video_id", videoId);
      } else {
        // Mark as complete
        await supabase
          .from("progress")
          .upsert({
            user_id: user.id,
            course_id: courseId,
            video_id: videoId,
            completed: true,
            completed_at: new Date().toISOString(),
          });
      }

      toast({
        title: completed ? "Marked as incomplete" : "Lesson completed!",
        description: completed ? "Keep up the good work!" : "Great progress!",
      });

      onProgressUpdate();
    } catch (error: any) {
      toast({
        title: "Error updating progress",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Course Progress</span>
          <span className="text-primary">{progressPercent}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progressPercent} className="h-3" />
        <div className="text-sm text-muted-foreground">
          {completedVideoIds.length} of {videos.length} lessons completed
        </div>

        <div className="space-y-2 mt-4">
          {videos.map((video) => {
            const isCompleted = completedVideoIds.includes(video.id);
            return (
              <div
                key={video.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className={isCompleted ? "text-muted-foreground" : ""}>
                    {video.title}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={loading === video.id}
                  onClick={() => markComplete(video.id, isCompleted)}
                >
                  {isCompleted ? "Undo" : "Complete"}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
