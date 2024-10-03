import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import SubredditExplorer from "./components/SubredditExplorer";
import ManagedPosts from "./components/ManagedPosts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="flex">
            <Navigation />
            <main className="ml-64 flex-1 p-4">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/subreddit-explorer" element={<SubredditExplorer />} />
                <Route path="/managed-posts" element={<ManagedPosts />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;