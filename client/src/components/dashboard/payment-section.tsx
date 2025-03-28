import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Check, AlertCircle } from "lucide-react";

const PaymentSection = () => {
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment process
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful",
        description: "Your payment of $250.00 has been processed successfully.",
        variant: "default",
      });
    }, 2000);
  };
  
  const upcomingPayments = [
    { id: 1, description: "Monthly HOA Dues - October 2023", amount: 250.00, dueDate: "2023-10-01" },
    { id: 2, description: "Monthly HOA Dues - November 2023", amount: 250.00, dueDate: "2023-11-01" },
    { id: 3, description: "Monthly HOA Dues - December 2023", amount: 250.00, dueDate: "2023-12-01" },
  ];
  
  const paymentHistory = [
    { id: 1, description: "Monthly HOA Dues - September 2023", amount: 250.00, date: "2023-09-01", status: "paid" },
    { id: 2, description: "Monthly HOA Dues - August 2023", amount: 250.00, date: "2023-08-01", status: "paid" },
    { id: 3, description: "Monthly HOA Dues - July 2023", amount: 250.00, date: "2023-07-01", status: "paid" },
    { id: 4, description: "Special Assessment - Pool Renovation", amount: 500.00, date: "2023-06-15", status: "paid" },
  ];
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Payments</h2>
        <p className="text-gray-600">Manage your HOA dues and special assessment payments</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Make a Payment</CardTitle>
            <CardDescription>
              Pay your upcoming association dues or special assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
                <TabsTrigger value="custom">Custom Payment</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="mt-4">
                <div className="space-y-4">
                  {upcomingPayments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-4 border rounded-md">
                      <div>
                        <div className="font-medium">{payment.description}</div>
                        <div className="text-sm text-gray-500">
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${payment.amount.toFixed(2)}</div>
                        <Button size="sm" className="mt-2" onClick={handlePayment} disabled={isProcessing}>
                          {isProcessing ? "Processing..." : "Pay Now"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="custom" className="mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="payment-type">Payment Type</Label>
                      <select
                        id="payment-type"
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="dues">Regular Dues</option>
                        <option value="special">Special Assessment</option>
                        <option value="other">Other Payment</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Input
                      id="notes"
                      placeholder="Add any notes about this payment"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 border-t pt-6">
              <h4 className="font-medium mb-4">Payment Method</h4>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="creditCard" id="creditCard" />
                  <Label htmlFor="creditCard" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ach" id="ach" />
                  <Label htmlFor="ach" className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    ACH Bank Transfer
                  </Label>
                </div>
              </RadioGroup>
              
              {paymentMethod === "creditCard" && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiration Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}
              
              {paymentMethod === "ach" && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      placeholder="XXXXXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="XXXXXXXXXXXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Holder Name</Label>
                    <Input
                      id="accountName"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="mt-2 w-full" onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Make Payment"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Balance Due:</span>
                <span className="font-semibold">$250.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Due Date:</span>
                <span>Oct 1, 2023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="text-green-600">Current</span>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">2023 Payment Summary</h4>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Paid:</span>
                  <span>$2,750.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span>$750.00</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="bg-blue-50 p-3 rounded-md text-sm w-full">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="font-medium text-blue-800">Automatic Payments</p>
                  <p className="text-blue-700 mt-1">Set up recurring payments and never miss a due date.</p>
                  <Button size="sm" variant="link" className="p-0 h-auto mt-1 text-blue-600">
                    Enroll Now
                  </Button>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Review your past payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="text-left py-3 px-2">Description</th>
                  <th className="text-right py-3 px-2">Amount</th>
                  <th className="text-right py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-b">
                    <td className="py-3 px-2">{new Date(payment.date).toLocaleDateString()}</td>
                    <td className="py-3 px-2">{payment.description}</td>
                    <td className="text-right py-3 px-2">${payment.amount.toFixed(2)}</td>
                    <td className="text-right py-3 px-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        payment.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {payment.status === "paid" ? "Paid" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="outline" size="sm">Export to PDF</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSection;
