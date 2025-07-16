import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TweetCard } from "./TweetCard";
import { TweetComposer } from "./TweetComposer";

const mockTweets = [
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
      name: "AI Research Lab",
      handle: "@airesearch",
      avatar: "🔬",
      verified: true,
    },
    content: "Breaking: New breakthrough in quantum neural networks! This could revolutionize how we think about AI processing. Our paper will be published next week.",
    timestamp: "4h",
    stats: { likes: 1247, retweets: 423, replies: 167 },
    hasThread: false,
    threadCount: 0,
    images: ["https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop"],
  },
  {
    id: "3",
    author: {
      name: "Tech Innovator",
      handle: "@techinnovate",
      avatar: "💡",
      verified: false,
    },
    content: "The future of brain-computer interfaces is closer than we think. Here's what I learned at the conference:",
    timestamp: "6h",
    stats: { likes: 89, retweets: 23, replies: 12 },
    hasThread: true,
    threadCount: 12,
    images: [],
  },
  {
    id: "4",
    author: {
      name: "Data Scientist",
      handle: "@datascience",
      avatar: "📊",
      verified: false,
    },
    content: "Visualization of neural network training process. Watch how the model learns to recognize patterns over time!",
    timestamp: "8h",
    stats: { likes: 567, retweets: 134, replies: 78 },
    hasThread: false,
    threadCount: 0,
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=500&h=300&fit=crop"
    ],
  },
];

export function TwitterFeed() {
  const [tweets] = useState(mockTweets);

  return (
    <div className="space-y-6">
      {/* Compose Tweet Section */}
      <Card className="paper-card p-6">
        <TweetComposer compact />
      </Card>

      {/* Feed Header */}
      <Card className="paper-card p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-ink">Home</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Latest tweets</span>
            <div className="w-2 h-2 bg-seal rounded-full animate-pulse"></div>
          </div>
        </div>
      </Card>

      {/* Tweets */}
      <div className="space-y-4">
        {tweets.map((tweet, index) => (
          <div
            key={tweet.id}
            className="animate-fade-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <TweetCard tweet={tweet} />
          </div>
        ))}
      </div>

      {/* Load More */}
      <Card className="paper-card p-8 text-center">
        <p className="text-muted-foreground mb-4">You've caught up with the latest tweets!</p>
        <div className="w-16 h-16 mx-auto bg-gradient-sakura rounded-full flex items-center justify-center">
          <span className="text-2xl">🌸</span>
        </div>
      </Card>
    </div>
  );
}