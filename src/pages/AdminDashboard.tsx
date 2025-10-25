import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, TrendingUp, UserCog, ClipboardList, BarChart3, Upload, Settings, FileCheck, BarChart } from "lucide-react";
import { Header } from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserManagement } from "@/components/admin/UserManagement";
import { RoleManagement } from "@/components/admin/RoleManagement";
import { CourseManagement } from "@/components/admin/CourseManagement";
import { PendingApprovals } from "@/components/admin/PendingApprovals";
import { PaymentManagement } from "@/components/admin/PaymentManagement";
import { ReportsGenerator } from "@/components/admin/ReportsGenerator";
import { CourseManager } from "@/components/CourseManager";
import { PlatformAnalytics } from "@/components/admin/PlatformAnalytics";

type AdminView = "users" | "roles" | "courses" | "approvals" | "payments" | "reports" | "upload" | "analytics" | null;

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<AdminView>(null);

  // Fetch total users count
  const { data: usersCount, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin-users-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch total courses count
  const { data: coursesCount, isLoading: loadingCourses } = useQuery({
    queryKey: ["admin-courses-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch total enrollments count
  const { data: enrollmentsCount, isLoading: loadingEnrollments } = useQuery({
    queryKey: ["admin-enrollments-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch total revenue from successful payments
  const { data: revenue, isLoading: loadingRevenue } = useQuery({
    queryKey: ["admin-revenue"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("amount")
        .eq("status", "success");
      if (error) throw error;
      const total = data?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      return total;
    },
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Admin Dashboard
          </h2>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingUsers ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-3xl font-bold text-foreground">{usersCount}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Registered users</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
                <div className="p-2 rounded-lg bg-accent/10">
                  <BookOpen className="w-5 h-5 text-accent-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingCourses ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-3xl font-bold text-foreground">{coursesCount}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Published courses</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Enrollments</CardTitle>
                <div className="p-2 rounded-lg bg-secondary/20">
                  <TrendingUp className="w-5 h-5 text-secondary-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingEnrollments ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-3xl font-bold text-foreground">{enrollmentsCount}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Total enrollments</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Payments Processed</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingRevenue ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-3xl font-bold text-foreground">
                  KES {revenue?.toLocaleString()}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Total revenue</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <Button onClick={() => setActiveView("upload")} size="lg" className="gap-2 w-full sm:w-auto">
            <Upload className="w-5 h-5" />
            <span className="hidden sm:inline">Upload Course Content</span>
            <span className="sm:hidden">Upload Content</span>
          </Button>
          <Button onClick={() => setActiveView("analytics")} size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
            <BarChart className="w-5 h-5" />
            <span className="hidden sm:inline">View Analytics</span>
            <span className="sm:hidden">Analytics</span>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <UserCog className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">User Management</CardTitle>
              </div>
              <CardDescription>Manage users and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveView("users")}
                  className="w-full p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">View All Users</span>
                </button>
                <button 
                  onClick={() => setActiveView("roles")}
                  className="w-full p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left flex items-center gap-2"
                >
                  <UserCog className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Manage Roles</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <ClipboardList className="w-5 h-5 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg">Course Management</CardTitle>
              </div>
              <CardDescription>Oversee all courses and content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveView("courses")}
                  className="w-full p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-accent-foreground" />
                  <span className="text-sm font-medium">View All Courses</span>
                </button>
                <button 
                  onClick={() => setActiveView("approvals")}
                  className="w-full p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left flex items-center gap-2"
                >
                  <ClipboardList className="w-4 h-4 text-accent-foreground" />
                  <span className="text-sm font-medium">Pending Approvals</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Payment Analytics</CardTitle>
              </div>
              <CardDescription>Track transactions and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveView("payments")}
                  className="w-full p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">View Payments</span>
                </button>
                <button 
                  onClick={() => setActiveView("reports")}
                  className="w-full p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Generate Reports</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={activeView !== null} onOpenChange={() => setActiveView(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle>
              {activeView === "users" && "User Management"}
              {activeView === "roles" && "Role Management"}
              {activeView === "courses" && "Course Management"}
              {activeView === "approvals" && "Pending Approvals"}
              {activeView === "payments" && "Payment Management"}
              {activeView === "reports" && "Reports Generator"}
              {activeView === "upload" && "Upload Course Content"}
              {activeView === "analytics" && "Platform Analytics"}
            </DialogTitle>
          </DialogHeader>
          {activeView === "users" && <UserManagement />}
          {activeView === "roles" && <RoleManagement />}
          {activeView === "courses" && <CourseManagement />}
          {activeView === "approvals" && <PendingApprovals />}
          {activeView === "payments" && <PaymentManagement />}
          {activeView === "reports" && <ReportsGenerator />}
          {activeView === "upload" && <CourseManager />}
          {activeView === "analytics" && <PlatformAnalytics />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;