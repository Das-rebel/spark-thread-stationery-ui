import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Search, Bell, Mail, User, Plus, MessageCircle, Repeat, Heart, Share } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigationItems = [
  { icon: Home, label: "Home", path: "/twitter" },
  { icon: Search, label: "Explore", path: "/twitter/explore" },
  { icon: Bell, label: "Notifications", path: "/twitter/notifications" },
  { icon: Mail, label: "Messages", path: "/twitter/messages" },
  { icon: User, label: "Profile", path: "/twitter/profile" },
];

export function TwitterSidebar() {
  const location = useLocation();

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Card className="paper-card p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-ink flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-sakura rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-seal" />
            </div>
            Brain Spark
          </h2>
          
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "sakura" : "ghost"}
                    className="w-full justify-start gap-3 text-left"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <Link to="/twitter/compose">
            <Button variant="ink" size="floating" className="w-full">
              <Plus className="w-5 h-5 mr-2" />
              New Tweet
            </Button>
          </Link>
        </div>
      </Card>

      {/* Trending */}
      <Card className="paper-card p-6">
        <h3 className="text-lg font-semibold text-ink mb-4">Trending Topics</h3>
        <div className="space-y-3">
          {["#NeuralNetworks", "#AI", "#MachineLearning", "#TechTrends", "#Innovation"].map((trend, index) => (
            <div key={trend} className="group cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-bamboo group-hover:text-seal transition-smooth ink-brush-underline">
                  {trend}
                </span>
                <span className="text-xs text-muted-foreground">
                  {Math.floor(Math.random() * 100) + 10}k tweets
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Suggestions */}
      <Card className="paper-card p-6">
        <h3 className="text-lg font-semibold text-ink mb-4">Who to Follow</h3>
        <div className="space-y-4">
          {[
            { name: "AI Research Lab", handle: "@airesearch", verified: true },
            { name: "Neural Network Hub", handle: "@neuralnet", verified: false },
            { name: "Tech Innovators", handle: "@techinnovate", verified: true },
          ].map((user) => (
            <div key={user.handle} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-sakura rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-seal" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-ink">{user.name}</span>
                    {user.verified && (
                      <div className="w-4 h-4 bg-seal rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">✓</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{user.handle}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}