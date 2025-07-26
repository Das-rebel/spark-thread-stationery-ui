import React, { useState } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { TwitterSidebar } from "@/components/twitter/TwitterSidebar";
import { SearchInput } from "@/components/search/SearchInput";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomIcons } from "@/components/icons";
import { TrendingUp, Clock, Users, Hash } from "lucide-react";

const trendingTopics = [
  { id: '1', text: 'Japanese Aesthetics', count: 1247, category: 'Design' },
  { id: '2', text: 'Productivity Systems', count: 892, category: 'Work' },
  { id: '3', text: 'Mindful Living', count: 567, category: 'Lifestyle' },
  { id: '4', text: 'React Patterns', count: 423, category: 'Tech' },
  { id: '5', text: 'Reading Lists', count: 334, category: 'Learning' },
];

const recentSearches = [
  'machine learning basics',
  'japanese design principles',
  'productivity workflows',
  'mindfulness practices',
];

const collections = [
  { id: '1', name: 'Design Inspiration', count: 45, color: 'bg-gradient-sakura' },
  { id: '2', name: 'Tech Articles', count: 78, color: 'bg-gradient-ink' },
  { id: '3', name: 'Life Philosophy', count: 23, color: 'bg-gradient-paper' },
];

export default function TwitterSearch() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setIsSearching(true);
    // Simulate search
    setTimeout(() => {
      setSearchResults([
        // Mock search results would go here
      ]);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="min-h-screen pb-20">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border shadow-elegant">
          <div className="p-4">
            <SearchInput 
              placeholder="Search bookmarks, notes, and collections..."
              onSearch={handleSearch}
              className="w-full"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          <Tabs defaultValue="discover" className="w-full">
            <TabsList className="grid w-full grid-cols-3 paper-card shadow-floating">
              <TabsTrigger value="discover" className="text-xs">Discover</TabsTrigger>
              <TabsTrigger value="collections" className="text-xs">Collections</TabsTrigger>
              <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-4">
              {/* Trending Section */}
              <Card className="paper-card shadow-floating p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-ink">Trending Topics</h3>
                </div>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={topic.id} className="flex items-center justify-between group hover:bg-muted/50 rounded-lg p-2 -m-2 transition-smooth cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-sakura rounded-full flex items-center justify-center text-xs font-bold text-seal">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{topic.text}</div>
                          <div className="text-xs text-muted-foreground">{topic.count.toLocaleString()} items</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {topic.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="paper-card shadow-floating p-4">
                <h3 className="font-semibold text-ink mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex flex-col gap-2 hover:bg-muted/50 transition-smooth">
                    <CustomIcons.BrainAI className="w-6 h-6 text-primary" />
                    <span className="text-xs">Train AI</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col gap-2 hover:bg-muted/50 transition-smooth">
                    <CustomIcons.Analytics className="w-6 h-6 text-bamboo" />
                    <span className="text-xs">Analytics</span>
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="collections" className="space-y-4">
              <Card className="paper-card shadow-floating p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="w-5 h-5 text-bamboo" />
                  <h3 className="font-semibold text-ink">Your Collections</h3>
                </div>
                <div className="space-y-3">
                  {collections.map((collection) => (
                    <div key={collection.id} className="flex items-center justify-between group hover:bg-muted/50 rounded-lg p-3 -m-1 transition-smooth cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${collection.color} rounded-lg flex items-center justify-center`}>
                          <CustomIcons.Bookmark className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{collection.name}</div>
                          <div className="text-xs text-muted-foreground">{collection.count} items</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-smooth">
                        <CustomIcons.SearchEnhanced className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card className="paper-card shadow-floating p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold text-ink">Recent Searches</h3>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left p-3 h-auto hover:bg-muted/50 transition-smooth"
                      onClick={() => handleSearch(search)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="flex-1">{search}</span>
                        <CustomIcons.SearchEnhanced className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-smooth" />
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <TwitterSidebar />
    </AppLayout>
  );
}