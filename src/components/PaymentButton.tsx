import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface PaymentButtonProps {
  contentId: string;
  contentType: "course" | "video" | "quiz" | "note";
  amount: number;
  children: React.ReactNode;
}

export const PaymentButton = ({ contentId, contentType, amount, children }: PaymentButtonProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Please login to make payment");

      const { data, error } = await supabase.functions.invoke("initiate-payment", {
        body: {
          amount,
          email: user.email,
          contentId,
          contentType,
        },
      });

      if (error) throw error;

      if (data.authorizationUrl) {
        window.open(data.authorizationUrl, "_blank");
        toast({
          title: "Payment Window Opened",
          description: "Complete your payment in the new tab. You'll be redirected after successful payment.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={loading} className="w-full transition-all duration-300">
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </Button>
  );
};
