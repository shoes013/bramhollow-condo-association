import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ProtectedRoute } from "@/lib/protected-route";

import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AboutPage from "@/pages/about-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import DocumentsPage from "@/pages/documents-page";
import NewsPage from "@/pages/news-page";
import GalleryPage from "@/pages/gallery-page";
import ContactPage from "@/pages/contact-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/documents" component={DocumentsPage} />
      <Route path="/news" component={NewsPage} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/contact" component={ContactPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
