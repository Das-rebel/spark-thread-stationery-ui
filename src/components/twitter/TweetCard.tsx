import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, ExternalLink, Bookmark, Twitter, MessageSquare, MessageCircle } from "lucide-react";
import { CustomIcons } from "@/components/icons";
import { Link } from "react-router-dom";
import { BookmarkPeep } from "./BookmarkPeep";
import { toast } from "@/hooks/use-toast";

interface Tweet {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  stats: {
    likes: number;
    retweets: number;
    replies: number;
  };
  hasThread: boolean;
  threadCount: number;
  images: string[];
  url?: string;
  domain?: string;
  source?: 'twitter' | 'whatsapp' | 'web';
}

interface TweetCardProps {
  tweet: Tweet;
}

export function TweetCard({ tweet }: TweetCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showPeep, setShowPeep] = useState(false);
  const [longPressActive, setLongPressActive] = useState(false);
  
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartPos = useRef({ x: 0, y: 0 });

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from saved" : "Saved forever! 🔖",
      description: isBookmarked ? "Bookmark removed from your collection" : "Added to your knowledge vault",
    });
  };

  // Long press handlers
  const handleLongPressStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    touchStartPos.current = { x: clientX, y: clientY };
    setLongPressActive(true);
    
    longPressTimer.current = setTimeout(() => {
      setShowPeep(true);
      setLongPressActive(false);
    }, 500); // 500ms for long press
  }, []);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setLongPressActive(false);
  }, []);

  const handleLongPressMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!longPressTimer.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = Math.abs(clientX - touchStartPos.current.x);
    const deltaY = Math.abs(clientY - touchStartPos.current.y);
    
    // Cancel long press if user moves too much
    if (deltaX > 10 || deltaY > 10) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
      setLongPressActive(false);
    }
  }, []);

  return (
    <>
      <Card 
        className={`paper-card hover:shadow-floating transition-smooth group cursor-pointer select-none active:scale-98 ${
          longPressActive ? "scale-95 shadow-paper" : ""
        }`}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
        onTouchMove={handleLongPressMove}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onMouseMove={handleLongPressMove}
        onMouseLeave={handleLongPressEnd}
      >
      <div className="p-4">
        {/* Bookmark Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-sakura rounded-full flex items-center justify-center text-lg seal-stamp">
              {tweet.author.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink">{tweet.author.name}</span>
                {tweet.author.verified && (
                  <div className="w-5 h-5 bg-seal rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">✓</span>
                  </div>
                )}
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground text-sm">{tweet.timestamp}</span>
              </div>
              <span className="text-sm text-bamboo">{tweet.author.handle}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-smooth">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Tweet Content */}
        <div className="mb-4">
          <p className="text-foreground leading-relaxed">{tweet.content}</p>
        </div>

        {/* Collection Badge */}
        {tweet.hasThread && (
          <Link to={`/twitter/thread/${tweet.id}`}>
            <Badge 
              variant="secondary" 
              className="mb-4 hover:bg-gradient-sakura transition-smooth cursor-pointer thread-swipe"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              {tweet.threadCount} bookmark collection
            </Badge>
          </Link>
        )}

        {/* Images */}
        {tweet.images.length > 0 && (
          <div className={`mb-4 rounded-lg overflow-hidden shadow-paper ${
            tweet.images.length === 1 ? "max-h-96" : 
            tweet.images.length === 2 ? "grid grid-cols-2 gap-2 max-h-64" :
            "grid grid-cols-2 gap-2 max-h-64"
          }`}>
            {tweet.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Tweet image ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-smooth cursor-pointer"
                onClick={() => setShowPreview(true)}
              />
            ))}
          </div>
        )}
        {/* URL Preview */}
        {tweet.url && (
          <div className="mb-4 p-4 bg-washi rounded-lg border border-border washi-texture hover:shadow-paper transition-smooth cursor-pointer group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-ink rounded-lg flex items-center justify-center flex-shrink-0">
                <ExternalLink className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-bamboo font-medium">{tweet.domain}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-seal transition-smooth" />
                </div>
                <p className="text-sm text-foreground font-medium line-clamp-2">
                  {tweet.content.split('.')[0]}...
                </p>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {tweet.url}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Bookmark Preview */}
        {showPreview && (
          <div className="mb-4 p-4 bg-washi rounded-lg border border-border washi-texture">
            <div className="flex items-center gap-2 mb-2">
              <Bookmark className="w-4 h-4 text-bamboo" />
              <span className="text-sm text-bamboo font-medium">Bookmark Preview</span>
            </div>
            <p className="text-sm text-muted-foreground">
              "{tweet.content.substring(0, 100)}..." • saved by {tweet.author.name}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBookmark}
            className={`flex flex-col items-center gap-1 py-3 transition-bounce min-h-12 ${
              isBookmarked ? "text-gold" : "text-muted-foreground hover:text-gold"
            }`}
          >
            <CustomIcons.Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
            <span className="text-xs">Bookmark</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 py-3 text-muted-foreground hover:text-bamboo min-h-12">
            <CustomIcons.Share className="w-5 h-5" />
            <span className="text-xs">Share</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 py-3 text-muted-foreground hover:text-seal min-h-12">
            <CustomIcons.ActionBolt className="w-5 h-5" />
            <span className="text-xs">Actionable</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 py-3 text-muted-foreground hover:text-bamboo min-h-12">
            <CustomIcons.BrainAI className="w-5 h-5" />
            <span className="text-xs">Train AI</span>
          </Button>
        </div>

        {/* Source Badge */}
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Source:</span>
            <div className="flex items-center gap-1">
              {tweet.source === 'whatsapp' ? (
                <MessageSquare className="w-3 h-3 text-green-500" />
              ) : (
                <Twitter className="w-3 h-3 text-blue-500" />
              )}
              <span className="text-xs text-muted-foreground capitalize">
                {tweet.source || 'twitter'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>

    {/* Bookmark Peep Modal */}
    <BookmarkPeep 
      tweet={tweet}
      isOpen={showPeep}
      onClose={() => setShowPeep(false)}
    />
    </>
  );
}