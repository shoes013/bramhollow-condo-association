import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Mail, Phone, Users } from "lucide-react";

// Simulated directory data - in a real app, this would come from the API
const residentData = [
  { id: 1, name: "Jennifer Harmon", unit: "101", email: "jharmon@example.com", phone: "(201) 555-1001", role: "President" },
  { id: 2, name: "Michael Chen", unit: "205", email: "mchen@example.com", phone: "(201) 555-1002", role: "Vice President" },
  { id: 3, name: "Sarah Johnson", unit: "310", email: "sjohnson@example.com", phone: "(201) 555-1003", role: "Treasurer" },
  { id: 4, name: "Robert Williams", unit: "402", email: "rwilliams@example.com", phone: "(201) 555-1004", role: "Secretary" },
  { id: 5, name: "David Thompson", unit: "103", email: "dthompson@example.com", phone: "(201) 555-1005" },
  { id: 6, name: "Lisa Garcia", unit: "208", email: "lgarcia@example.com", phone: "(201) 555-1006" },
  { id: 7, name: "James Wilson", unit: "315", email: "jwilson@example.com", phone: "(201) 555-1007" },
  { id: 8, name: "Emily Davis", unit: "407", email: "edavis@example.com", phone: "(201) 555-1008" },
  { id: 9, name: "Daniel Martinez", unit: "105", email: "dmartinez@example.com", phone: "(201) 555-1009" },
  { id: 10, name: "Patricia Lee", unit: "212", email: "plee@example.com", phone: "(201) 555-1010" },
];

const committees = [
  { id: 1, name: "Landscape Committee", members: [1, 5, 8] },
  { id: 2, name: "Social Committee", members: [3, 6, 9] },
  { id: 3, name: "Architectural Review", members: [2, 4, 7] },
  { id: 4, name: "Finance Committee", members: [3, 10] },
];

const MemberDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  const getCommitteeName = (residentId: number) => {
    const residentCommittees = committees.filter(committee => 
      committee.members.includes(residentId)
    );
    return residentCommittees.map(c => c.name).join(", ");
  };
  
  const getBoardTitle = (residentId: number) => {
    const resident = residentData.find(r => r.id === residentId);
    return resident?.role || "";
  };
  
  const filteredResidents = residentData.filter(resident => {
    const matchesSearch = 
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.unit.includes(searchTerm) ||
      resident.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "board") return matchesSearch && resident.role;
    
    // Filter by committee
    const committeeId = parseInt(filter);
    const committee = committees.find(c => c.id === committeeId);
    return matchesSearch && committee?.members.includes(resident.id);
  });
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Community Directory</h2>
        <p className="text-gray-600">Connect with your neighbors and community members</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Search Directory</CardTitle>
          <CardDescription>Find residents by name, unit, or email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search by name, unit, or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="board">Board</TabsTrigger>
                <TabsTrigger value="1">Landscape</TabsTrigger>
                <TabsTrigger value="2">Social</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredResidents.length > 0 ? (
          filteredResidents.map((resident) => (
            <Card key={resident.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{resident.name}</h3>
                    <p className="text-sm text-gray-500">Unit {resident.unit}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0" title="Email">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0" title="Call">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{resident.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{resident.phone}</span>
                  </div>
                  {resident.role && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium text-primary">{resident.role}</span>
                    </div>
                  )}
                  {getCommitteeName(resident.id) && (
                    <div className="pt-2 mt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">Committees:</span>
                      <p className="text-sm font-medium">{getCommitteeName(resident.id)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No residents found matching your search criteria.</p>
            <Button variant="link" onClick={() => {setSearchTerm(""); setFilter("all");}}>
              Clear search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDirectory;
