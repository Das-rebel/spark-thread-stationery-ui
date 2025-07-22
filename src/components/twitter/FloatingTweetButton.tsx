import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TweetComposer } from "./TweetComposer";
import { Plus, Bookmark } from "lucide-react";

export function FloatingTweetButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ink" 
          size="icon"
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-floating hover:shadow-deep transition-bounce z-40 seal-stamp max-w-md mx-auto"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="paper-card max-w-2xl">
        <TweetComposer />
      </DialogContent>
    </Dialog>
  );
}