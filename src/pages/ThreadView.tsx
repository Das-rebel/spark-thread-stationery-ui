import { AppLayout } from "@/components/layout/AppLayout";
import { ThreadViewer } from "@/components/twitter/ThreadViewer";
import { TwitterSidebar } from "@/components/twitter/TwitterSidebar";
import { useParams } from "react-router-dom";

const ThreadView = () => {
  const { threadId } = useParams();

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-paper">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TwitterSidebar />
            </div>
            
            {/* Thread View */}
            <div className="lg:col-span-3">
              <ThreadViewer threadId={threadId} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ThreadView;