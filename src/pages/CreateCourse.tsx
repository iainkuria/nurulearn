import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Upload, ArrowLeft, ArrowRight, Check, BookOpen, Image as ImageIcon, Video, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CATEGORIES = [
  "Programming",
  "Web Development",
  "Data Science",
  "Cybersecurity",
  "Mobile Development",
  "Cloud Computing",
  "Database",
  "DevOps",
  "AI & Machine Learning",
  "Other"
];

type Step = 1 | 2 | 3 | 4;

export default function CreateCourse() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    video_url: "",
    thumbnail_url: "",
    price: "0",
    is_free: true,
    is_published: false,
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    category: "",
  });

  const validateStep = (step: Step): boolean => {
    const newErrors = { title: "", description: "", category: "" };
    let isValid = true;

    if (step === 1) {
      if (formData.title.length < 5) {
        newErrors.title = "Title must be at least 5 characters";
        isValid = false;
      }
      if (formData.description.length < 50) {
        newErrors.description = "Description must be at least 50 characters";
        isValid = false;
      }
      if (!formData.category) {
        newErrors.category = "Please select a category";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("course-thumbnails")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("course-thumbnails")
        .getPublicUrl(filePath);

      setFormData({ ...formData, thumbnail_url: publicUrl });
      toast({ title: "Thumbnail uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a course",
        variant: "destructive",
      });
      return;
    }

    // Validate that at least video or notes will be added
    if (!formData.video_url) {
      toast({
        title: "Content required",
        description: "Please add at least a video URL. You can add notes later from the instructor dashboard.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const courseData = {
        title: formData.title,
        description: formData.description,
        thumbnail_url: formData.thumbnail_url,
        price: formData.is_free ? 0 : parseFloat(formData.price),
        is_free: formData.is_free,
        is_published: !isDraft,
        instructor_id: user.id,
      };

      const { data: course, error: courseError } = await supabase
        .from("courses")
        .insert(courseData)
        .select()
        .single();

      if (courseError) throw courseError;

      // Add video if URL provided
      if (formData.video_url && course) {
        const { error: videoError } = await supabase
          .from("videos")
          .insert({
            course_id: course.id,
            title: `${formData.title} - Main Video`,
            description: "Course video content",
            video_url: formData.video_url,
            thumbnail_url: formData.thumbnail_url,
            uploaded_by: user.id,
          });

        if (videoError) throw videoError;
      }

      setCreatedCourseId(course.id);
      setShowSuccessModal(true);
      
      toast({
        title: isDraft ? "Course saved as draft" : "Course published successfully!",
        description: isDraft 
          ? "You can continue editing from your dashboard"
          : "Your course is now live and visible to students",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4) as Step);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const steps = [
    { number: 1, title: "Details", icon: BookOpen },
    { number: 2, title: "Media", icon: Video },
    { number: 3, title: "Pricing", icon: FileText },
    { number: 4, title: "Review", icon: Check },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
          <p className="text-muted-foreground">
            Share your knowledge with students around the world
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? "bg-primary border-primary text-primary-foreground"
                          : isActive
                          ? "border-primary text-primary"
                          : "border-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-sm mt-2 font-medium ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 transition-all ${
                        currentStep > step.number ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Course Details"}
              {currentStep === 2 && "Media & Content"}
              {currentStep === 3 && "Pricing"}
              {currentStep === 4 && "Review & Publish"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Provide basic information about your course"}
              {currentStep === 2 && "Add visual content and video"}
              {currentStep === 3 && "Set your course pricing"}
              {currentStep === 4 && "Review your course before publishing"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Details */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Complete Python Programming Course"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students will learn in this course... (minimum 50 characters)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className={errors.description ? "border-destructive" : ""}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.description ? (
                      <p className="text-sm text-destructive">{errors.description}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {formData.description.length} / 50 characters
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Media */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <Label htmlFor="thumbnail">Course Thumbnail</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={uploading}
                    />
                    {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  </div>
                  {formData.thumbnail_url && (
                    <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden">
                      <img
                        src={formData.thumbnail_url}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="video_url">YouTube Video URL *</Label>
                  <Input
                    id="video_url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Add your main course video. You can add more videos and notes later from your dashboard.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Pricing */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label htmlFor="is_free" className="text-base font-semibold">
                      Free Course
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Make this course available to everyone for free
                    </p>
                  </div>
                  <Switch
                    id="is_free"
                    checked={formData.is_free}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_free: checked, price: checked ? "0" : formData.price })
                    }
                  />
                </div>

                {!formData.is_free && (
                  <div>
                    <Label htmlFor="price">Price (KES)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Set a fair price for your course content
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-2">Course Title</h3>
                    <p className="text-muted-foreground">{formData.title}</p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-2">Category</h3>
                    <p className="text-muted-foreground">{formData.category}</p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{formData.description}</p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-2">Pricing</h3>
                    <p className="text-muted-foreground">
                      {formData.is_free ? "Free" : `KES ${formData.price}`}
                    </p>
                  </div>

                  {formData.thumbnail_url && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold mb-2">Thumbnail</h3>
                      <img
                        src={formData.thumbnail_url}
                        alt="Course thumbnail"
                        className="w-full max-w-md h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => handleSubmit(true)}
                    variant="outline"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Publish Course
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button onClick={nextStep}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="w-6 h-6 text-green-500" />
              Course Published Successfully!
            </DialogTitle>
            <DialogDescription>
              Your course is now live and available to students. You can add more content or manage it from your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/dashboard");
              }}
              className="flex-1"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                if (createdCourseId) {
                  navigate(`/course/${createdCourseId}`);
                }
              }}
              className="flex-1"
            >
              View Course
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
