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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="p-2 bg-primary/10 rounded-lg">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            NuruLearn
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/">
            <Button
              variant="ghost"
              className={cn(
                "transition-colors",
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
                "transition-colors",
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
                  "transition-colors",
                  (isActive("/admin") || isActive("/instructor") || isActive("/student")) &&
                    "bg-primary/10 text-primary font-medium"
                )}
              >
                Dashboard
              </Button>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Logout
            </Button>
          ) : (
            <Link to="/auth">
              <Button size="sm">Login / Register</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
