
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { paymentService } from "@/services/api";

interface PaymentStatusCardProps {
  collectRequestId: string;
  schoolId: string;
  initialStatus?: string;
}

const PaymentStatusCard = ({ collectRequestId, schoolId, initialStatus = "pending" }: PaymentStatusCardProps) => {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState<any>(null);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const response = await paymentService.checkStatus(collectRequestId, schoolId);
      setStatus(response.status || "pending");
      setDetails(response);
    } catch (error) {
      console.error("Error checking payment status:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    checkStatus();
    
    // Polling for status updates if payment is pending
    let interval: number | undefined;
    if (status.toLowerCase() === "pending" || status.toLowerCase() === "processing") {
      interval = window.setInterval(() => {
        checkStatus();
      }, 10000); // Check every 10 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [collectRequestId, schoolId]);
  
  const getStatusClass = () => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "success" || lowerStatus === "completed") return "bg-payment-success/10 border-payment-success";
    if (lowerStatus === "pending" || lowerStatus === "processing") return "bg-payment-pending/10 border-payment-pending";
    return "bg-payment-failed/10 border-payment-failed";
  };
  
  const getStatusBadge = () => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "success" || lowerStatus === "completed") return "status-badge status-success";
    if (lowerStatus === "pending" || lowerStatus === "processing") return "status-badge status-pending";
    return "status-badge status-failed";
  };

  return (
    <Card className={`border-2 ${getStatusClass()}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Payment Status 
          <span className={getStatusBadge()}>
            {status.toUpperCase()}
          </span>
        </CardTitle>
        <CardDescription>
          Collection Request ID: {collectRequestId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {details && (
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-muted-foreground">School ID:</div>
              <div>{schoolId}</div>
            </div>
            {details.payment_time && (
              <div className="grid grid-cols-2 gap-1">
                <div className="text-muted-foreground">Payment Time:</div>
                <div>{new Date(details.payment_time).toLocaleString()}</div>
              </div>
            )}
            {details.amount && (
              <div className="grid grid-cols-2 gap-1">
                <div className="text-muted-foreground">Amount:</div>
                <div>₹{details.amount}</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={checkStatus} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Checking..." : "Refresh Status"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentStatusCard;
