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
    <nav className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <h1 
              className="text-lg sm:text-xl font-bold text-primary cursor-pointer flex items-center gap-2 hover:scale-105 transition-transform"
              onClick={() => navigate("/")}
            >
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 icon-hover" />
              <span className="hidden xs:inline">NuruLearn</span>
            </h1>
            
            <div className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="gap-2 transition-all hover:scale-105"
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
                  className="gap-2 transition-all hover:scale-105"
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
                  className="gap-2 transition-all hover:scale-105"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  My Dashboard
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline truncate max-w-[150px]">
              {user.email}
            </span>
            <Button onClick={handleSignOut} variant="outline" size="sm" className="transition-all hover:scale-105">
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
