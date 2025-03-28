import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertMaintenanceRequestSchema, MaintenanceRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const maintenanceSchema = insertMaintenanceRequestSchema.extend({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

const MaintenanceRequestForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { data: maintenanceRequests, isLoading } = useQuery<MaintenanceRequest[]>({
    queryKey: ["/api/maintenance-requests"],
    queryFn: async () => {
      const res = await fetch("/api/maintenance-requests");
      if (!res.ok) throw new Error("Failed to fetch maintenance requests");
      return res.json();
    }
  });
  
  const createRequestMutation = useMutation({
    mutationFn: async (values: MaintenanceFormValues) => {
      return apiRequest("POST", "/api/maintenance-requests", values);
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "Your maintenance request has been submitted successfully.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance-requests"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      title: "",
      description: "",
    }
  });

  const onSubmit = (values: MaintenanceFormValues) => {
    createRequestMutation.mutate(values);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Maintenance Requests</h2>
        <p className="text-gray-600">Submit and track maintenance requests for your unit</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>New Maintenance Request</CardTitle>
          <CardDescription>
            Please provide details about the issue that needs attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Leaking Faucet, HVAC Issue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please describe the issue in detail, including location and when it started"
                        rows={5}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="mt-2" 
                disabled={createRequestMutation.isPending}
              >
                {createRequestMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Maintenance History</h3>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : maintenanceRequests && maintenanceRequests.length > 0 ? (
          <div className="space-y-4">
            {maintenanceRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{request.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>Submitted: {format(new Date(request.createdAt), "MMM dd, yyyy")}</span>
                        {request.updatedAt && request.updatedAt !== request.createdAt && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Last Updated: {format(new Date(request.updatedAt), "MMM dd, yyyy")}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      request.status === "completed" ? "bg-green-100 text-green-800" :
                      request.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">You haven't submitted any maintenance requests yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MaintenanceRequestForm;
