import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const EventsSidebar = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: async () => {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    }
  });
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Please enter your email",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const res = await fetch("/api/newsletter-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      if (!res.ok) throw new Error("Subscription failed");
      
      toast({
        title: "Successfully subscribed",
        description: "Thank you for subscribing to our newsletter!"
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was a problem subscribing to the newsletter.",
        variant: "destructive"
      });
    }
  };
  
  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date);
    return {
      month: format(dateObj, "MMM").toUpperCase(),
      day: format(dateObj, "dd")
    };
  };
  
  return (
    <div>
      {/* Upcoming Events */}
      <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-secondary-dark mb-4">Upcoming Events</h3>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b border-gray-200 pb-4">
                <div className="flex">
                  <Skeleton className="h-14 w-14 mr-4" />
                  <div className="w-full">
                    <Skeleton className="h-5 w-4/5 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => {
              const { month, day } = formatDate(event.startTime);
              return (
                <div key={event.id} className="border-b border-gray-200 pb-4">
                  <div className="flex">
                    <div className="flex-shrink-0 bg-primary-light text-white rounded-md p-2 mr-4 text-center">
                      <div className="text-xs font-semibold">{month}</div>
                      <div className="text-xl font-bold">{day}</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary-dark">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")} @ {event.location}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No upcoming events</p>
        )}
        
        <div className="mt-4">
          <a href="#" className="text-primary hover:text-primary-dark text-sm font-semibold transition-colors">
            View Full Calendar <i className="fas fa-arrow-right ml-1"></i>
          </a>
        </div>
      </div>
      
      {/* Newsletter Signup */}
      <div className="bg-gray-50 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-secondary-dark mb-4">Subscribe to Newsletter</h3>
        <p className="text-gray-600 text-sm mb-4">
          Stay informed with our monthly newsletter delivered directly to your inbox.
        </p>
        
        <form onSubmit={handleSubscribe}>
          <div className="mb-3">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold transition-colors"
          >
            Subscribe
          </Button>
          
          <div className="mt-3 text-xs text-gray-500">
            We respect your privacy. Unsubscribe at any time.
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventsSidebar;
