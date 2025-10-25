import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { GraduationCap, BookOpen, Video, FileText, Award, TrendingUp, Users, Star, CheckCircle, Zap, Shield, Globe, ArrowRight, Mail, Play } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallax } from "@/hooks/useParallax";

const Index = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const parallaxOffset = useParallax(0.3);
  const statsAnimation = useScrollAnimation();
  const featuresAnimation = useScrollAnimation();
  const coursesAnimation = useScrollAnimation();
  const testimonialsAnimation = useScrollAnimation();
  const instructorsAnimation = useScrollAnimation();

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

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      content: "NuruLearn transformed my career. The courses are practical, engaging, and taught by experts who truly care about student success.",
      avatar: "SJ",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Data Analyst",
      content: "The best investment I've made in my education. The instructors are world-class and the platform is incredibly easy to use.",
      avatar: "MC",
      rating: 5,
    },
    {
      name: "Amina Hassan",
      role: "Marketing Manager",
      content: "I've tried many online platforms, but NuruLearn stands out with its quality content and supportive community. Highly recommended!",
      avatar: "AH",
      rating: 5,
    },
    {
      name: "David Omondi",
      role: "Business Owner",
      content: "The skills I learned here directly impacted my business growth. The ROI on these courses is incredible!",
      avatar: "DO",
      rating: 5,
    },
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "Active Students" },
    { icon: BookOpen, value: "500+", label: "Courses Available" },
    { icon: Star, value: "4.9/5", label: "Average Rating" },
    { icon: TrendingUp, value: "95%", label: "Success Rate" },
  ];

  const featuredCourses = [
    {
      title: "Web Development Masterclass",
      instructor: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      rating: 4.9,
      students: 2500,
      price: 4999,
      category: "Development",
    },
    {
      title: "Data Science & Machine Learning",
      instructor: "Michael Chen",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      rating: 4.8,
      students: 1800,
      price: 5999,
      category: "Data Science",
    },
    {
      title: "Digital Marketing Essentials",
      instructor: "Amina Hassan",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      rating: 4.9,
      students: 3200,
      price: 3999,
      category: "Marketing",
    },
  ];

  const instructors = [
    {
      name: "Sarah Johnson",
      role: "Senior Software Engineer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      courses: 12,
      students: 5400,
      bio: "10+ years in web development and software architecture",
    },
    {
      name: "Michael Chen",
      role: "Data Science Lead",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      courses: 8,
      students: 3200,
      bio: "Expert in AI, ML, and statistical analysis",
    },
    {
      name: "Amina Hassan",
      role: "Marketing Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      courses: 15,
      students: 7800,
      bio: "Specialized in digital strategy and brand growth",
    },
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
                Welcome to NuruLearn
              </span>
            </h1>
            
            <p className="text-lg sm:text-2xl lg:text-3xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in font-light" style={{ animationDelay: '0.2s' }}>
              Transform your future with world-class education. Learn from expert instructors, 
              access premium content, and join a thriving community of learners.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" className="group w-full text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 shadow-2xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300 rounded-xl animate-pulse-soft">
                  Explore Courses
                  <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/auth" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 border-2 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-xl"
                >
                  Become an Instructor
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
              Join thousands of learners who trust NuruLearn for their educational journey
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
              Start your learning journey with our most popular courses
            </p>
          </div>

          <div 
            ref={coursesAnimation.ref}
            className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto scroll-fade-in ${coursesAnimation.isVisible ? 'in-view' : ''}`}
          >
            {featuredCourses.map((course, index) => (
              <Card
                key={index}
                className="group overflow-hidden bg-card border border-primary/10 shadow-lg card-hover"
              >
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button size="lg" className="gap-2">
                      <Play className="w-5 h-5" />
                      <span className="hidden sm:inline">Preview Course</span>
                      <span className="sm:hidden">Preview</span>
                    </Button>
                  </div>
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 px-2 sm:px-3 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full text-xs sm:text-sm font-semibold">
                    {course.category}
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{course.instructor}</span>
                  </p>
                  
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm sm:text-base font-semibold">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm sm:text-base">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border gap-2">
                    <div className="text-xl sm:text-2xl font-bold text-primary">
                      KES {(course.price / 100).toLocaleString()}
                    </div>
                    <Link to="/auth">
                      <Button className="group/btn text-sm sm:text-base">
                        <span className="hidden sm:inline">View Course</span>
                        <span className="sm:hidden">View</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6">
                View All Courses
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Success Stories
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from our students who transformed their careers with NuruLearn
            </p>
          </div>

          <div 
            ref={testimonialsAnimation.ref}
            className={`max-w-6xl mx-auto scroll-fade-in ${testimonialsAnimation.isVisible ? 'in-view' : ''}`}
          >
            <Carousel className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="p-6 sm:p-8 h-full bg-card border border-primary/10 shadow-lg card-hover">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center mb-3 sm:mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        
                        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 flex-grow leading-relaxed italic">
                          "{testimonial.content}"
                        </p>
                        
                        <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-border">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                            {testimonial.avatar}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm sm:text-base font-semibold truncate">{testimonial.name}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground truncate">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </div>
      </div>

      {/* Instructor Spotlight Section */}
      <div className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container relative mx-auto px-4">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Learn from Expert Instructors
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              World-class professionals sharing their knowledge and experience
            </p>
          </div>

          <div 
            ref={instructorsAnimation.ref}
            className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto scroll-fade-in ${instructorsAnimation.isVisible ? 'in-view' : ''}`}
          >
            {instructors.map((instructor, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden p-6 sm:p-8 bg-card border border-primary/10 shadow-lg card-hover"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                      <img
                        src={instructor.image}
                        alt={instructor.name}
                        className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/40 transition-all duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-center group-hover:text-primary transition-colors">
                    {instructor.name}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground text-center mb-3 sm:mb-4">{instructor.role}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center mb-4 sm:mb-6 leading-relaxed">
                    {instructor.bio}
                  </p>
                  
                  <div className="flex justify-around py-3 sm:py-4 border-t border-border">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-primary">{instructor.courses}</div>
                      <div className="text-xs text-muted-foreground uppercase">Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-primary">{(instructor.students / 1000).toFixed(1)}K</div>
                      <div className="text-xs text-muted-foreground uppercase">Students</div>
                    </div>
                  </div>
                  
                  <Link to="/auth">
                    <Button className="w-full mt-3 sm:mt-4 group/btn text-sm sm:text-base">
                      <span className="hidden sm:inline">View Profile</span>
                      <span className="sm:hidden">View</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-16 sm:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-40" />
        
        <div className="container relative mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-6 sm:p-12 bg-card/80 backdrop-blur-sm border border-primary/20 shadow-2xl">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-4 sm:mb-6">
                <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Stay Updated
              </h2>
              <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Get notified about new courses, exclusive discounts, and learning resources delivered to your inbox
              </p>
            </div>
            
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-12 sm:h-14 text-base sm:text-lg px-4 sm:px-6 border-2"
              />
              <Button type="submit" size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg group">
                Subscribe
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
            
            <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
              <span>No spam, unsubscribe anytime</span>
            </div>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10" />
        <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-6 sm:mb-8 px-4 sm:px-6 py-2 sm:py-3 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-sm sm:text-base text-primary font-semibold">Join 10,000+ Students Today</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                Ready to Transform Your Future?
              </span>
            </h2>
            
            <p className="text-lg sm:text-2xl text-muted-foreground mb-8 sm:mb-12 leading-relaxed max-w-2xl mx-auto">
              Join thousands of students already transforming their careers with NuruLearn. 
              Start learning today and unlock your potential.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" className="w-full text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 shadow-2xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300 rounded-xl group">
                  Start Learning Today
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
