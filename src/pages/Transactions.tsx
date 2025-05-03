
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { transactionService } from "@/services/api";
import Navbar from "@/components/Navbar";
import TransactionTable from "@/components/TransactionTable";

const Transactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    schoolId: "",
    page: 1,
    limit: 10,
    sort: "payment_time",
    order: "desc" as "asc" | "desc"
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, [filters.page, filters.limit, filters.sort, filters.order]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      let data;
      if (filters.schoolId) {
        data = await transactionService.getSchoolTransactions(filters.schoolId);
      } else {
        data = await transactionService.getTransactions({
          page: filters.page,
          limit: filters.limit,
          sort: filters.sort,
          order: filters.order
        });
      }
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handleSort = (sortField: string, sortOrder: 'asc' | 'desc') => {
    setFilters((prev) => ({
      ...prev,
      sort: sortField,
      order: sortOrder
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-20 pb-10">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              View and manage all payment transactions
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Filter Transactions</CardTitle>
              <CardDescription>
                Use the filters below to find specific transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFilterSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolId">School ID</Label>
                    <Input
                      id="schoolId"
                      name="schoolId"
                      placeholder="Filter by school ID"
                      value={filters.schoolId}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="limit">Items Per Page</Label>
                    <Select 
                      value={String(filters.limit)} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, limit: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select limit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 flex items-end">
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? "Loading..." : "Apply Filters"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Transaction List</CardTitle>
              <CardDescription>
                Showing {transactions.length} transaction(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <>
                  <TransactionTable 
                    transactions={transactions}
                    onSort={handleSort}
                    currentSort={filters.sort}
                    currentOrder={filters.order}
                  />
                  
                  <div className="flex items-center justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                      disabled={filters.page === 1 || isLoading}
                    >
                      Previous
                    </Button>
                    <span>Page {filters.page}</span>
                    <Button
                      variant="outline"
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={transactions.length < filters.limit || isLoading}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
