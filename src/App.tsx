import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TwitterHome from "./pages/TwitterHome";
import TwitterExplore from "./pages/TwitterExplore";
import TwitterNotifications from "./pages/TwitterNotifications";
import ThreadView from "./pages/ThreadView";
import TweetCompose from "./pages/TweetCompose";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/twitter" element={<TwitterHome />} />
          <Route path="/twitter/explore" element={<TwitterExplore />} />
          <Route path="/twitter/notifications" element={<TwitterNotifications />} />
          <Route path="/twitter/thread/:threadId" element={<ThreadView />} />
          <Route path="/twitter/compose" element={<TweetCompose />} />
          <Route path="/twitter/messages" element={<TwitterHome />} />
          <Route path="/twitter/profile" element={<TwitterHome />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
