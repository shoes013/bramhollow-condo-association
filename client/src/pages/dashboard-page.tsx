import { useState } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import MaintenanceRequestForm from "@/components/dashboard/maintenance-request-form";
import PaymentSection from "@/components/dashboard/payment-section";
import MemberDirectory from "@/components/dashboard/member-directory";
import DocumentBrowser from "@/components/documents/document-browser";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ClipboardList, FileText, Users } from "lucide-react";
import { format } from "date-fns";

type DashboardTab = "overview" | "payments" | "maintenance" | "documents" | "directory";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const { user } = useAuth();
  
  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: async () => {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    }
  });
  
  const { data: maintenanceRequests } = useQuery({
    queryKey: ["/api/maintenance-requests"],
    queryFn: async () => {
      const res = await fetch("/api/maintenance-requests");
      if (!res.ok) throw new Error("Failed to fetch maintenance requests");
      return res.json();
    },
    enabled: activeTab === "overview" || activeTab === "maintenance"
  });

  const renderTabContent = () => {
    switch(activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Due This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$250.00</div>
                  <p className="text-xs text-muted-foreground mt-1">Next payment: Oct 1, 2023</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{maintenanceRequests?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active requests</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground mt-1">Association documents</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{events?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Community events</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {events && events.length > 0 ? (
                    <div className="space-y-4">
                      {events.slice(0, 3).map(event => (
                        <div key={event.id} className="flex">
                          <div className="flex-shrink-0 bg-primary-light text-white rounded-md p-2 mr-4 text-center w-14">
                            <div className="text-xs font-semibold">{format(new Date(event.startTime), "MMM").toUpperCase()}</div>
                            <div className="text-xl font-bold">{format(new Date(event.startTime), "dd")}</div>
                          </div>
                          <div>
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {format(new Date(event.startTime), "h:mm a")} @ {event.location}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No upcoming events scheduled</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClipboardList className="mr-2 h-5 w-5" />
                    Recent Maintenance Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {maintenanceRequests && maintenanceRequests.length > 0 ? (
                    <div className="space-y-4">
                      {maintenanceRequests.slice(0, 3).map((request: any) => (
                        <div key={request.id} className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{request.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              request.status === "completed" ? "bg-green-100 text-green-800" :
                              request.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{request.description.substring(0, 60)}...</p>
                          <p className="text-xs text-gray-500 mt-2">Submitted: {format(new Date(request.createdAt), "MMM dd, yyyy")}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No maintenance requests found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "payments":
        return <PaymentSection />;
      case "maintenance":
        return <MaintenanceRequestForm />;
      case "documents":
        return <DocumentBrowser />;
      case "directory":
        return <MemberDirectory />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Resident Dashboard | Bramhollow Condominium Association</title>
        <meta name="description" content="Access your resident dashboard to pay dues, submit maintenance requests, and more." />
      </Helmet>
      
      <Header />
      
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Welcome, {user?.firstName || user?.username}!</h1>
          <p className="text-gray-600 mb-6">Access your resident dashboard</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-1">
              <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            
            <div className="lg:col-span-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default DashboardPage;
