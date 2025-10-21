import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const { user, isAdmin, isInstructor, isStudent, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!user) return null;

  return (
    <nav className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 
              className="text-xl font-bold text-primary cursor-pointer flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              <GraduationCap className="w-6 h-6" />
              NuruLearn
            </h1>
            
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </Button>
              )}
              {isInstructor && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Instructor Dashboard
                </Button>
              )}
              {isStudent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  My Dashboard
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.email}
            </span>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
