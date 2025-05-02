
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Transaction {
  collect_id: string;
  school_id: string;
  gateway: string;
  order_amount: number;
  transaction_amount: number;
  status: string;
  custom_order_id: string;
  payment_time: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  onSort: (sortField: string, sortOrder: 'asc' | 'desc') => void;
  currentSort: string;
  currentOrder: 'asc' | 'desc';
}

const TransactionTable = ({ 
  transactions, 
  onSort,
  currentSort,
  currentOrder
}: TransactionTableProps) => {
  const navigate = useNavigate();
  
  const handleSort = (field: string) => {
    const newOrder = currentSort === field && currentOrder === 'asc' ? 'desc' : 'asc';
    onSort(field, newOrder);
  };

  const renderSortIcon = (field: string) => {
    if (currentSort !== field) return null;
    return currentOrder === 'asc' ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };
  
  const getStatusClass = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "success" || lowerStatus === "completed") return "status-badge status-success";
    if (lowerStatus === "pending" || lowerStatus === "processing") return "status-badge status-pending";
    return "status-badge status-failed";
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Table>
      <TableCaption>Transaction history</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('custom_order_id')}
          >
            Order ID {renderSortIcon('custom_order_id')}
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('school_id')}
          >
            School ID {renderSortIcon('school_id')}
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('order_amount')}
          >
            Amount {renderSortIcon('order_amount')}
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('gateway')}
          >
            Gateway {renderSortIcon('gateway')}
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('status')}
          >
            Status {renderSortIcon('status')}
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('payment_time')}
          >
            Time {renderSortIcon('payment_time')}
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TableRow key={transaction.collect_id}>
              <TableCell className="font-medium">{transaction.custom_order_id.slice(0, 8)}...</TableCell>
              <TableCell>{transaction.school_id.slice(0, 8)}...</TableCell>
              <TableCell>{formatAmount(transaction.order_amount)}</TableCell>
              <TableCell>{transaction.gateway || "N/A"}</TableCell>
              <TableCell>
                <span className={getStatusClass(transaction.status)}>
                  {transaction.status}
                </span>
              </TableCell>
              <TableCell>{formatDate(transaction.payment_time)}</TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/transaction/${transaction.collect_id}`)}
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              No transactions found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
