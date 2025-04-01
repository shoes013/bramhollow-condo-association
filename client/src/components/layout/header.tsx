import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-primary font-bold text-xl md:text-2xl cursor-pointer">
              Bramhollow
            </Link>
            <div className="ml-2 text-secondary text-sm md:text-base">Condominium Association</div>
            <div className="ml-2 text-xs text-gray-500 italic hidden sm:block">Est. 1985</div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className={`${isActive("/") ? "text-primary-dark font-semibold border-b-2 border-primary" : "text-gray-600"} hover:text-primary transition-colors`}>
              Home
            </Link>
            <Link href="/about" className={`${isActive("/about") ? "text-primary-dark font-semibold border-b-2 border-primary" : "text-gray-600"} hover:text-primary transition-colors`}>
              About Us
            </Link>
            <Link href={user ? "/dashboard" : "/auth"} className={`${isActive("/dashboard") || isActive("/auth") ? "text-primary-dark font-semibold border-b-2 border-primary" : "text-gray-600"} hover:text-primary transition-colors`}>
              Residents Portal
            </Link>
            <Link href="/documents" className={`${isActive("/documents") ? "text-primary-dark font-semibold border-b-2 border-primary" : "text-gray-600"} hover:text-primary transition-colors`}>
              Documents
            </Link>
            <Link href="/news" className={`${isActive("/news") ? "text-primary-dark font-semibold border-b-2 border-primary" : "text-gray-600"} hover:text-primary transition-colors`}>
              News & Events
            </Link>
            <Link href="/gallery" className={`${isActive("/gallery") ? "text-primary-dark font-semibold border-b-2 border-primary" : "text-gray-600"} hover:text-primary transition-colors`}>
              Photo Gallery
            </Link>
            <Link href="/contact" className={`${isActive("/contact") ? "text-primary-dark font-semibold border-b-2 border-primary" : "text-gray-600"} hover:text-primary transition-colors`}>
              Contact Us
            </Link>
            
            {user && (
              <>
                <NotificationDropdown />
                <Button 
                  variant="ghost" 
                  onClick={handleLogout} 
                  className="text-gray-600 hover:text-primary"
                  disabled={logoutMutation.isPending}
                >
                  Logout
                </Button>
              </>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-2">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className={isActive("/") ? "text-primary-dark font-semibold" : "text-gray-600"}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className={isActive("/about") ? "text-primary-dark font-semibold" : "text-gray-600"}
                onClick={closeMobileMenu}
              >
                About Us
              </Link>
              <Link 
                href={user ? "/dashboard" : "/auth"} 
                className={isActive("/dashboard") || isActive("/auth") ? "text-primary-dark font-semibold" : "text-gray-600"}
                onClick={closeMobileMenu}
              >
                Residents Portal
              </Link>
              <Link 
                href="/documents" 
                className={isActive("/documents") ? "text-primary-dark font-semibold" : "text-gray-600"}
                onClick={closeMobileMenu}
              >
                Documents
              </Link>
              <Link 
                href="/news" 
                className={isActive("/news") ? "text-primary-dark font-semibold" : "text-gray-600"}
                onClick={closeMobileMenu}
              >
                News & Events
              </Link>
              <Link 
                href="/gallery" 
                className={isActive("/gallery") ? "text-primary-dark font-semibold" : "text-gray-600"}
                onClick={closeMobileMenu}
              >
                Photo Gallery
              </Link>
              <Link 
                href="/contact" 
                className={isActive("/contact") ? "text-primary-dark font-semibold" : "text-gray-600"}
                onClick={closeMobileMenu}
              >
                Contact Us
              </Link>
              
              {user && (
                <>
                  <div className="flex items-center">
                    <NotificationDropdown />
                    <span className="text-gray-600 ml-2">Notifications</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }} 
                    className="text-gray-600 justify-start p-0 hover:bg-transparent hover:text-primary"
                    disabled={logoutMutation.isPending}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
