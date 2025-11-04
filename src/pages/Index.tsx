import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { GraduationCap, BookOpen, Video, FileText, Award, TrendingUp, Users, Star, CheckCircle, Zap, Shield, Globe, ArrowRight, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallax } from "@/hooks/useParallax";
import { supabase } from "@/integrations/supabase/client";
import { CourseViewer } from "@/components/CourseViewer";

const Index = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const parallaxOffset = useParallax(0.3);
  const statsAnimation = useScrollAnimation();
  const featuresAnimation = useScrollAnimation();
  const coursesAnimation = useScrollAnimation();
  const testimonialsAnimation = useScrollAnimation();
  const instructorsAnimation = useScrollAnimation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(6);
        
        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleViewCourse = (course: any) => {
    setSelectedCourse(course);
    setViewerOpen(true);
  };

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive updates about new courses and features.",
      });
      setEmail("");
    }
  };

  const features = [
    {
      icon: Video,
      title: "Expert-Led Video Courses",
      description: "Learn from industry professionals with years of experience in their fields",
      color: "from-blue-500/10 to-blue-600/10",
    },
    {
      icon: FileText,
      title: "Comprehensive Study Materials",
      description: "Access detailed notes, PDFs, and resources to supplement your learning",
      color: "from-purple-500/10 to-purple-600/10",
    },
    {
      icon: BookOpen,
      title: "Interactive Assessments",
      description: "Test your knowledge with quizzes and get instant feedback on your progress",
      color: "from-green-500/10 to-green-600/10",
    },
    {
      icon: Award,
      title: "Certificates & Progress Tracking",
      description: "Earn certificates and track your learning journey with detailed analytics",
      color: "from-amber-500/10 to-amber-600/10",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Learn at Your Pace",
      description: "Flexible learning schedule that fits your lifestyle",
    },
    {
      icon: Shield,
      title: "Trusted Platform",
      description: "Secure payments and guaranteed quality content",
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with learners from around the world",
    },
    {
      icon: CheckCircle,
      title: "Lifetime Access",
      description: "Once enrolled, access your courses anytime, anywhere",
    },
  ];

  const stats = [
    { icon: Users, value: "0", label: "Active Students" },
    { icon: BookOpen, value: "0", label: "Courses Available" },
    { icon: Star, value: "—", label: "Platform Rating" },
    { icon: TrendingUp, value: "—", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[85vh] sm:min-h-[90vh] flex items-center parallax-container">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 transition-transform duration-300"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-40" />
        
        {/* Floating Elements - Hidden on mobile for performance */}
        <div className="hidden md:block absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="hidden md:block absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="container relative mx-auto px-4 py-12 sm:py-20">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur-xl" />
                <div className="relative p-4 sm:p-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl shadow-2xl backdrop-blur-sm border border-primary/10">
                  <GraduationCap className="w-16 h-16 sm:w-24 sm:h-24 text-primary" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-6 sm:mb-8 animate-fade-in leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                Empowering Learners through Knowledge, Skill, and Digital Access
              </span>
            </h1>
            
            <p className="text-lg sm:text-2xl lg:text-3xl text-muted-foreground mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in font-light" style={{ animationDelay: '0.2s' }}>
              NuruLearn bridges the gap between education and opportunity by offering accessible, 
              high-quality learning experiences across technology, forensics, and digital innovation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" className="group w-full text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 shadow-2xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300 rounded-xl animate-pulse-soft">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/auth" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 border-2 hover:bg-accent/20 hover:scale-105 transition-all duration-300 rounded-xl"
                >
                  Join as Instructor
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div 
              ref={statsAnimation.ref}
              className={`grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-12 sm:mt-20 scroll-fade-in ${statsAnimation.isVisible ? 'in-view' : ''}`}
            >
              {stats.map((stat, index) => (
                <Card 
                  key={index}
                  className="group p-4 sm:p-8 bg-gradient-to-br from-card to-card/50 border border-primary/10 shadow-lg card-hover backdrop-blur-sm"
                >
                  <div className="relative">
                    <stat.icon className="w-6 h-6 sm:w-10 sm:h-10 text-primary mx-auto mb-2 sm:mb-4 icon-hover group-hover:animate-icon-bounce" />
                    <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose NuruLearn */}
      <div className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
        <div className="container relative mx-auto px-4">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Why Choose NuruLearn?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A comprehensive platform designed for modern learners
            </p>
          </div>
          
          <div 
            ref={featuresAnimation.ref}
            className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-20 scroll-fade-in ${featuresAnimation.isVisible ? 'in-view' : ''}`}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden p-6 sm:p-10 bg-card border border-primary/10 shadow-lg card-hover"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative">
                  <div className="flex justify-center mb-6 sm:mb-8">
                    <div className="p-4 sm:p-5 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary icon-hover" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-center group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional Benefits */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4 sm:p-6 group hover:scale-105 transition-transform duration-300">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl mb-3 sm:mb-4 group-hover:shadow-lg transition-shadow">
                  <benefit.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h4 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2">{benefit.title}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="py-16 sm:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-b from-background via-muted/10 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Featured Courses
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              High-quality learning resources from trusted sources
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : courses.length > 0 ? (
            <>
              <div 
                ref={coursesAnimation.ref}
                className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto scroll-fade-in ${coursesAnimation.isVisible ? 'in-view' : ''}`}
              >
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    enrolled={true}
                    showPrice={false}
                    onViewCourse={handleViewCourse}
                  />
                ))}
              </div>

              <div className="text-center mt-12 sm:mt-16">
                <Link to="/auth">
                  <Button size="lg" className="gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Sign Up to Access All Courses
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-6">
                Our instructors are preparing high-quality courses for you
              </p>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Get Notified When Courses Launch
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container relative mx-auto px-4">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Student Success Stories
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Learner testimonials coming soon
            </p>
          </div>

          <div 
            ref={testimonialsAnimation.ref}
            className={`max-w-4xl mx-auto scroll-fade-in ${testimonialsAnimation.isVisible ? 'in-view' : ''}`}
          >
            <Card className="bg-card/50 border border-primary/10 shadow-lg backdrop-blur-sm">
              <CardContent className="p-12 sm:p-16 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full">
                    <Star className="w-12 h-12 text-primary/50" />
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold mb-4 text-foreground/90">
                  Real Feedback from Real Students
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  Once our courses launch and students complete their learning journeys, 
                  their testimonials and success stories will be featured here.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Instructor Spotlight */}
      <div className="py-16 sm:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-b from-background via-accent/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Verified Expert Instructors
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Industry professionals — profiles coming soon
            </p>
          </div>

          <div 
            ref={instructorsAnimation.ref}
            className={`max-w-4xl mx-auto scroll-fade-in ${instructorsAnimation.isVisible ? 'in-view' : ''}`}
          >
            <Card className="bg-card/50 border border-primary/10 shadow-lg backdrop-blur-sm">
              <CardContent className="p-12 sm:p-16 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full">
                    <GraduationCap className="w-12 h-12 text-primary/50" />
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold mb-4 text-foreground/90">
                  World-Class Instructors Joining Soon
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
                  We're onboarding verified professionals with proven expertise to deliver 
                  exceptional learning experiences. Check back soon to meet our instructor team.
                </p>
                <Link to="/auth">
                  <Button size="lg" className="gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Become an Instructor
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Latest Updates Section */}
      <div className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
        <div className="container relative mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Latest Updates
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay informed about upcoming courses and platform features
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="group border border-primary/10 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary">Platform Launch</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">New Courses Launching Soon!</h3>
                <p className="text-sm text-muted-foreground">
                  We're preparing premium courses in forensics, cybersecurity, and ethical hacking.
                </p>
              </CardContent>
            </Card>

            <Card className="group border border-primary/10 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Users className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <span className="text-xs font-semibold text-accent-foreground">Instructors</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Expert Instructors Onboarding</h3>
                <p className="text-sm text-muted-foreground">
                  Industry professionals are joining to deliver world-class learning experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="group border border-primary/10 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary">Features</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Platform Features Coming</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive quizzes, progress tracking, and certification system being finalized.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-background" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-primary/20 shadow-2xl overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              <CardContent className="relative p-8 sm:p-12">
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full">
                      <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Stay Updated
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
                    Be the first to know when new courses and features launch
                  </p>
                </div>

                <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 h-12 sm:h-14 text-base bg-background/50 border-primary/20 focus:border-primary"
                  />
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="h-12 sm:h-14 px-6 sm:px-8 text-base whitespace-nowrap shadow-xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300"
                  >
                    Subscribe
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
              Ready to Start Learning?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
              Join NuruLearn today and take the first step towards achieving your educational goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" className="w-full text-lg px-8 py-6 shadow-2xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300 rounded-xl">
                  Sign Up Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full text-lg px-8 py-6 border-2 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-xl">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <CourseViewer 
        course={selectedCourse} 
        open={viewerOpen} 
        onOpenChange={setViewerOpen} 
      />
    </div>
  );
};

export default Index;
