import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, DollarSign, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PaymentButton } from "@/components/PaymentButton";

interface CourseCardProps {
  course: any;
  onEnroll?: (courseId: string) => void;
  enrolled?: boolean;
  showPrice?: boolean;
}

export const CourseCard = ({ course, onEnroll, enrolled, showPrice = true }: CourseCardProps) => {
  const isPaid = course.price && course.price > 0;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 card-hover group">
      {course.thumbnail_url && (
        <div className="relative overflow-hidden">
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {enrolled && (
            <Badge className="absolute top-2 right-2 bg-primary shadow-lg">
              <CheckCircle className="w-3 h-3 mr-1" />
              Enrolled
            </Badge>
          )}
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">{course.title}</CardTitle>
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
        {enrolled ? (
          <Button className="w-full transition-all duration-300 hover:scale-105" variant="outline">
            <BookOpen className="w-4 h-4 mr-2" />
            Continue Learning
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
