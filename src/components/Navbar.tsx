
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/api";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    setUsername(authService.getUsername() || "");
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-primary text-xl font-bold">EduPay</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                  Dashboard
                </Link>
                <Link to="/create-payment" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                  Create Payment
                </Link>
                <Link to="/transactions" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                  Transactions
                </Link>
                <div className="ml-3 relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>{username}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="mr-2">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            {/* Mobile menu button will go here if needed */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
