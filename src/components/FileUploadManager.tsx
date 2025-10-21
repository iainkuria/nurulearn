import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Video, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FileUploadManagerProps {
  courseId: string;
}

export const FileUploadManager = ({ courseId }: FileUploadManagerProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    file: null as File | null,
    youtubeUrl: "",
  });
  const [noteData, setNoteData] = useState({
    title: "",
    description: "",
    file: null as File | null,
  });

  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoData.file && !videoData.youtubeUrl) {
      toast({ title: "Please provide either a video file or YouTube URL", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let videoUrl = videoData.youtubeUrl;

      if (videoData.file) {
        const fileExt = videoData.file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${courseId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("course-videos")
          .upload(filePath, videoData.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("course-videos")
          .getPublicUrl(filePath);

        videoUrl = publicUrl;
      }

      const { error: insertError } = await supabase
        .from("videos")
        .insert({
          course_id: courseId,
          title: videoData.title,
          description: videoData.description,
          video_url: videoUrl,
          uploaded_by: user.id,
        });

      if (insertError) throw insertError;

      toast({ title: "Video added successfully" });
      setVideoData({ title: "", description: "", file: null, youtubeUrl: "" });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleNoteUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteData.file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = noteData.file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${courseId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("course-documents")
        .upload(filePath, noteData.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("course-documents")
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from("notes")
        .insert({
          course_id: courseId,
          title: noteData.title,
          description: noteData.description,
          file_url: publicUrl,
          file_type: noteData.file.type,
          size_bytes: noteData.file.size,
          uploaded_by: user.id,
        });

      if (insertError) throw insertError;

      toast({ title: "Note uploaded successfully" });
      setNoteData({ title: "", description: "", file: null });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Course Materials</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="video">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="video">
              <Video className="w-4 h-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="notes">
              <FileText className="w-4 h-4 mr-2" />
              Notes/PDFs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video">
            <form onSubmit={handleVideoUpload} className="space-y-4">
              <div>
                <Label htmlFor="video-title">Video Title</Label>
                <Input
                  id="video-title"
                  value={videoData.title}
                  onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="video-description">Description</Label>
                <Textarea
                  id="video-description"
                  value={videoData.description}
                  onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube-url">YouTube URL (optional)</Label>
                <Input
                  id="youtube-url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoData.youtubeUrl}
                  onChange={(e) => setVideoData({ ...videoData, youtubeUrl: e.target.value, file: null })}
                />
                <p className="text-xs text-muted-foreground">Or upload a video file below</p>
              </div>

              <div>
                <Label htmlFor="video-file">Video File</Label>
                <Input
                  id="video-file"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoData({ ...videoData, file: e.target.files?.[0] || null, youtubeUrl: "" })}
                  disabled={!!videoData.youtubeUrl}
                />
              </div>

              <Button type="submit" disabled={uploading} className="w-full">
                {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {videoData.youtubeUrl ? "Add YouTube Video" : "Upload Video"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="notes">
            <form onSubmit={handleNoteUpload} className="space-y-4">
              <div>
                <Label htmlFor="note-title">Note Title</Label>
                <Input
                  id="note-title"
                  value={noteData.title}
                  onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="note-description">Description</Label>
                <Textarea
                  id="note-description"
                  value={noteData.description}
                  onChange={(e) => setNoteData({ ...noteData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="note-file">PDF/Document File</Label>
                <Input
                  id="note-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => setNoteData({ ...noteData, file: e.target.files?.[0] || null })}
                  required
                />
              </div>

              <Button type="submit" disabled={uploading} className="w-full">
                {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Upload Note
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
