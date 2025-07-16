import { AppLayout } from "@/components/layout/AppLayout";
import { TwitterSidebar } from "@/components/twitter/TwitterSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Users, Hash } from "lucide-react";

const trendingTopics = [
  { tag: "#NeuralNetworks", tweets: "234K", growth: "+12%" },
  { tag: "#MachineLearning", tweets: "187K", growth: "+8%" },
  { tag: "#AI", tweets: "456K", growth: "+15%" },
  { tag: "#DeepLearning", tweets: "98K", growth: "+5%" },
  { tag: "#TechInnovation", tweets: "76K", growth: "+23%" },
];

const suggestedUsers = [
  { name: "Dr. Neural", handle: "@drneural", followers: "125K", bio: "AI Researcher at Tech Corp" },
  { name: "Code Whisperer", handle: "@codewhisper", followers: "89K", bio: "ML Engineer & Blogger" },
  { name: "Data Sage", handle: "@datasage", followers: "203K", bio: "Chief Data Scientist" },
];

const TwitterExplore = () => {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-paper">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TwitterSidebar />
            </div>
            
            {/* Explore Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search Bar */}
              <Card className="paper-card p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="Search for topics, people, or keywords..."
                    className="pl-10 bg-washi border-border"
                  />
                </div>
              </Card>

              {/* Trending Topics */}
              <Card className="paper-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-seal" />
                  <h2 className="text-xl font-bold text-ink">Trending Topics</h2>
                </div>
                
                <div className="space-y-4">
                  {trendingTopics.map((topic, index) => (
                    <div 
                      key={topic.tag}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-gradient-sakura transition-smooth cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gradient-ink rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-ink group-hover:text-seal ink-brush-underline">
                            {topic.tag}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {topic.tweets} tweets
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-bamboo text-white">
                        {topic.growth}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Suggested Users */}
              <Card className="paper-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-bamboo" />
                  <h2 className="text-xl font-bold text-ink">Suggested for You</h2>
                </div>
                
                <div className="space-y-4">
                  {suggestedUsers.map((user) => (
                    <div 
                      key={user.handle}
                      className="flex items-center justify-between p-4 rounded-lg hover:shadow-paper transition-smooth"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-sakura rounded-full flex items-center justify-center text-xl">
                          🧠
                        </div>
                        <div>
                          <h3 className="font-semibold text-ink">{user.name}</h3>
                          <p className="text-sm text-bamboo">{user.handle}</p>
                          <p className="text-xs text-muted-foreground">{user.bio}</p>
                          <p className="text-xs text-muted-foreground">{user.followers} followers</p>
                        </div>
                      </div>
                      <Button variant="ink" size="sm">
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Popular Categories */}
              <Card className="paper-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Hash className="w-6 h-6 text-gold" />
                  <h2 className="text-xl font-bold text-ink">Popular Categories</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    "Technology", "Science", "Research", "Innovation", 
                    "Programming", "Data Science", "Robotics", "Startups"
                  ].map((category) => (
                    <Button 
                      key={category}
                      variant="washi" 
                      className="h-auto p-4 flex-col hover:shadow-floating transition-bounce"
                    >
                      <span className="font-medium">{category}</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {Math.floor(Math.random() * 100) + 10}k tweets
                      </span>
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TwitterExplore;