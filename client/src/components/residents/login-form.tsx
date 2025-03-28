import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { loginMutation } = useAuth();
  const { toast } = useToast();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onError: (error) => {
        toast({
          title: "Login failed",
          description: error.message || "Invalid username or password",
          variant: "destructive"
        });
      }
    });
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    toast({
      title: "Password Reset",
      description: "Please contact the management office to reset your password.",
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-semibold text-secondary-dark mb-4">Resident Login</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <div className="text-right mt-1">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-primary hover:text-primary-dark transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold transition-colors"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Need access? Contact the management office.</p>
          </div>
        </form>
      </Form>
      
      {showForgotPassword && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
          <p>Please contact the management office at (201) 555-1234 to reset your password.</p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
