import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserPlus, UserMinus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const RoleManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "instructor" | "student">("student");

  const { data: profiles } = useQuery({
    queryKey: ["profiles-for-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "admin" | "instructor" | "student" }) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Role assigned successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setUserId("");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to assign role",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const revokeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "admin" | "instructor" | "student" }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role as any);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Role revoked successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to revoke role",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAssignRole = () => {
    if (!userId) {
      toast({ title: "Please select a user", variant: "destructive" });
      return;
    }
    assignRoleMutation.mutate({ userId, role: selectedRole });
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Role Management</CardTitle>
            <CardDescription>Assign or revoke user roles</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-select">Select User</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger id="user-select">
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {profiles?.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name} ({profile.id.slice(0, 8)}...)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role-select">Role</Label>
            <Select value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)}>
              <SelectTrigger id="role-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="instructor">Instructor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAssignRole}
              disabled={assignRoleMutation.isPending}
              className="flex-1"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Assign Role
            </Button>
            <Button
              onClick={() => revokeRoleMutation.mutate({ userId, role: selectedRole })}
              disabled={revokeRoleMutation.isPending || !userId}
              variant="destructive"
              className="flex-1"
            >
              <UserMinus className="w-4 h-4 mr-2" />
              Revoke Role
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Role Descriptions</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Admin:</strong> Full system access, can manage all users, courses, and content</p>
            <p><strong>Instructor:</strong> Can create and manage courses, upload content, create quizzes</p>
            <p><strong>Student:</strong> Can enroll in courses, access content, and take quizzes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
