import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface CourseCardProps {
  course: any;
  onEnroll?: (courseId: string) => void;
  enrolled?: boolean;
}

export const CourseCard = ({ course, onEnroll, enrolled }: CourseCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {course.thumbnail_url && (
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
      )}
      <CardHeader>
        <CardTitle className="text-lg">{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {course.description}
        </p>
        {enrolled ? (
          <Button className="w-full" variant="outline">
            <BookOpen className="w-4 h-4 mr-2" />
            Continue Learning
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => onEnroll?.(course.id)}
          >
            Enroll Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
