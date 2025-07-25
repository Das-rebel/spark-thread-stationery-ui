import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CustomIcons } from '@/components/icons';
import { Sparkles, Calendar } from 'lucide-react';

interface UserGreetingProps {
  userName?: string;
  avatar?: string;
  className?: string;
}

export function UserGreeting({ 
  userName = "Knowledge Seeker", 
  avatar = "🧠",
  className 
}: UserGreetingProps) {
  const currentHour = new Date().getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getTimeBasedEmoji = () => {
    if (currentHour < 6) return "🌙";
    if (currentHour < 12) return "☀️";
    if (currentHour < 17) return "🌤️";
    return "🌅";
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Card className={`paper-card p-6 bg-gradient-sakura ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-ink rounded-full flex items-center justify-center text-xl seal-stamp">
            {avatar}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink flex items-center gap-2">
              {getGreeting()}, {userName}! {getTimeBasedEmoji()}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{today}</span>
            </div>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" className="text-bamboo hover:text-seal">
          <CustomIcons.Settings className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-ink">247</div>
          <div className="text-xs text-muted-foreground">Bookmarks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-ink">12</div>
          <div className="text-xs text-muted-foreground">Collections</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-ink">89%</div>
          <div className="text-xs text-muted-foreground">AI Trained</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Ready to learn
          </Badge>
          <div className="text-xs text-muted-foreground">
            Last active: 2 minutes ago
          </div>
        </div>
      </div>
    </Card>
  );
}