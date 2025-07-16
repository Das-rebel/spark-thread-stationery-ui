import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Image, Smile, MapPin, Calendar, Hash } from "lucide-react";

interface TweetComposerProps {
  compact?: boolean;
}

export function TweetComposer({ compact = false }: TweetComposerProps) {
  const [tweetText, setTweetText] = useState("");
  const maxLength = 280;

  const handleSubmit = () => {
    if (tweetText.trim()) {
      // Handle tweet submission
      console.log("Tweet submitted:", tweetText);
      setTweetText("");
    }
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gradient-sakura rounded-full flex items-center justify-center text-xl">
            🧠
          </div>
          <div className="flex-1">
            <Textarea
              placeholder="What's sparking in your brain?"
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              className="min-h-[80px] border-none bg-transparent resize-none text-lg placeholder:text-muted-foreground focus-visible:ring-0"
              maxLength={maxLength}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between pl-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-bamboo hover:text-seal">
              <Image className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-bamboo hover:text-seal">
              <Smile className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-bamboo hover:text-seal">
              <Hash className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`text-sm ${
              tweetText.length > maxLength * 0.9 ? "text-seal" : "text-muted-foreground"
            }`}>
              {maxLength - tweetText.length}
            </span>
            <Button 
              variant="ink" 
              onClick={handleSubmit}
              disabled={!tweetText.trim() || tweetText.length > maxLength}
            >
              Tweet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="paper-card p-6">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-ink">Compose Tweet</h2>
        
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gradient-sakura rounded-full flex items-center justify-center text-xl">
            🧠
          </div>
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder="What's sparking in your brain today?"
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              className="min-h-[120px] text-lg border-border focus-visible:ring-1 focus-visible:ring-ring"
              maxLength={maxLength}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-bamboo hover:text-seal">
                  <Image className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-bamboo hover:text-seal">
                  <Smile className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-bamboo hover:text-seal">
                  <MapPin className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-bamboo hover:text-seal">
                  <Calendar className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-bamboo hover:text-seal">
                  <Hash className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border-2 ${
                    tweetText.length > maxLength * 0.9 ? "border-seal" : "border-muted"
                  } relative`}>
                    <div 
                      className={`absolute inset-0 rounded-full ${
                        tweetText.length > maxLength ? "bg-seal" : "bg-bamboo"
                      }`}
                      style={{
                        clipPath: `polygon(0 0, ${Math.min((tweetText.length / maxLength) * 100, 100)}% 0, ${Math.min((tweetText.length / maxLength) * 100, 100)}% 100%, 0 100%)`
                      }}
                    />
                  </div>
                  <span className={`text-sm ${
                    tweetText.length > maxLength * 0.9 ? "text-seal" : "text-muted-foreground"
                  }`}>
                    {maxLength - tweetText.length}
                  </span>
                </div>
                
                <Button 
                  variant="ink" 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!tweetText.trim() || tweetText.length > maxLength}
                  className="px-8"
                >
                  Tweet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}