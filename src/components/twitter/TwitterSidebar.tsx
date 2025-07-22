import { Button } from "@/components/ui/button";
import { Home, Search, Bell, Mail, User, Plus, MessageCircle, Repeat, Heart, Share, Bookmark, Star, Archive, Brain } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Home", href: "/twitter" },
  { icon: Bookmark, label: "Collections", href: "/twitter/explore" },
  { icon: Star, label: "Favorites", href: "/twitter/notifications" },
  { icon: Archive, label: "Archive", href: "/twitter/messages" },
  { icon: User, label: "Profile", href: "/twitter/profile" },
];

export function TwitterSidebar() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-floating z-50 max-w-md mx-auto safe-area-inset-bottom">
      {/* Mobile Bottom Navigation */}
      <div className="flex items-center justify-around py-3 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`
              flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-smooth min-w-0 flex-1
              ${location.pathname === item.href 
                ? 'text-primary' 
                : 'text-muted-foreground'
              }
            `}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium truncate">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}