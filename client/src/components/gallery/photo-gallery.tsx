import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Photo } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const categories = ["All", "Property", "Amenities", "Events", "Seasonal"];

const PhotoGallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
    queryFn: async () => {
      const res = await fetch("/api/photos");
      if (!res.ok) throw new Error("Failed to fetch photos");
      return res.json();
    }
  });
  
  const filteredPhotos = activeCategory === "All" 
    ? photos 
    : photos?.filter(photo => photo.category === activeCategory);
  
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary">Photo Gallery</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our beautiful community through images.
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category 
                  ? "bg-primary text-white" 
                  : "bg-white hover:bg-gray-100 text-secondary"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos?.map((photo) => (
              <div 
                key={photo.id} 
                className="overflow-hidden rounded-lg shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img 
                  src={photo.imageUrl} 
                  alt={photo.title} 
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
        
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-3xl w-full">
            <DialogHeader>
              <DialogTitle>{selectedPhoto?.title}</DialogTitle>
              <DialogDescription>{selectedPhoto?.description}</DialogDescription>
            </DialogHeader>
            <div className="mt-2">
              <img 
                src={selectedPhoto?.imageUrl} 
                alt={selectedPhoto?.title} 
                className="w-full max-h-[70vh] object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
        
        {!isLoading && filteredPhotos?.length === 0 && (
          <div className="text-center p-8 bg-gray-100 rounded-lg">
            <p className="text-gray-600">No photos available in this category.</p>
          </div>
        )}
        
        <div className="text-center mt-8">
          <Button className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold transition-colors">
            View Full Gallery
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
