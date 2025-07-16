import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TweetCard } from "./TweetCard";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface ThreadViewerProps {
  threadId?: string;
}

const mockThread = [
  {
    id: "1",
    author: {
      name: "Neural Network Expert",
      handle: "@neuralexpert",
      avatar: "🧠",
      verified: true,
    },
    content: "Just finished training a new transformer model! The results are incredible. Thread below 🧵",
    timestamp: "2h",
    stats: { likes: 324, retweets: 89, replies: 45 },
    hasThread: true,
    threadCount: 7,
    images: [],
  },
  {
    id: "2",
    author: {
      name: "Neural Network Expert",
      handle: "@neuralexpert",
      avatar: "🧠",
      verified: true,
    },
    content: "1/ The architecture uses a novel attention mechanism that allows for better context understanding across longer sequences. Here's what makes it special:",
    timestamp: "2h",
    stats: { likes: 156, retweets: 34, replies: 23 },
    hasThread: false,
    threadCount: 0,
    images: ["https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop"],
  },
  {
    id: "3",
    author: {
      name: "Neural Network Expert",
      handle: "@neuralexpert",
      avatar: "🧠",
      verified: true,
    },
    content: "2/ Multi-head attention with positional encoding improvements. Instead of the traditional sinusoidal approach, we're using learned embeddings that adapt during training.",
    timestamp: "2h",
    stats: { likes: 89, retweets: 12, replies: 8 },
    hasThread: false,
    threadCount: 0,
    images: [],
  },
  {
    id: "4",
    author: {
      name: "Neural Network Expert",
      handle: "@neuralexpert",
      avatar: "🧠",
      verified: true,
    },
    content: "3/ The model shows 15% improvement on GLUE benchmarks and 23% improvement on our internal reasoning tasks. The training was surprisingly stable too.",
    timestamp: "2h",
    stats: { likes: 234, retweets: 67, replies: 34 },
    hasThread: false,
    threadCount: 0,
    images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop"],
  },
  {
    id: "5",
    author: {
      name: "Neural Network Expert",
      handle: "@neuralexpert",
      avatar: "🧠",
      verified: true,
    },
    content: "4/ Implementation details: 12 layers, 768 hidden dims, 12 attention heads. Trained on 40GB of curated text data over 3 weeks on 8x A100s.",
    timestamp: "2h",
    stats: { likes: 178, retweets: 45, replies: 19 },
    hasThread: false,
    threadCount: 0,
    images: [],
  },
];

export function ThreadViewer({ threadId }: ThreadViewerProps) {
  const [currentTweetIndex, setCurrentTweetIndex] = useState(0);
  const [isSwipeMode, setIsSwipeMode] = useState(false);

  const currentTweet = mockThread[currentTweetIndex];
  const totalTweets = mockThread.length;

  const handlePrevious = () => {
    if (currentTweetIndex > 0) {
      setCurrentTweetIndex(currentTweetIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentTweetIndex < totalTweets - 1) {
      setCurrentTweetIndex(currentTweetIndex + 1);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
  };

  useEffect(() => {
    if (isSwipeMode) {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [currentTweetIndex, isSwipeMode]);

  return (
    <div className="space-y-6">
      {/* Thread Header */}
      <Card className="paper-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/twitter">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-ink">Thread</h1>
              <p className="text-sm text-muted-foreground">
                by {currentTweet.author.name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={isSwipeMode ? "sakura" : "outline"} 
              onClick={() => setIsSwipeMode(!isSwipeMode)}
              className="seal-stamp"
            >
              {isSwipeMode ? "List View" : "Swipe View"}
            </Button>
          </div>
        </div>
      </Card>

      {isSwipeMode ? (
        /* Swipe Mode */
        <div className="relative">
          <Card className="paper-card-floating min-h-[400px]">
            <div className="p-6">
              {/* Tweet Counter */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-bamboo font-medium">
                    {currentTweetIndex + 1} of {totalTweets}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: totalTweets }).map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-smooth ${
                          index === currentTweetIndex ? "bg-seal" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevious}
                    disabled={currentTweetIndex === 0}
                    className="hover:bg-gradient-sakura"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNext}
                    disabled={currentTweetIndex === totalTweets - 1}
                    className="hover:bg-gradient-sakura"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Current Tweet */}
              <div className="thread-swipe">
                <TweetCard tweet={currentTweet} />
              </div>

              {/* Navigation Hint */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Use ← → arrow keys or buttons to navigate
                </p>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* List Mode */
        <div className="space-y-4">
          {mockThread.map((tweet, index) => (
            <div
              key={tweet.id}
              className="animate-fade-slide-up relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Thread Connection Line */}
              {index < mockThread.length - 1 && (
                <div className="absolute left-6 top-20 w-0.5 h-8 bg-gradient-sakura z-10" />
              )}
              
              <TweetCard tweet={tweet} />
              
              {/* Thread Number Badge */}
              <div className="absolute top-4 left-4 w-6 h-6 bg-seal text-white rounded-full flex items-center justify-center text-xs font-bold z-20">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Thread Summary */}
      <Card className="paper-card p-6 bg-gradient-sakura">
        <h3 className="text-lg font-semibold text-ink mb-3">Thread Summary</h3>
        <p className="text-sm text-foreground mb-4">
          This thread discusses a breakthrough in transformer architecture with improved attention mechanisms, 
          showing significant performance gains on benchmark tasks.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>🧵 {totalTweets} tweets</span>
          <span>💬 {mockThread.reduce((sum, tweet) => sum + tweet.stats.replies, 0)} replies</span>
          <span>❤️ {mockThread.reduce((sum, tweet) => sum + tweet.stats.likes, 0)} likes</span>
        </div>
      </Card>
    </div>
  );
}