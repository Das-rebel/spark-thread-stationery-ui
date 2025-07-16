import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Image, Smile, MapPin, Calendar, Hash, Link, Tag } from "lucide-react";

interface TweetComposerProps {
  compact?: boolean;
}

export function TweetComposer({ compact = false }: TweetComposerProps) {
  const [bookmarkText, setBookmarkText] = useState("");
  const [bookmarkUrl, setBookmarkUrl] = useState("");
  const [tags, setTags] = useState("");
  const maxLength = 500;

  const handleSubmit = () => {
    if (bookmarkText.trim() || bookmarkUrl.trim()) {
      // Handle bookmark submission
      console.log("Bookmark submitted:", { text: bookmarkText, url: bookmarkUrl, tags });
      setBookmarkText("");
      setBookmarkUrl("");
      setTags("");
    }
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gradient-sakura rounded-full flex items-center justify-center text-xl">
            🧠
          </div>
          <div className="flex-1 space-y-3">
            <Input
              placeholder="Paste URL to bookmark..."
              value={bookmarkUrl}
              onChange={(e) => setBookmarkUrl(e.target.value)}
              className="border-border bg-washi"
            />
            <Textarea
              placeholder="Add your thoughts about this bookmark..."
              value={bookmarkText}
              onChange={(e) => setBookmarkText(e.target.value)}
              className="min-h-[60px] border-none bg-transparent resize-none placeholder:text-muted-foreground focus-visible:ring-0"
              maxLength={maxLength}
            />
            <Input
              placeholder="Add tags (#tech #article #research)..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border-none bg-transparent text-sm placeholder:text-muted-foreground focus-visible:ring-0"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between pl-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-bamboo hover:text-seal">
              <Link className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-bamboo hover:text-seal">
              <Tag className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-bamboo hover:text-seal">
              <Image className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`text-sm ${
              bookmarkText.length > maxLength * 0.9 ? "text-seal" : "text-muted-foreground"
            }`}>
              {maxLength - bookmarkText.length}
            </span>
            <Button 
              variant="ink" 
              onClick={handleSubmit}
              disabled={!bookmarkText.trim() && !bookmarkUrl.trim() || bookmarkText.length > maxLength}
            >
              Save Bookmark
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="paper-card p-6">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-ink">Save New Bookmark</h2>
        
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gradient-sakura rounded-full flex items-center justify-center text-xl">
            🧠
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-sm font-medium text-ink mb-2 block">URL to Bookmark</label>
              <Input
                placeholder="https://example.com/amazing-article"
                value={bookmarkUrl}
                onChange={(e) => setBookmarkUrl(e.target.value)}
                className="border-border focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-ink mb-2 block">Your Thoughts</label>
              <Textarea
                placeholder="Why is this worth bookmarking? What insights did you gain?"
                value={bookmarkText}
                onChange={(e) => setBookmarkText(e.target.value)}
                className="min-h-[120px] border-border focus-visible:ring-1 focus-visible:ring-ring"
                maxLength={maxLength}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-ink mb-2 block">Tags</label>
              <Input
                placeholder="#technology #ai #research #tutorial"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="border-border focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-bamboo hover:text-seal">
                  <Link className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-bamboo hover:text-seal">
                  <Tag className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-bamboo hover:text-seal">
                  <Image className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-bamboo hover:text-seal">
                  <Calendar className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border-2 ${
                    bookmarkText.length > maxLength * 0.9 ? "border-seal" : "border-muted"
                  } relative`}>
                    <div 
                      className={`absolute inset-0 rounded-full ${
                        bookmarkText.length > maxLength ? "bg-seal" : "bg-bamboo"
                      }`}
                      style={{
                        clipPath: `polygon(0 0, ${Math.min((bookmarkText.length / maxLength) * 100, 100)}% 0, ${Math.min((bookmarkText.length / maxLength) * 100, 100)}% 100%, 0 100%)`
                      }}
                    />
                  </div>
                  <span className={`text-sm ${
                    bookmarkText.length > maxLength * 0.9 ? "text-seal" : "text-muted-foreground"
                  }`}>
                    {maxLength - bookmarkText.length}
                  </span>
                </div>
                
                <Button 
                  variant="ink" 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!bookmarkText.trim() && !bookmarkUrl.trim() || bookmarkText.length > maxLength}
                  className="px-8"
                >
                  Save Bookmark
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}