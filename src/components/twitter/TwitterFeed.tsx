import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TweetCard } from "./TweetCard";
import { TweetComposer } from "./TweetComposer";
import { PullToRefresh } from "@/components/ui/pulltorefresh";
import { toast } from "@/hooks/use-toast";

const mockBookmarks = [
  {
    id: "1",
    author: {
      name: "Neural Network Expert",
      handle: "@neuralexpert",
      avatar: "🧠",
      verified: true,
    },
    content: "Just discovered this amazing article on neural networks! The insights are incredible. Collection below 📚",
    timestamp: "2h",
    stats: { likes: 324, retweets: 89, replies: 45 },
    hasThread: true,
    threadCount: 7,
    images: [],
    url: "https://example.com/neural-networks-article",
    domain: "towardsdatascience.com",
  },
  {
    id: "2",
    author: {
      name: "AI Research Lab",
      handle: "@airesearch",
      avatar: "🔬",
      verified: true,
    },
    content: "Essential reading: Breakthrough research in quantum neural networks! This could revolutionize AI processing. Saved for future reference.",
    timestamp: "4h",
    stats: { likes: 1247, retweets: 423, replies: 167 },
    hasThread: false,
    threadCount: 0,
    images: ["/api/placeholder/500/300"],
    url: "https://arxiv.org/abs/quantum-neural-networks",
    domain: "arxiv.org",
  },
  {
    id: "3",
    author: {
      name: "Tech Innovator",
      handle: "@techinnovate",
      avatar: "💡",
      verified: false,
    },
    content: "Great collection of brain-computer interface resources. Here's what I learned and bookmarked from the conference:",
    timestamp: "6h",
    stats: { likes: 89, retweets: 23, replies: 12 },
    hasThread: true,
    threadCount: 12,
    images: [],
    url: "https://example.com/bci-resources",
    domain: "conference.bci.org",
  },
  {
    id: "4",
    author: {
      name: "Data Scientist",
      handle: "@datascience",
      avatar: "📊",
      verified: false,
    },
    content: "Bookmarked: Amazing visualization of neural network training process. Watch how the model learns to recognize patterns over time!",
    timestamp: "8h",
    stats: { likes: 567, retweets: 134, replies: 78 },
    hasThread: false,
    threadCount: 0,
    images: [
      "/api/placeholder/500/300",
      "/api/placeholder/500/300"
    ],
    url: "https://example.com/neural-viz",
    domain: "visualizations.ai",
  },
];

export function TwitterFeed() {
  const [bookmarks, setBookmarks] = useState(mockBookmarks);

  const handleRefresh = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add a new mock bookmark to demonstrate refresh
    const newBookmark = {
      id: String(Date.now()),
      author: {
        name: "Fresh Knowledge",
        handle: "@freshknowledge",
        avatar: "✨",
        verified: false,
      },
      content: "Just refreshed! Here's a brand new bookmark about the latest breakthrough in AI research.",
      timestamp: "now",
      stats: { likes: 0, retweets: 0, replies: 0 },
      hasThread: false,
      threadCount: 0,
      images: [],
      url: "https://example.com/fresh-ai-research",
      domain: "research.ai",
    };
    
    setBookmarks(prev => [newBookmark, ...prev]);
    toast({
      title: "Feed refreshed! ↓",
      description: "New bookmarks loaded successfully",
    });
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-6">
      {/* Compose Bookmark Section */}
      <Card className="paper-card p-6">
        <TweetComposer compact />
      </Card>

      {/* Feed Header */}
      <Card className="paper-card p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-ink">Knowledge Feed</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Latest bookmarks</span>
            <div className="w-2 h-2 bg-seal rounded-full animate-pulse"></div>
          </div>
        </div>
      </Card>

      {/* Bookmarks */}
      <div className="space-y-4">
        {bookmarks.map((bookmark, index) => (
          <div
            key={bookmark.id}
            className="animate-fade-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <TweetCard tweet={bookmark} />
          </div>
        ))}
      </div>

      {/* Load More */}
      <Card className="paper-card p-8 text-center">
        <p className="text-muted-foreground mb-4">You've caught up with all your bookmarks!</p>
        <div className="w-16 h-16 mx-auto bg-gradient-sakura rounded-full flex items-center justify-center">
          <span className="text-2xl">📚</span>
        </div>
      </Card>
    </div>
    </PullToRefresh>
  );
}