import { Helmet } from "react-helmet";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PhotoGallery from "@/components/gallery/photo-gallery";

const GalleryPage = () => {
  return (
    <>
      <Helmet>
        <title>Photo Gallery | Bramhollow Condominium Association</title>
        <meta name="description" content="Explore our beautiful community through images." />
      </Helmet>
      
      <Header />
      
      <main>
        <PhotoGallery />
      </main>
      
      <Footer />
    </>
  );
};

export default GalleryPage;
