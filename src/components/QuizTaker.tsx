import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface QuizTakerProps {
  quiz: any;
  onComplete?: () => void;
}

export const QuizTaker = ({ quiz, onComplete }: QuizTakerProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});

  const questions = quiz.questions || [];

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let correctCount = 0;
      questions.forEach((q: any, index: number) => {
        if (answers[index] === q.correctAnswer) {
          correctCount++;
        }
      });

      const percent = (correctCount / questions.length) * 100;

      const { error } = await supabase
        .from("quiz_results")
        .insert({
          quiz_id: quiz.id,
          user_id: user.id,
          score: correctCount,
          total: questions.length,
          percent,
        });

      if (error) throw error;

      setScore(correctCount);
      setSubmitted(true);
      toast({ title: `Quiz completed! Score: ${correctCount}/${questions.length}` });
      onComplete?.();
    } catch (error: any) {
      toast({
        title: "Error submitting quiz",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="text-6xl font-bold mb-4">
            {score}/{questions.length}
          </div>
          <p className="text-xl text-muted-foreground mb-8">
            You scored {Math.round((score / questions.length) * 100)}%
          </p>
          
          <div className="space-y-4 text-left">
            {questions.map((q: any, index: number) => {
              const isCorrect = answers[index] === q.correctAnswer;
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2">{q.question}</p>
                        <p className="text-sm text-muted-foreground">
                          Your answer: {q.options[answers[index]]}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600">
                            Correct answer: {q.options[q.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((q: any, index: number) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <Label className="text-base mb-4 block">
                {index + 1}. {q.question}
              </Label>
              <RadioGroup
                value={answers[index]?.toString()}
                onValueChange={(value) => setAnswers({ ...answers, [index]: parseInt(value) })}
              >
                {q.options.map((option: string, oIndex: number) => (
                  <div key={oIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={oIndex.toString()} id={`q${index}-o${oIndex}`} />
                    <Label htmlFor={`q${index}-o${oIndex}`} className="font-normal cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={handleSubmit}
          disabled={loading || Object.keys(answers).length !== questions.length}
          className="w-full"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Submit Quiz
        </Button>
      </CardContent>
    </Card>
  );
};
