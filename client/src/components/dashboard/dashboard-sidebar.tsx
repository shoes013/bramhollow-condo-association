import { 
  Home, 
  CreditCard, 
  Wrench, 
  FileText, 
  Users,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardSidebar = ({ activeTab, setActiveTab }: DashboardSidebarProps) => {
  const navItems = [
    { id: "overview", label: "Overview", icon: <Home className="mr-2 h-5 w-5" /> },
    { id: "payments", label: "Payments", icon: <CreditCard className="mr-2 h-5 w-5" /> },
    { id: "maintenance", label: "Maintenance Requests", icon: <Wrench className="mr-2 h-5 w-5" /> },
    { id: "documents", label: "Documents", icon: <FileText className="mr-2 h-5 w-5" /> },
    { id: "directory", label: "Member Directory", icon: <Users className="mr-2 h-5 w-5" /> }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-primary text-white">
        <h3 className="font-semibold">Resident Portal</h3>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <Button
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === item.id 
                    ? "bg-secondary/20 font-medium" 
                    : ""
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
                {activeTab === item.id && <ChevronRight className="ml-auto h-4 w-4" />}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 mt-2 border-t">
        <div className="text-xs text-gray-500 mb-2">Quick Links</div>
        <ul className="space-y-1 text-sm">
          <li>
            <a href="#" className="text-primary hover:underline">Community Calendar</a>
          </li>
          <li>
            <a href="#" className="text-primary hover:underline">Reserve Amenities</a>
          </li>
          <li>
            <a href="#" className="text-primary hover:underline">Board Meeting Schedule</a>
          </li>
          <li>
            <a href="#" className="text-primary hover:underline">FAQ</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardSidebar;
