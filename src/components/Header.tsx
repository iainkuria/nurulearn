import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GraduationCap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 shadow-sm">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary icon-hover" />
          </div>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            NuruLearn
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/">
            <Button
              variant="ghost"
              className={cn(
                "transition-all duration-300 hover:scale-105",
                isActive("/") && "bg-primary/10 text-primary font-medium"
              )}
            >
              Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button
              variant="ghost"
              className={cn(
                "transition-all duration-300 hover:scale-105",
                isActive("/dashboard") && "bg-primary/10 text-primary font-medium"
              )}
            >
              Courses
            </Button>
          </Link>
          {user && (
            <Link to="/dashboard">
              <Button
                variant="ghost"
                className={cn(
                  "transition-all duration-300 hover:scale-105",
                  (isActive("/admin") || isActive("/instructor") || isActive("/student")) &&
                    "bg-primary/10 text-primary font-medium"
                )}
              >
                Dashboard
              </Button>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          {user ? (
            <Button onClick={handleSignOut} variant="outline" size="sm" className="transition-all duration-300 hover:scale-105 text-xs sm:text-sm">
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="transition-all duration-300 hover:scale-105 text-xs sm:text-sm">
                <span className="hidden sm:inline">Login / Register</span>
                <span className="sm:hidden">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
