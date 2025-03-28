import { Helmet } from "react-helmet";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import NewsFeed from "@/components/news/news-feed";
import EventsSidebar from "@/components/news/events-sidebar";

const NewsPage = () => {
  return (
    <>
      <Helmet>
        <title>News & Events | Bramhollow Condominium Association</title>
        <meta name="description" content="Stay up-to-date with the latest happenings in our community." />
      </Helmet>
      
      <Header />
      
      <main>
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-primary">News & Events</h1>
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
      </main>
      
      <Footer />
    </>
  );
};

export default NewsPage;
