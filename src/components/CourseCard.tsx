import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, DollarSign, CheckCircle, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PaymentButton } from "@/components/PaymentButton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  course: any;
  onEnroll?: (courseId: string) => void;
  enrolled?: boolean;
  showPrice?: boolean;
}

interface CourseCardProps {
  course: any;
  onEnroll?: (courseId: string) => void;
  enrolled?: boolean;
  showPrice?: boolean;
  onViewCourse?: (course: any) => void;
}

export const CourseCard = ({ course, onEnroll, enrolled, showPrice = true, onViewCourse }: CourseCardProps) => {
  const isPaid = course.price && course.price > 0;
  const [progressPercent, setProgressPercent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (enrolled) {
      fetchProgress();
    }
  }, [enrolled, course.id]);

  const fetchProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [videosRes, progressRes] = await Promise.all([
        supabase.from("videos").select("id").eq("course_id", course.id),
        supabase.from("progress").select("video_id").eq("course_id", course.id).eq("user_id", user.id).eq("completed", true)
      ]);

      const totalVideos = videosRes.data?.length || 0;
      const completedVideos = progressRes.data?.length || 0;

      if (totalVideos > 0) {
        const percent = Math.round((completedVideos / totalVideos) * 100);
        setProgressPercent(percent);
        setIsCompleted(percent === 100);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const handleCardClick = () => {
    // Navigate to course details page
    window.location.href = `/course/${course.id}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 card-hover group">
      {course.thumbnail_url && (
        <div 
          className="relative overflow-hidden cursor-pointer" 
          onClick={handleCardClick}
        >
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {enrolled && !isCompleted && (
            <Badge className="absolute top-2 right-2 bg-primary shadow-lg">
              <CheckCircle className="w-3 h-3 mr-1" />
              Enrolled
            </Badge>
          )}
          {isCompleted && (
            <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 shadow-lg">
              <Trophy className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle 
          className="text-lg line-clamp-2 group-hover:text-primary transition-colors cursor-pointer" 
          onClick={handleCardClick}
        >
          {course.title}
        </CardTitle>
        {showPrice && isPaid && (
          <div className="flex items-center gap-1 text-primary font-semibold text-sm">
            <DollarSign className="w-4 h-4" />
            <span>KES {Number(course.price).toLocaleString()}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {course.description}
        </p>
        {enrolled && progressPercent > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-semibold text-primary">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}
        {enrolled ? (
          <Button 
            className="w-full transition-all duration-300 hover:scale-105" 
            variant={isCompleted ? "default" : "outline"}
            onClick={handleCardClick}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {isCompleted ? "Review Course" : "Continue Learning"}
          </Button>
        ) : isPaid ? (
          <PaymentButton
            contentId={course.id}
            contentType="course"
            amount={Number(course.price)}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Enroll Now - KES {Number(course.price).toLocaleString()}</span>
            <span className="sm:hidden">Enroll - KES {Number(course.price).toLocaleString()}</span>
          </PaymentButton>
        ) : (
          <Button
            className="w-full transition-all duration-300 hover:scale-105"
            onClick={() => onEnroll?.(course.id)}
          >
            Enroll Free
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
