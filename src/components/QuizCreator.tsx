import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizCreatorProps {
  courseId: string;
  onSuccess?: () => void;
}

export const QuizCreator = ({ courseId, onSuccess }: QuizCreatorProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("quizzes")
        .insert({
          course_id: courseId,
          title,
          questions: JSON.parse(JSON.stringify(questions)),
          created_by: user.id,
        });

      if (error) throw error;

      toast({ title: "Quiz created successfully" });
      setTitle("");
      setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error creating quiz",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="quiz-title">Quiz Title</Label>
            <Input
              id="quiz-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <Card key={qIndex}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <Label>Question {qIndex + 1}</Label>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(qIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <Input
                    placeholder="Enter question"
                    value={q.question}
                    onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                    required
                  />

                  <div className="space-y-2">
                    <Label>Options (select correct answer)</Label>
                    <RadioGroup
                      value={q.correctAnswer.toString()}
                      onValueChange={(value) => updateQuestion(qIndex, "correctAnswer", parseInt(value))}
                    >
                      {q.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                          <Input
                            placeholder={`Option ${oIndex + 1}`}
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            required
                          />
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Quiz
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
