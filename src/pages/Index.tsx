import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { GraduationCap, BookOpen, Video, FileText, Award, TrendingUp, Users, Star, CheckCircle, Zap, Shield, Globe } from "lucide-react";

const Index = () => {
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

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-40" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="container relative mx-auto px-4 py-20">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur-xl" />
                <div className="relative p-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl shadow-2xl backdrop-blur-sm border border-primary/10">
                  <GraduationCap className="w-24 h-24 text-primary" />
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl sm:text-8xl font-bold mb-8 animate-fade-in leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                Welcome to NuruLearn
              </span>
            </h1>
            
            <p className="text-2xl sm:text-3xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in font-light" style={{ animationDelay: '0.2s' }}>
              Transform your future with world-class education. Learn from expert instructors, 
              access premium content, and join a thriving community of learners.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto text-xl px-12 py-8 shadow-2xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300 rounded-xl">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-xl px-12 py-8 border-2 hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-xl"
                >
                  Explore Courses
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              {stats.map((stat, index) => (
                <Card 
                  key={index}
                  className="group p-8 bg-gradient-to-br from-card to-card/50 border border-primary/10 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="relative">
                    <stat.icon className="w-10 h-10 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stat.value}</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose NuruLearn */}
      <div className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
        <div className="container relative mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Why Choose NuruLearn?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join thousands of learners who trust NuruLearn for their educational journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden p-10 bg-card border border-primary/10 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative">
                  <div className="flex justify-center mb-8">
                    <div className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <feature.icon className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-center group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional Benefits */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 group hover:scale-105 transition-transform duration-300">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl mb-4 group-hover:shadow-lg transition-shadow">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from our students who transformed their careers with NuruLearn
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="p-8 h-full bg-card border border-primary/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        
                        <p className="text-muted-foreground mb-6 flex-grow leading-relaxed italic">
                          "{testimonial.content}"
                        </p>
                        
                        <div className="flex items-center gap-4 pt-4 border-t border-border">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                            {testimonial.avatar}
                          </div>
                          <div>
                            <div className="font-semibold">{testimonial.name}</div>
                            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
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

      {/* CTA Section */}
      <div className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-8 px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-primary font-semibold">Join 10,000+ Students Today</span>
            </div>
            
            <h2 className="text-5xl sm:text-6xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                Ready to Transform Your Future?
              </span>
            </h2>
            
            <p className="text-2xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
              Join thousands of students already transforming their careers with NuruLearn. 
              Start learning today and unlock your potential.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/auth">
                <Button size="lg" className="text-xl px-12 py-8 shadow-2xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300 rounded-xl group">
                  Sign Up Now - It's Free
                  <Award className="w-6 h-6 ml-2 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-green-500" />
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
