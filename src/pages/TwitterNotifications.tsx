import { AppLayout } from "@/components/layout/AppLayout";
import { TwitterSidebar } from "@/components/twitter/TwitterSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="min-h-screen bg-gradient-paper">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TwitterSidebar />
            </div>
            
            {/* Notifications Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Header */}
              <Card className="paper-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6 text-seal" />
                    <h1 className="text-2xl font-bold text-ink">Notifications</h1>
                    <Badge variant="secondary" className="bg-seal text-white">
                      {notifications.filter(n => n.unread).length}
                    </Badge>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Mark all as read
                  </Button>
                </div>
              </Card>

              {/* Notification Filters */}
              <Card className="paper-card p-4">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {["All", "Mentions", "Likes", "Retweets", "Follows"].map((filter) => (
                    <Button 
                      key={filter}
                      variant={filter === "All" ? "sakura" : "ghost"}
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Notifications List */}
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <Card 
                    key={notification.id}
                    className={`paper-card hover:shadow-floating transition-smooth cursor-pointer ${
                      notification.unread ? "border-l-4 border-l-seal" : ""
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
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
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-ink">
                              {notification.user.name}
                            </span>
                            <span className="text-bamboo text-sm">
                              {notification.user.handle}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {notification.action}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              · {notification.timestamp}
                            </span>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-seal rounded-full"></div>
                            )}
                          </div>

                          {notification.content && (
                            <div className="p-3 bg-washi rounded-lg border border-border mt-2 washi-texture">
                              <p className="text-sm text-foreground">
                                {notification.content}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {notification.type === "follow" && (
                            <Button variant="ink" size="sm">
                              Follow back
                            </Button>
                          )}
                          {notification.type === "reply" && (
                            <Button variant="outline" size="sm">
                              Reply
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <Card className="paper-card p-8 text-center">
                <p className="text-muted-foreground mb-4">You're all caught up!</p>
                <div className="w-16 h-16 mx-auto bg-gradient-sakura rounded-full flex items-center justify-center">
                  <Bell className="w-8 h-8 text-seal" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TwitterNotifications;