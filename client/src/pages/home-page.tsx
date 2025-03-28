import { Helmet } from "react-helmet";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import AboutSection from "@/components/about/about-section";
import LoginForm from "@/components/residents/login-form";
import PortalFeatures from "@/components/residents/portal-features";
import DocumentBrowser from "@/components/documents/document-browser";
import NewsFeed from "@/components/news/news-feed";
import EventsSidebar from "@/components/news/events-sidebar";
import PhotoGallery from "@/components/gallery/photo-gallery";
import ContactForm from "@/components/contact/contact-form";
import ContactInfo from "@/components/contact/contact-info";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Bramhollow Condominium Association</title>
        <meta name="description" content="Welcome to Bramhollow Condominium Association, a peaceful and well-maintained community established in 1985." />
      </Helmet>
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section id="home">
          <Hero />
        </section>
        
        {/* Features Section */}
        <section>
          <Features />
        </section>
        
        {/* About Us Section */}
        <section id="about">
          <AboutSection />
        </section>
        
        {/* Residents Portal Section */}
        <section id="residents" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary">Residents Portal</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Access exclusive resources and services available to Bramhollow residents.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Login Form */}
              <div className="lg:col-span-2">
                <LoginForm />
              </div>
              
              {/* Portal Features */}
              <div className="lg:col-span-3">
                <PortalFeatures />
              </div>
            </div>
          </div>
        </section>
        
        {/* Documents Section */}
        <section id="documents" className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary">Documents</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Access important association documents and forms.
              </p>
            </div>
            
            <DocumentBrowser />
          </div>
        </section>
        
        {/* News & Events Section */}
        <section id="news" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary">News & Events</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Stay up-to-date with the latest happenings in our community.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* News Feed */}
              <div className="lg:col-span-2">
                <NewsFeed />
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <EventsSidebar />
              </div>
            </div>
          </div>
        </section>
        
        {/* Photo Gallery Section */}
        <section id="gallery">
          <PhotoGallery />
        </section>
        
        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary">Contact Us</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Get in touch with the Bramhollow Condominium Association.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <ContactForm />
              </div>
              
              {/* Contact Information */}
              <div>
                <ContactInfo />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default HomePage;
