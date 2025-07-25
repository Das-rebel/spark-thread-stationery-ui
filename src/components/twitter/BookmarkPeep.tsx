import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ExternalLink, Star, MessageCircle, Heart, Share, Bookmark } from "lucide-react";

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
}

interface BookmarkPeepProps {
  tweet: Tweet | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookmarkPeep({ tweet, isOpen, onClose }: BookmarkPeepProps) {
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !tweet) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <Card className="paper-card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Badge variant="secondary" className="bg-gradient-sakura text-white">
            Quick Peep
          </Badge>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Author */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-sakura rounded-full flex items-center justify-center text-xl seal-stamp">
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

          {/* Tweet Content */}
          <div className="mb-6">
            <p className="text-foreground leading-relaxed text-lg">{tweet.content}</p>
          </div>

          {/* Collection Badge */}
          {tweet.hasThread && (
            <Badge 
              variant="secondary" 
              className="mb-4 bg-gradient-ink text-white"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              {tweet.threadCount} bookmark collection
            </Badge>
          )}

          {/* Images */}
          {tweet.images.length > 0 && (
            <div className="mb-6 rounded-lg overflow-hidden shadow-paper">
              <div className={`grid gap-2 ${
                tweet.images.length === 1 ? "grid-cols-1" : 
                tweet.images.length === 2 ? "grid-cols-2" :
                "grid-cols-2"
              }`}>
                {tweet.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Bookmark image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-smooth cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}

          {/* URL Preview */}
          {tweet.url && (
            <div className="mb-6 p-4 bg-washi rounded-lg border border-border washi-texture">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-ink rounded-lg flex items-center justify-center flex-shrink-0">
                  <ExternalLink className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-bamboo font-medium">{tweet.domain}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-foreground font-medium">
                    {tweet.content.split('.')[0]}...
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tweet.url}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-bamboo">
              <MessageCircle className="w-5 h-5" />
              <span>{tweet.stats.replies}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBookmark}
              className={`flex items-center gap-2 transition-bounce ${
                isBookmarked ? "text-gold" : "text-muted-foreground hover:text-gold"
              }`}
            >
              <Star className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
              <span>{tweet.stats.retweets + (isBookmarked ? 1 : 0)}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike}
              className={`flex items-center gap-2 transition-bounce ${
                isLiked ? "text-seal" : "text-muted-foreground hover:text-seal"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              <span>{tweet.stats.likes + (isLiked ? 1 : 0)}</span>
            </Button>

            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-bamboo">
              <Share className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4">
            <Button className="flex-1 bg-gradient-sakura text-white hover:shadow-floating">
              <Bookmark className="w-4 h-4 mr-2" />
              Save to Collection
            </Button>
            <Button variant="outline" className="border-bamboo text-bamboo hover:bg-washi">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Link
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}