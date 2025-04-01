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
import { Event, Assessment, UserAssessment, BoardMemberRole } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CalendarIcon, 
  ClipboardList, 
  FileText, 
  Users,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type DashboardTab = "overview" | "payments" | "maintenance" | "documents" | "directory" | "training";

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

  // Fetch assessments and user's assessments data
  const { data: assessments } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments"],
    queryFn: async () => {
      const res = await fetch("/api/assessments");
      if (!res.ok) throw new Error("Failed to fetch assessments");
      return res.json();
    },
    enabled: activeTab === "training"
  });
  
  const { data: userAssessments } = useQuery<UserAssessment[]>({
    queryKey: ["/api/user-assessments"],
    queryFn: async () => {
      const res = await fetch("/api/user-assessments");
      if (!res.ok) throw new Error("Failed to fetch user assessments");
      return res.json();
    },
    enabled: activeTab === "training"
  });
  
  const { data: expiredAssessments } = useQuery<UserAssessment[]>({
    queryKey: ["/api/user-assessments/expired"],
    queryFn: async () => {
      const res = await fetch("/api/user-assessments/expired");
      if (!res.ok) throw new Error("Failed to fetch expired assessments");
      return res.json();
    },
    enabled: activeTab === "training"
  });
  
  const { data: boardMemberRoles } = useQuery<BoardMemberRole[]>({
    queryKey: ["/api/board-members/user"],
    queryFn: async () => {
      const res = await fetch("/api/board-members/user");
      if (!res.ok) throw new Error("Failed to fetch board member roles");
      return res.json();
    },
    enabled: activeTab === "training"
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
      case "training":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-lg shadow-md mb-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Training Hub</h2>
              <p className="text-white/80">
                Complete required assessments to maintain your qualifications for board and committee positions.
                All modules are designed to ensure Bramhollow stays compliant with the New Jersey Condominium Act (N.J.S.A. 46:8B-1 et. seq.).
              </p>
            </div>
            
            {boardMemberRoles && boardMemberRoles.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5 text-primary" />
                    Your Board Position
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {boardMemberRoles.map(role => (
                      <div key={role.id} className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
                        <div>
                          <h3 className="font-medium text-lg">{role.role}</h3>
                          <p className="text-sm text-gray-600">
                            Since: {format(new Date(role.startDate), "MMMM yyyy")}
                          </p>
                        </div>
                        <Badge variant={role.isActive ? "default" : "outline"}>
                          {role.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-primary" />
                      Available Assessments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {assessments && assessments.length > 0 ? (
                      <div className="space-y-6">
                        {assessments.map(assessment => {
                          const userAssessment = userAssessments?.find(ua => ua.assessmentId === assessment.id);
                          const isPassed = userAssessment?.passed;
                          const isExpired = expiredAssessments?.some(ea => ea.assessmentId === assessment.id);
                          
                          let statusBadge;
                          if (isPassed && !isExpired) {
                            statusBadge = <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
                          } else if (isExpired) {
                            statusBadge = <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" /> Expired</Badge>;
                          } else if (userAssessment) {
                            statusBadge = <Badge variant="outline"><Clock className="h-3 w-3 mr-1" /> In Progress</Badge>;
                          } else {
                            statusBadge = <Badge variant="secondary">Not Started</Badge>;
                          }
                          
                          return (
                            <div key={assessment.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-medium">{assessment.title}</h3>
                                {statusBadge}
                              </div>
                              <p className="text-gray-600 mb-4">{assessment.description}</p>
                              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mb-4">
                                <div className="flex items-center">
                                  <span className="font-medium mr-1">Type:</span> {assessment.moduleType.charAt(0).toUpperCase() + assessment.moduleType.slice(1)}
                                </div>
                                <div className="flex items-center">
                                  <span className="font-medium mr-1">Passing Score:</span> {assessment.passScore}%
                                </div>
                                <div className="flex items-center">
                                  <span className="font-medium mr-1">Valid For:</span> {assessment.validityPeriod} months
                                </div>
                                <div className="flex items-center">
                                  <span className="font-medium mr-1">Required:</span> {assessment.isRequired ? "Yes" : "No"}
                                </div>
                              </div>
                              
                              {userAssessment && (
                                <div className="mb-3">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Your score: {userAssessment.score}%</span>
                                    <span>{userAssessment.score >= assessment.passScore ? "Passed" : "Failed"}</span>
                                  </div>
                                  <Progress value={userAssessment.score} className="h-2" />
                                  
                                  {userAssessment.completedAt && (
                                    <div className="mt-2 text-xs text-gray-500 flex justify-between">
                                      <span>Completed: {format(new Date(userAssessment.completedAt), "MMM dd, yyyy")}</span>
                                      <span>Expires: {format(new Date(userAssessment.expiresAt), "MMM dd, yyyy")}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              <Button variant={isPassed && !isExpired ? "outline" : "default"}>
                                {isPassed && !isExpired ? "Review Assessment" : userAssessment ? "Continue Assessment" : "Start Assessment"}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No assessments available</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      Training Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                        <h4 className="font-medium">NJ Condominium Act Overview</h4>
                        <p className="text-sm text-gray-600 mt-1">Legal requirements and compliance guidelines</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                        <h4 className="font-medium">Board Member Handbook</h4>
                        <p className="text-sm text-gray-600 mt-1">Roles, responsibilities, and best practices</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                        <h4 className="font-medium">Financial Management Guide</h4>
                        <p className="text-sm text-gray-600 mt-1">Budgeting and reserve fund management</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                        <h4 className="font-medium">Meeting Procedures</h4>
                        <p className="text-sm text-gray-600 mt-1">Robert's Rules of Order and voting procedures</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                        <h4 className="font-medium">Conflict Resolution</h4>
                        <p className="text-sm text-gray-600 mt-1">Handling resident disputes and violations</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold mb-3">Need Help?</h3>
                      <p className="text-sm text-gray-600 mb-4">Contact our training coordinator for assistance with any assessment or training materials.</p>
                      <Button variant="outline" className="w-full">Contact Training Support</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
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
