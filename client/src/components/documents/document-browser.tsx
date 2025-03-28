import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Document } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  "Governing Documents",
  "Financial Reports",
  "Meeting Minutes",
  "Forms & Applications",
  "Newsletters",
  "Policies & Procedures"
];

const DocumentBrowser = () => {
  const [activeCategory, setActiveCategory] = useState("Governing Documents");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents", activeCategory],
    queryFn: async () => {
      const res = await fetch(`/api/documents?category=${encodeURIComponent(activeCategory)}`);
      if (!res.ok) throw new Error("Failed to fetch documents");
      return res.json();
    }
  });
  
  const filteredDocuments = documents?.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };
  
  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM dd, yyyy");
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Document Categories */}
      <div className="col-span-1">
        <div className="bg-white rounded-lg shadow-md p-5">
          <h3 className="text-lg font-semibold text-secondary-dark mb-4">Categories</h3>
          
          <div className="space-y-2">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`w-full text-left px-3 py-2 ${
                  activeCategory === category 
                    ? "bg-primary text-white" 
                    : "hover:bg-gray-100 text-secondary"
                } rounded-md flex justify-between items-center transition-colors`}
                onClick={() => setActiveCategory(category)}
              >
                <span>{category}</span>
                <i className="fas fa-chevron-right"></i>
              </button>
            ))}
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-secondary-dark mb-2">Looking for something specific?</h4>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* Document List */}
      <div className="col-span-1 md:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-secondary-dark">{activeCategory}</h3>
            <div className="text-sm text-gray-500">
              {isLoading ? "Loading..." : `${filteredDocuments?.length || 0} documents`}
            </div>
          </div>
          
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border-b border-gray-200 pb-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredDocuments?.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">No documents found in this category</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredDocuments?.map((document) => (
                <div key={document.id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-secondary-dark">{document.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{document.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>Last updated: {formatDate(document.updatedAt)}</span>
                        <span className="mx-2">•</span>
                        <span>{document.fileType.split('/')[1].toUpperCase()}, {formatSize(document.fileSize)}</span>
                      </div>
                    </div>
                    <Button className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-colors flex items-center">
                      <i className="fas fa-download mr-1"></i> Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentBrowser;
