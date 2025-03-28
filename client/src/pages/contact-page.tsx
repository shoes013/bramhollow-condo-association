import { Helmet } from "react-helmet";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactForm from "@/components/contact/contact-form";
import ContactInfo from "@/components/contact/contact-info";

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | Bramhollow Condominium Association</title>
        <meta name="description" content="Get in touch with the Bramhollow Condominium Association." />
      </Helmet>
      
      <Header />
      
      <main>
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-primary">Contact Us</h1>
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

export default ContactPage;
