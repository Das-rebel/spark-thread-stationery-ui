import { AppLayout } from "@/components/layout/AppLayout";
import { TwitterSidebar } from "@/components/twitter/TwitterSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomIcons } from "@/components/icons";
import { Heart, MessageCircle, Repeat, UserPlus, Bell } from "lucide-react";

const notifications = [
  {
    id: "1",
    type: "like",
    user: { name: "AI Research Lab", handle: "@airesearch", avatar: "🔬" },
    action: "liked your tweet",
    content: "Just finished training a new transformer model!",
    timestamp: "2m",
    unread: true,
  },
  {
    id: "2",
    type: "retweet",
    user: { name: "Neural Network Expert", handle: "@neuralexpert", avatar: "🧠" },
    action: "retweeted your tweet",
    content: "Breaking: New breakthrough in quantum neural networks!",
    timestamp: "15m",
    unread: true,
  },
  {
    id: "3",
    type: "reply",
    user: { name: "Tech Innovator", handle: "@techinnovate", avatar: "💡" },
    action: "replied to your tweet",
    content: "This is incredible! Can you share more details about the implementation?",
    timestamp: "1h",
    unread: false,
  },
  {
    id: "4",
    type: "follow",
    user: { name: "Data Scientist", handle: "@datascience", avatar: "📊" },
    action: "started following you",
    content: null,
    timestamp: "3h",
    unread: false,
  },
  {
    id: "5",
    type: "mention",
    user: { name: "ML Engineer", handle: "@mlengineer", avatar: "⚙️" },
    action: "mentioned you in a tweet",
    content: "Great insights from @yourusername about neural network architectures!",
    timestamp: "5h",
    unread: false,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "like": return <Heart className="w-5 h-5 text-seal" />;
    case "retweet": return <Repeat className="w-5 h-5 text-bamboo" />;
    case "reply": return <MessageCircle className="w-5 h-5 text-bamboo" />;
    case "follow": return <UserPlus className="w-5 h-5 text-bamboo" />;
    case "mention": return <Bell className="w-5 h-5 text-gold" />;
    default: return <Bell className="w-5 h-5 text-muted-foreground" />;
  }
};

const TwitterNotifications = () => {
  return (
    <AppLayout>
      <div className="min-h-screen pb-20">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border shadow-elegant">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-seal" />
                <h1 className="text-xl font-bold text-ink">Notifications</h1>
                <Badge variant="secondary" className="bg-seal text-white text-xs">
                  {notifications.filter(n => n.unread).length}
                </Badge>
              </div>
              
              <Button variant="outline" size="sm" className="text-xs">
                Mark all as read
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 paper-card shadow-floating">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="mentions" className="text-xs">Mentions</TabsTrigger>
              <TabsTrigger value="likes" className="text-xs">Likes</TabsTrigger>
              <TabsTrigger value="retweets" className="text-xs">Retweets</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-6">
              {notifications.map((notification, index) => (
                <Card 
                  key={notification.id}
                  className={`paper-card shadow-floating hover:shadow-deep transition-smooth cursor-pointer ${
                    notification.unread ? "border-l-4 border-l-seal" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Notification Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* User Avatar */}
                      <div className="w-10 h-10 bg-gradient-sakura rounded-full flex items-center justify-center text-lg flex-shrink-0">
                        {notification.user.avatar}
                      </div>

                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-ink text-sm">
                            {notification.user.name}
                          </span>
                          <span className="text-bamboo text-xs">
                            {notification.user.handle}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {notification.action}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            · {notification.timestamp}
                          </span>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-seal rounded-full"></div>
                          )}
                        </div>

                        {notification.content && (
                          <div className="p-3 bg-washi/50 rounded-lg border border-border mt-2">
                            <p className="text-sm text-foreground">
                              {notification.content}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {notification.type === "follow" && (
                          <Button variant="outline" size="sm" className="text-xs">
                            Follow back
                          </Button>
                        )}
                        {notification.type === "reply" && (
                          <Button variant="outline" size="sm" className="text-xs">
                            Reply
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="mentions" className="space-y-3 mt-6">
              {notifications.filter(n => n.type === "mention").map((notification, index) => (
                <Card 
                  key={notification.id}
                  className="paper-card shadow-floating hover:shadow-deep transition-smooth cursor-pointer"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="w-10 h-10 bg-gradient-sakura rounded-full flex items-center justify-center text-lg flex-shrink-0">
                        {notification.user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-ink text-sm">
                            {notification.user.name}
                          </span>
                          <span className="text-bamboo text-xs">
                            {notification.user.handle}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {notification.action}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            · {notification.timestamp}
                          </span>
                        </div>
                        {notification.content && (
                          <div className="p-3 bg-washi/50 rounded-lg border border-border mt-2">
                            <p className="text-sm text-foreground">
                              {notification.content}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="likes" className="space-y-3 mt-6">
              {notifications.filter(n => n.type === "like").map((notification, index) => (
                <Card 
                  key={notification.id}
                  className="paper-card shadow-floating hover:shadow-deep transition-smooth cursor-pointer"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="w-10 h-10 bg-gradient-sakura rounded-full flex items-center justify-center text-lg flex-shrink-0">
                        {notification.user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-ink text-sm">
                            {notification.user.name}
                          </span>
                          <span className="text-bamboo text-xs">
                            {notification.user.handle}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {notification.action}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            · {notification.timestamp}
                          </span>
                        </div>
                        {notification.content && (
                          <div className="p-3 bg-washi/50 rounded-lg border border-border mt-2">
                            <p className="text-sm text-foreground">
                              {notification.content}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="retweets" className="space-y-3 mt-6">
              {notifications.filter(n => n.type === "retweet").map((notification, index) => (
                <Card 
                  key={notification.id}
                  className="paper-card shadow-floating hover:shadow-deep transition-smooth cursor-pointer"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="w-10 h-10 bg-gradient-sakura rounded-full flex items-center justify-center text-lg flex-shrink-0">
                        {notification.user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-ink text-sm">
                            {notification.user.name}
                          </span>
                          <span className="text-bamboo text-xs">
                            {notification.user.handle}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {notification.action}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            · {notification.timestamp}
                          </span>
                        </div>
                        {notification.content && (
                          <div className="p-3 bg-washi/50 rounded-lg border border-border mt-2">
                            <p className="text-sm text-foreground">
                              {notification.content}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {/* Load More */}
          <Card className="paper-card shadow-floating p-6 text-center">
            <p className="text-muted-foreground mb-4 text-sm">You're all caught up!</p>
            <div className="w-12 h-12 mx-auto bg-gradient-sakura rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-seal" />
            </div>
          </Card>
        </div>
      </div>
      <TwitterSidebar />
    </AppLayout>
  );
};

export default TwitterNotifications;