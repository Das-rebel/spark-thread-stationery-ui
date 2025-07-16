import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Repeat, Share, MoreHorizontal, Eye } from "lucide-react";
import { Link } from "react-router-dom";

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
}

interface TweetCardProps {
  tweet: Tweet;
}

export function TweetCard({ tweet }: TweetCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleRetweet = () => {
    setIsRetweeted(!isRetweeted);
  };

  return (
    <Card className="paper-card hover:shadow-floating transition-smooth group">
      <div className="p-6">
        {/* Tweet Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
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
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-smooth">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Tweet Content */}
        <div className="mb-4">
          <p className="text-foreground leading-relaxed">{tweet.content}</p>
        </div>

        {/* Thread Badge */}
        {tweet.hasThread && (
          <Link to={`/twitter/thread/${tweet.id}`}>
            <Badge 
              variant="secondary" 
              className="mb-4 hover:bg-gradient-sakura transition-smooth cursor-pointer thread-swipe"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              {tweet.threadCount} tweet thread
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

        {/* Tweet Preview */}
        {showPreview && (
          <div className="mb-4 p-4 bg-washi rounded-lg border border-border washi-texture">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-bamboo" />
              <span className="text-sm text-bamboo font-medium">Tweet Preview</span>
            </div>
            <p className="text-sm text-muted-foreground">
              "{tweet.content.substring(0, 100)}..." • by {tweet.author.name}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-bamboo">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{tweet.stats.replies}</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRetweet}
            className={`flex items-center gap-2 transition-bounce ${
              isRetweeted ? "text-bamboo" : "text-muted-foreground hover:text-bamboo"
            }`}
          >
            <Repeat className="w-4 h-4" />
            <span className="text-sm">{tweet.stats.retweets + (isRetweeted ? 1 : 0)}</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLike}
            className={`flex items-center gap-2 transition-bounce ${
              isLiked ? "text-seal" : "text-muted-foreground hover:text-seal"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-sm">{tweet.stats.likes + (isLiked ? 1 : 0)}</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-bamboo">
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}