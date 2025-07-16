import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Search, Bell, Mail, User, Plus, MessageCircle, Repeat, Heart, Share, Bookmark, Star, Archive, Brain } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigationItems = [
  { icon: Home, label: "Home", path: "/twitter" },
  { icon: Bookmark, label: "Collections", path: "/twitter/explore" },
  { icon: Star, label: "Favorites", path: "/twitter/notifications" },
  { icon: Archive, label: "Archive", path: "/twitter/messages" },
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
              <Brain className="w-5 h-5 text-seal" />
            </div>
            Second Brain
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
              New Bookmark
            </Button>
          </Link>
        </div>
      </Card>

      {/* Knowledge Categories */}
      <Card className="paper-card p-6">
        <h3 className="text-lg font-semibold text-ink mb-4">Knowledge Categories</h3>
        <div className="space-y-3">
          {["#TechArticles", "#Research", "#Tutorials", "#Inspiration", "#Tools"].map((category, index) => (
            <div key={category} className="group cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-bamboo group-hover:text-seal transition-smooth ink-brush-underline">
                  {category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {Math.floor(Math.random() * 50) + 5} bookmarks
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Sources */}
      <Card className="paper-card p-6">
        <h3 className="text-lg font-semibold text-ink mb-4">Recent Sources</h3>
        <div className="space-y-4">
          {[
            { name: "Medium Articles", handle: "medium.com", verified: true },
            { name: "Dev Community", handle: "dev.to", verified: false },
            { name: "GitHub Repos", handle: "github.com", verified: true },
          ].map((source) => (
            <div key={source.handle} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-sakura rounded-full flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-seal" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-ink">{source.name}</span>
                    {source.verified && (
                      <div className="w-4 h-4 bg-seal rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">✓</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{source.handle}</span>
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