import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Index from "./pages/Index";
import TwitterHome from "./pages/TwitterHome";
import TwitterExplore from "./pages/TwitterExplore";
import TwitterNotifications from "./pages/TwitterNotifications";
import TwitterMessages from "./pages/TwitterMessages";
import TwitterProfile from "./pages/TwitterProfile";
import TwitterSearch from "./pages/TwitterSearch";
import UserSettings from "./pages/UserSettings";
import ThreadView from "./pages/ThreadView";
import TweetCompose from "./pages/TweetCompose";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/twitter" element={<TwitterHome />} />
            <Route path="/twitter/explore" element={<TwitterExplore />} />
            <Route path="/twitter/notifications" element={<TwitterNotifications />} />
            <Route path="/twitter/search" element={<TwitterSearch />} />
            <Route path="/twitter/settings" element={<UserSettings />} />
            <Route path="/twitter/thread/:threadId" element={<ThreadView />} />
            <Route path="/twitter/compose" element={<TweetCompose />} />
            <Route path="/twitter/messages" element={<TwitterMessages />} />
            <Route path="/twitter/profile" element={<TwitterProfile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
