import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const PendingApprovals = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingCourses, isLoading } = useQuery({
    queryKey: ["pending-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase
        .from("courses")
        .update({ is_published: true })
        .eq("id", courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Course approved successfully" });
      queryClient.invalidateQueries({ queryKey: ["pending-courses"] });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to approve course",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Course rejected and removed" });
      queryClient.invalidateQueries({ queryKey: ["pending-courses"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to reject course",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <ClipboardList className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Review and approve course submissions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : pendingCourses?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No pending approvals</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingCourses?.map((course) => (
              <Card key={course.id} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        <Badge variant="secondary">Draft</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {course.description || "No description provided"}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Instructor: <strong>Course Owner</strong></span>
                        <span>Submitted: {new Date(course.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveMutation.mutate(course.id)}
                        disabled={approveMutation.isPending}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectMutation.mutate(course.id)}
                        disabled={rejectMutation.isPending}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
