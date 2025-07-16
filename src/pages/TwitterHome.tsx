import { AppLayout } from "@/components/layout/AppLayout";
import { TwitterFeed } from "@/components/twitter/TwitterFeed";
import { TwitterSidebar } from "@/components/twitter/TwitterSidebar";

const TwitterHome = () => {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-paper">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TwitterSidebar />
            </div>
            
            {/* Main Feed */}
            <div className="lg:col-span-3">
              <TwitterFeed />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TwitterHome;