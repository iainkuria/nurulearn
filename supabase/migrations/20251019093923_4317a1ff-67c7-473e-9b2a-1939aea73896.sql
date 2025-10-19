-- Create storage buckets for course content
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('course-videos', 'course-videos', false),
  ('course-thumbnails', 'course-thumbnails', true),
  ('course-documents', 'course-documents', false);

-- Storage policies for videos (private - only enrolled students)
CREATE POLICY "Enrolled users can view videos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'course-videos' AND (
    EXISTS (
      SELECT 1 FROM public.videos v
      JOIN public.enrollments e ON v.course_id = e.course_id
      WHERE v.video_url LIKE '%' || storage.objects.name AND e.user_id = auth.uid()
    ) OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'instructor')
  )
);

CREATE POLICY "Instructors can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-videos' AND (
    public.has_role(auth.uid(), 'instructor') OR 
    public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Instructors can delete own videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-videos' AND (
    public.has_role(auth.uid(), 'instructor') OR 
    public.has_role(auth.uid(), 'admin')
  )
);

-- Storage policies for thumbnails (public)
CREATE POLICY "Anyone can view thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-thumbnails');

CREATE POLICY "Instructors can upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-thumbnails' AND (
    public.has_role(auth.uid(), 'instructor') OR 
    public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Instructors can delete thumbnails"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-thumbnails' AND (
    public.has_role(auth.uid(), 'instructor') OR 
    public.has_role(auth.uid(), 'admin')
  )
);

-- Storage policies for documents (private - only enrolled students)
CREATE POLICY "Enrolled users can view documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'course-documents' AND (
    EXISTS (
      SELECT 1 FROM public.notes n
      JOIN public.enrollments e ON n.course_id = e.course_id
      WHERE n.file_url LIKE '%' || storage.objects.name AND e.user_id = auth.uid()
    ) OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'instructor')
  )
);

CREATE POLICY "Instructors can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-documents' AND (
    public.has_role(auth.uid(), 'instructor') OR 
    public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Instructors can delete documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-documents' AND (
    public.has_role(auth.uid(), 'instructor') OR 
    public.has_role(auth.uid(), 'admin')
  )
);