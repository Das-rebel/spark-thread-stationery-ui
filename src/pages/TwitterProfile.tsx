import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TwitterSidebar } from "@/components/twitter/TwitterSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TweetCard } from "@/components/twitter/TweetCard";
import { Calendar, MapPin, Link as LinkIcon, Settings, MessageCircle, Mail, Star, Bookmark } from "lucide-react";

const mockProfile = {
  name: "Knowledge Curator",
  handle: "@knowledgecurator",
  avatar: "📚",
  verified: true,
  bio: "Collecting and curating the best knowledge resources across technology, science, and innovation. Second brain enthusiast.",
  location: "Digital Library",
  website: "knowledge-hub.com",
  joinDate: "March 2020",
  following: 1247,
  followers: 8932,
  stats: {
    bookmarks: 2847,
    collections: 42,
    likes: 15632,
  }
};

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
      name: "Data Scientist",
      handle: "@datascience",
      avatar: "📊",
      verified: false,
    },
    content: "Amazing visualization of neural network training process. Watch how the model learns to recognize patterns over time!",
    timestamp: "1d",
    stats: { likes: 567, retweets: 134, replies: 78 },
    hasThread: false,
    threadCount: 0,
    images: ["/api/placeholder/500/300"],
    url: "https://example.com/neural-viz",
    domain: "visualizations.ai",
  },
];

const TwitterProfile = () => {
  const [activeTab, setActiveTab] = useState("bookmarks");

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-paper">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TwitterSidebar />
            </div>
            
            {/* Profile Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Header */}
              <Card className="paper-card overflow-hidden">
                {/* Cover Image */}
                <div className="h-48 bg-gradient-ink relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-seal/20 to-bamboo/20"></div>
                </div>
                
                {/* Profile Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-sakura rounded-full flex items-center justify-center text-3xl seal-stamp -mt-10 border-4 border-white shadow-floating">
                        {mockProfile.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h1 className="text-2xl font-bold text-ink">{mockProfile.name}</h1>
                          {mockProfile.verified && (
                            <div className="w-6 h-6 bg-seal rounded-full flex items-center justify-center">
                              <span className="text-sm text-white">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-bamboo">{mockProfile.handle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-foreground mb-4 leading-relaxed">{mockProfile.bio}</p>

                  {/* Profile Details */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {mockProfile.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <LinkIcon className="w-4 h-4" />
                      <a href="#" className="text-seal hover:underline">{mockProfile.website}</a>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {mockProfile.joinDate}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="font-bold text-ink">{mockProfile.following.toLocaleString()}</span>
                      <span className="text-muted-foreground ml-1">Following</span>
                    </div>
                    <div>
                      <span className="font-bold text-ink">{mockProfile.followers.toLocaleString()}</span>
                      <span className="text-muted-foreground ml-1">Followers</span>
                    </div>
                    <div>
                      <span className="font-bold text-ink">{mockProfile.stats.bookmarks.toLocaleString()}</span>
                      <span className="text-muted-foreground ml-1">Bookmarks</span>
                    </div>
                    <div>
                      <span className="font-bold text-ink">{mockProfile.stats.collections}</span>
                      <span className="text-muted-foreground ml-1">Collections</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Profile Tabs */}
              <Card className="paper-card">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full bg-washi border-b border-border rounded-none">
                    <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4" />
                      Bookmarks
                    </TabsTrigger>
                    <TabsTrigger value="collections" className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Collections
                    </TabsTrigger>
                    <TabsTrigger value="likes" className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Likes
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="bookmarks" className="p-6 space-y-4">
                    {mockBookmarks.map((bookmark) => (
                      <TweetCard key={bookmark.id} tweet={bookmark} />
                    ))}
                  </TabsContent>

                  <TabsContent value="collections" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.from({ length: 6 }, (_, i) => (
                        <Card key={i} className="p-4 hover:shadow-floating transition-smooth cursor-pointer">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-sakura rounded-lg flex items-center justify-center text-xl">
                              🧠
                            </div>
                            <div>
                              <h3 className="font-semibold text-ink">Neural Networks</h3>
                              <p className="text-sm text-muted-foreground">24 bookmarks</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Curated collection of neural network research, tutorials, and breakthroughs.
                          </p>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="likes" className="p-6 space-y-4">
                    {mockBookmarks.map((bookmark) => (
                      <TweetCard key={bookmark.id} tweet={bookmark} />
                    ))}
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TwitterProfile;