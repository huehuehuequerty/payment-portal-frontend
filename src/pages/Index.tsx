
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/api";
import Navbar from "@/components/Navbar";

const Index = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                School Payment Portal
              </h1>
              <p className="mt-6 text-xl text-gray-500">
                A comprehensive payment solution for schools to collect fees and manage transactions easily and securely.
              </p>
              <div className="mt-8 flex space-x-4">
                <Button size="lg" onClick={() => navigate("/register")}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-5 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
                  alt="School payment dashboard"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-24">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Features
            </h2>
            <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Secure Payments</h3>
                <p className="mt-2 text-gray-500">
                  Process payments securely with industry-leading encryption and authentication.
                </p>
              </div>
              
              <div className="bg-white shadow rounded-lg p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Comprehensive Reports</h3>
                <p className="mt-2 text-gray-500">
                  Track payment history, generate reports, and monitor transactions in real-time.
                </p>
              </div>
              
              <div className="bg-white shadow rounded-lg p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Fast Processing</h3>
                <p className="mt-2 text-gray-500">
                  Quick payment processing with instant notifications and status updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
