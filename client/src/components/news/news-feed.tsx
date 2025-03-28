import { useQuery } from "@tanstack/react-query";
import { News } from "@shared/schema";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const NewsFeed = () => {
  const { data: newsItems, isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
    queryFn: async () => {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    }
  });
  
  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMMM dd, yyyy");
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-8 bg-gray-50 rounded-lg shadow-sm overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-48">
                <Skeleton className="h-48 w-full" />
              </div>
              <div className="p-6 w-full">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-4/5 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-xl font-semibold text-secondary-dark mb-6">Recent Updates</h3>
      
      {newsItems?.map((item) => (
        <div key={item.id} className="mb-8 bg-gray-50 rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-48">
              <img 
                src={item.imageUrl || "https://images.unsplash.com/photo-1470075801209-17f9ec0cada6"} 
                alt={item.title} 
                className="h-48 w-full md:w-48 object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <i className="far fa-calendar-alt mr-2"></i>
                <span>{formatDate(item.createdAt)}</span>
              </div>
              <h4 className="font-semibold text-secondary-dark text-lg mb-2">{item.title}</h4>
              <p className="text-gray-600 mb-4">
                {item.content.length > 150 ? `${item.content.substring(0, 150)}...` : item.content}
              </p>
              <Link href={`/news/${item.id}`}>
                <a className="text-primary hover:text-primary-dark font-semibold text-sm transition-colors">
                  Read more <i className="fas fa-arrow-right ml-1"></i>
                </a>
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      <div className="text-center mt-8">
        <Link href="/news">
          <Button variant="outline" className="inline-block bg-white border border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-colors">
            View All News
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NewsFeed;
