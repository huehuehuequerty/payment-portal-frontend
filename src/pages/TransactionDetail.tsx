
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { transactionService } from "@/services/api";
import Navbar from "@/components/Navbar";
import PaymentStatusCard from "@/components/PaymentStatusCard";
import { ArrowLeft } from "lucide-react";

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await transactionService.getTransactionStatus(id);
        setTransaction(data);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransaction();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-20 pb-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Transaction Details</h1>
              <p className="text-muted-foreground">
                View details for transaction {id?.slice(0, 8)}...
              </p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              {transaction ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Transaction Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-1">
                          <div className="col-span-1 text-sm font-medium text-muted-foreground">Order ID:</div>
                          <div className="col-span-2 text-sm font-mono">{id}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="col-span-1 text-sm font-medium text-muted-foreground">Payment Time:</div>
                          <div className="col-span-2 text-sm">
                            {transaction.payment_time ? new Date(transaction.payment_time).toLocaleString() : "N/A"}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="col-span-1 text-sm font-medium text-muted-foreground">Status:</div>
                          <div className="col-span-2">
                            <span className={`status-badge ${
                              transaction.status?.toLowerCase() === "success" || transaction.status?.toLowerCase() === "completed" 
                                ? "status-success" 
                                : transaction.status?.toLowerCase() === "pending" || transaction.status?.toLowerCase() === "processing"
                                  ? "status-pending"
                                  : "status-failed"
                            }`}>
                              {transaction.status || "Unknown"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <PaymentStatusCard 
                      collectRequestId={id || ""} 
                      schoolId={transaction.school_id || "default_school_id"}
                      initialStatus={transaction.status}
                    />
                  </div>
                </div>
              ) : (
                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="text-center text-destructive">Transaction Not Found</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p>The requested transaction could not be found or you may not have permission to view it.</p>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" onClick={() => navigate("/transactions")}>
                      Go to All Transactions
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
