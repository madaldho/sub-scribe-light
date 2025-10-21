import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { Loader2 } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import Subscriptions from "./pages/Subscriptions";
import AddSubscription from "./pages/AddSubscription";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy load pages that are not frequently accessed or contain heavy dependencies
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));
const SubscriptionDetail = lazy(() => import("./pages/SubscriptionDetail"));
const EditSubscription = lazy(() => import("./pages/EditSubscription"));

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Optimize React Query for better performance with large data and concurrent users
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes to reduce API calls
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests once
      retry: 1,
      // Don't refetch on window focus to reduce server load
      refetchOnWindowFocus: false,
      // Refetch on mount only if data is stale
      refetchOnMount: true,
      // Don't refetch on reconnect to reduce server load
      refetchOnReconnect: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
            <Route path="/subscriptions" element={<ProtectedRoute><MainLayout><Subscriptions /></MainLayout></ProtectedRoute>} />
            <Route path="/add" element={<ProtectedRoute><MainLayout><AddSubscription /></MainLayout></ProtectedRoute>} />
            <Route 
              path="/subscription/:id" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<PageLoader />}>
                      <SubscriptionDetail />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/subscription/:id/edit" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<PageLoader />}>
                      <EditSubscription />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<PageLoader />}>
                      <Analytics />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<PageLoader />}>
                      <Settings />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
