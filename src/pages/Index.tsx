import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GraduationCap, BookOpen, Video, FileText, Award, TrendingUp, Users, Star } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Video,
      title: "Video Lessons",
      description: "High-quality video content from expert instructors",
      color: "from-blue-500/10 to-blue-600/10",
    },
    {
      icon: FileText,
      title: "Study Materials",
      description: "Comprehensive notes and documents for every course",
      color: "from-purple-500/10 to-purple-600/10",
    },
    {
      icon: BookOpen,
      title: "Interactive Quizzes",
      description: "Test your knowledge with engaging assessments",
      color: "from-green-500/10 to-green-600/10",
    },
    {
      icon: Award,
      title: "Track Progress",
      description: "Monitor your learning journey and achievements",
      color: "from-amber-500/10 to-amber-600/10",
    },
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "Active Students" },
    { icon: BookOpen, value: "500+", label: "Courses Available" },
    { icon: Star, value: "4.9/5", label: "Average Rating" },
    { icon: TrendingUp, value: "95%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-40" />
        
        <div className="container relative mx-auto px-4 py-24 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8 animate-float">
              <div className="p-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl shadow-lg backdrop-blur-sm">
                <GraduationCap className="w-20 h-20 text-primary" />
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                Welcome to NuruLearn
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
              Transform your future with world-class education. Learn from expert instructors, 
              access premium content, and join a thriving community of learners.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-lg px-8 py-6 border-2 hover:bg-primary/5 transition-all"
                >
                  Explore Courses
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in">
              {stats.map((stat, index) => (
                <Card 
                  key={index}
                  className="p-6 bg-gradient-to-br from-card to-muted/20 border-none shadow-md hover:shadow-lg transition-all"
                >
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive learning tools designed to help you achieve your educational goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden p-8 bg-card border-none shadow-md hover:shadow-xl transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="relative">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                      <feature.icon className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
                  <p className="text-muted-foreground text-center text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Join thousands of students already transforming their careers with NuruLearn. 
              Start learning today and unlock your potential.
            </p>
            <Link to="/auth">
              <Button size="lg" className="text-lg px-10 py-7 shadow-xl hover:shadow-2xl transition-all">
                Sign Up Now - It's Free
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
