import { Helmet } from "react-helmet";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LoginForm from "@/components/residents/login-form";
import PortalFeatures from "@/components/residents/portal-features";

const ResidentsPage = () => {
  return (
    <>
      <Helmet>
        <title>Residents Portal | Bramhollow Condominium Association</title>
        <meta name="description" content="Access exclusive resources and services available to Bramhollow residents." />
      </Helmet>
      
      <Header />
      
      <main>
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-primary">Residents Portal</h1>
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
      </main>
      
      <Footer />
    </>
  );
};

export default ResidentsPage;
