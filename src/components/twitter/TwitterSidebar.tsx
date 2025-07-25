import { Button } from "@/components/ui/button";
import { Home, Bell, Mail, User, Bookmark, Star, Archive } from "lucide-react";
import { CustomIcons } from "@/components/icons";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Home", href: "/twitter" },
  { icon: CustomIcons.SearchEnhanced, label: "Search", href: "/twitter/search" },
  { icon: Bookmark, label: "Collections", href: "/twitter/explore" },
  { icon: Star, label: "Favorites", href: "/twitter/notifications" },
  { icon: CustomIcons.Settings, label: "Settings", href: "/twitter/settings" },
];

export function TwitterSidebar() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-floating z-50 max-w-md mx-auto safe-area-inset-bottom">
      {/* Mobile Bottom Navigation with Enhanced Effects */}
      <div className="flex items-center justify-around py-3 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`
                flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-300 min-w-0 flex-1 group
                ${isActive 
                  ? 'text-primary scale-110 bg-primary/10' 
                  : 'text-muted-foreground hover:text-primary hover:scale-105'
                }
              `}
            >
              <div className={`transition-all duration-300 ${isActive ? 'animate-pulse' : 'group-hover:animate-bounce'}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'drop-shadow-lg' : ''}`} />
              </div>
              <span className={`text-xs font-medium truncate transition-all duration-300 ${
                isActive ? 'font-semibold' : ''
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}