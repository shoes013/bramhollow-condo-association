import { Helmet } from "react-helmet";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AboutSection from "@/components/about/about-section";

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Bramhollow Condominium Association</title>
        <meta name="description" content="Learn about Bramhollow Condominium Association's history, mission, and board members." />
      </Helmet>
      
      <Header />
      
      <main>
        <AboutSection />
      </main>
      
      <Footer />
    </>
  );
};

export default AboutPage;
