import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Listings from "./pages/Listings.tsx";
import VehicleDetail from "./pages/VehicleDetail.tsx";
import Consultation from "./pages/Consultation.tsx";
import Learn from "./pages/Learn.tsx";
import ArticleDetail from "./pages/ArticleDetail.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/vehicle/:id" element={<VehicleDetail />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:slug" element={<ArticleDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
