import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import ExplorePage from "./pages/ExplorePage";
import HistoryPage from "./pages/HistoryPage";
import SavedPage from "./pages/SavedPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedBackground />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
