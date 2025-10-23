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
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {course.thumbnail_url && (
        <div className="relative">
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
          {enrolled && (
            <Badge className="absolute top-2 right-2 bg-green-500">
              <CheckCircle className="w-3 h-3 mr-1" />
              Enrolled
            </Badge>
          )}
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{course.title}</CardTitle>
        {showPrice && isPaid && (
          <div className="flex items-center gap-1 text-primary font-semibold">
            <DollarSign className="w-4 h-4" />
            <span>KES {Number(course.price).toLocaleString()}</span>
          </div>
        )}
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
        ) : isPaid ? (
          <PaymentButton
            contentId={course.id}
            contentType="course"
            amount={Number(course.price)}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Enroll Now - KES {Number(course.price).toLocaleString()}
          </PaymentButton>
        ) : (
          <Button
            className="w-full"
            onClick={() => onEnroll?.(course.id)}
          >
            Enroll Free
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
