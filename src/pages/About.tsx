import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Heart, Users, Target, Linkedin, Github } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Integrity",
      description: "We commit to honest, transparent education that respects learners and instructors alike.",
    },
    {
      icon: Users,
      title: "Inclusion",
      description: "Learning should be accessible to everyone, regardless of background or location.",
    },
    {
      icon: Target,
      title: "Growth",
      description: "We foster continuous learning and improvement for both students and educators.",
    },
    {
      icon: GraduationCap,
      title: "Curiosity",
      description: "We encourage exploration, questioning, and the pursuit of knowledge.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-24 animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl shadow-xl">
              <GraduationCap className="w-16 h-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            About NuruLearn
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Empowering Learning Through Technology
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-16 sm:mb-24 border-primary/20 shadow-xl animate-fade-in-up bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Our Mission</h2>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
              NuruLearn bridges the gap between education and opportunity by offering accessible, 
              high-quality learning experiences across technology, forensics, and digital innovation. 
              We believe that learning should be inclusive, practical, and beautifully designed — 
              empowering every student to unlock their full potential.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group p-6 border-primary/10 hover:border-primary/30 transition-all duration-300 card-hover bg-gradient-to-br from-card to-card/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Creator Section */}
        <Card className="max-w-3xl mx-auto border-primary/20 shadow-xl animate-fade-in-up bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <GraduationCap className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Meet the Creator</h2>
            <p className="text-xl font-semibold mb-2">Ian Kariuki</p>
            <p className="text-muted-foreground mb-6">Founder & Developer</p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Driven by a passion for democratizing education and leveraging technology to create 
              meaningful learning experiences that empower communities across Africa and beyond.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://linkedin.com/in/iankariuki"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6 text-primary" />
              </a>
              <a
                href="https://github.com/iankariuki"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6 text-primary" />
              </a>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
