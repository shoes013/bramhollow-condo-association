import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AuthForms from "@/components/auth/auth-forms";

const AuthPage = () => {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to homepage if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Resident Portal | Bramhollow Condominium Association</title>
        <meta name="description" content="Access the resident portal to pay dues, submit maintenance requests, and more." />
      </Helmet>
      
      <Header />
      
      <main>
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary">Resident Portal</h1>
              <p className="mt-2 text-lg text-gray-600">
                Access exclusive resources and services for Bramhollow residents
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Auth Forms */}
              <AuthForms />
              
              {/* Hero Section */}
              <div className="hidden lg:block">
                <div className="relative rounded-lg overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                    alt="Bramhollow Condominiums" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">Resident Benefits</h2>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <i className="fas fa-check-circle text-accent mr-2"></i>
                        <span>Pay association dues online</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check-circle text-accent mr-2"></i>
                        <span>Submit and track maintenance requests</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check-circle text-accent mr-2"></i>
                        <span>Access community calendar and events</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check-circle text-accent mr-2"></i>
                        <span>Download association documents</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-check-circle text-accent mr-2"></i>
                        <span>Connect with neighbors in resident directory</span>
                      </li>
                    </ul>
                    <p className="mt-4 text-sm opacity-90">
                      A complete suite of tools to enhance your living experience at Bramhollow
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default AuthPage;
