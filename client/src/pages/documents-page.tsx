import { Helmet } from "react-helmet";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DocumentBrowser from "@/components/documents/document-browser";

const DocumentsPage = () => {
  return (
    <>
      <Helmet>
        <title>Documents | Bramhollow Condominium Association</title>
        <meta name="description" content="Access important association documents and forms." />
      </Helmet>
      
      <Header />
      
      <main>
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-primary">Documents</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Access important association documents and forms.
              </p>
            </div>
            
            <DocumentBrowser />
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default DocumentsPage;
