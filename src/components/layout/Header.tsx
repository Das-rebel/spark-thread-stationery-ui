import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Menu, Brain, RefreshCw, CheckCircle, XCircle, Clock, Twitter, MessageSquare, Globe, Settings, Info } from "lucide-react";
import { Link } from "react-router-dom";

interface Source {
  id: string;
  name: string;
  icon: React.ElementType;
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync: string;
  count: number;
  color: string;
}

const sources: Source[] = [
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: Twitter,
    status: 'connected',
    lastSync: '2 mins ago',
    count: 1247,
    color: 'text-blue-500'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageSquare,
    status: 'syncing',
    lastSync: 'Syncing...',
    count: 89,
    color: 'text-green-500'
  },
  {
    id: 'web',
    name: 'Web Clips',
    icon: Globe,
    status: 'disconnected',
    lastSync: '1 hour ago',
    count: 324,
    color: 'text-purple-500'
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState<string | null>(null);

  const handleRefresh = async (sourceId: string) => {
    setRefreshing(sourceId);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(null);
  };

  const getStatusIcon = (status: Source['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'syncing':
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
    }
  };

  const getStatusBadge = (status: Source['status']) => {
    const variants = {
      connected: 'bg-green-500/10 text-green-600 border-green-500/20',
      disconnected: 'bg-red-500/10 text-red-600 border-red-500/20',
      syncing: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
    };
    
    return (
      <Badge variant="outline" className={variants[status]}>
        {status}
      </Badge>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-sakura rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-seal" />
          </div>
          <span className="font-display font-semibold text-lg text-ink">Brain Spark</span>
        </Link>

        {/* Hamburger Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-washi">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          
          <SheetContent side="right" className="w-80 p-0">
            <SheetHeader className="p-6 border-b border-border">
              <SheetTitle className="flex items-center gap-2 font-display">
                <Settings className="w-5 h-5 text-bamboo" />
                Sources & Settings
              </SheetTitle>
            </SheetHeader>

            <div className="p-6 space-y-6">
              {/* Sources Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-ink">Data Sources</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      sources.forEach(source => handleRefresh(source.id));
                    }}
                    className="text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Sync All
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {sources.map((source) => (
                    <Card key={source.id} className="paper-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 bg-gradient-sakura rounded-full flex items-center justify-center`}>
                            <source.icon className={`w-4 h-4 ${source.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{source.name}</span>
                              {getStatusIcon(source.status)}
                            </div>
                            <p className="text-xs text-muted-foreground">{source.lastSync}</p>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRefresh(source.id)}
                          disabled={refreshing === source.id}
                          className="w-8 h-8"
                        >
                          <RefreshCw 
                            className={`w-4 h-4 ${refreshing === source.id ? 'animate-spin' : ''}`} 
                          />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(source.status)}
                          <span className="text-xs text-muted-foreground">
                            {source.count} items
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Settings Links */}
              <div>
                <h3 className="font-semibold text-ink mb-4">Settings</h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start gap-3 text-sm">
                    <Settings className="w-4 h-4" />
                    General Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3 text-sm">
                    <Brain className="w-4 h-4" />
                    AI Training
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3 text-sm">
                    <Info className="w-4 h-4" />
                    About
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}