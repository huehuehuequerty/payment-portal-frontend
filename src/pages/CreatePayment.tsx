
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { paymentService, authService } from "@/services/api";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";

const CreatePayment = () => {
  const [formData, setFormData] = useState({
    school_id: "",
    amount: "",
    callback_url: `${window.location.origin}/payment-callback`,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      
      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      
      const data = {
        school_id: formData.school_id,
        amount,
        callback_url: formData.callback_url,
      };
      
      const response = await paymentService.createPayment(data);
      
      if (response.payment_link) {
        setPaymentLink(response.payment_link);
        toast.success("Payment request created successfully");
      } else {
        toast.error("Failed to generate payment link");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      // Toast is shown via axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentLink);
    toast.success("Payment link copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-20 pb-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Payment</h1>
            <p className="text-muted-foreground">
              Generate a new payment request for your school
            </p>
          </div>
          
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Fill in the required information to create a payment link
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="school_id">School ID</Label>
                  <Input
                    id="school_id"
                    name="school_id"
                    placeholder="Enter school ID"
                    value={formData.school_id}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="1"
                    step="0.01"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the amount in Indian Rupees (INR)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="callback_url">Callback URL</Label>
                  <Input
                    id="callback_url"
                    name="callback_url"
                    placeholder="Enter callback URL"
                    value={formData.callback_url}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    URL where payment status will be sent after completion
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Payment Request"}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          {paymentLink && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-center text-primary">Payment Link Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="bg-muted p-3 rounded-md text-sm font-mono flex-1 break-all">
                    {paymentLink}
                  </div>
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    Copy
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => window.open(paymentLink, "_blank")}
                >
                  Open Payment Link
                </Button>
                <Button onClick={() => setPaymentLink("")}>
                  Create Another
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePayment;
