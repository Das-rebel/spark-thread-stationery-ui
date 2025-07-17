import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TwitterSidebar } from "@/components/twitter/TwitterSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, Phone, Video, MoreVertical, Send, Paperclip, Smile } from "lucide-react";

const mockConversations = [
  {
    id: "1",
    name: "Neural Network Expert",
    handle: "@neuralexpert",
    avatar: "🧠",
    lastMessage: "Great bookmark collection! Would love to discuss that quantum computing article you shared.",
    timestamp: "2m",
    unread: 2,
    verified: true,
  },
  {
    id: "2", 
    name: "AI Research Lab",
    handle: "@airesearch",
    avatar: "🔬",
    lastMessage: "Thanks for sharing the quantum neural networks paper! Added to our reading list.",
    timestamp: "1h",
    unread: 0,
    verified: true,
  },
  {
    id: "3",
    name: "Tech Innovator",
    handle: "@techinnovate", 
    avatar: "💡",
    lastMessage: "The BCI conference resources were perfect timing. Working on something similar.",
    timestamp: "3h",
    unread: 1,
    verified: false,
  },
];

const mockMessages = [
  {
    id: "1",
    senderId: "neuralexpert",
    content: "Hey! Just saw your bookmark about neural network architectures. Have you tried the new transformer variants?",
    timestamp: "2:30 PM",
    isSent: false,
  },
  {
    id: "2", 
    senderId: "me",
    content: "Not yet! I bookmarked that paper but haven't had time to dive deep. What's your take on it?",
    timestamp: "2:32 PM", 
    isSent: true,
  },
  {
    id: "3",
    senderId: "neuralexpert",
    content: "The attention mechanism improvements are fascinating. I shared a few related bookmarks in my collection if you want to check them out.",
    timestamp: "2:33 PM",
    isSent: false,
  },
];

const TwitterMessages = () => {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("");
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-paper">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TwitterSidebar />
            </div>
            
            {/* Messages Layout */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-6rem)]">
                
                {/* Conversations List */}
                <div className="md:col-span-1">
                  <Card className="paper-card h-full">
                    <div className="p-4 border-b border-border">
                      <h1 className="text-xl font-bold text-ink mb-4">Messages</h1>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search conversations..." 
                          className="pl-10 bg-washi border-bamboo"
                        />
                      </div>
                    </div>
                    
                    <div className="overflow-y-auto">
                      {mockConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() => setSelectedConversation(conversation)}
                          className={`p-4 border-b border-border cursor-pointer hover:bg-washi transition-smooth ${
                            selectedConversation.id === conversation.id ? "bg-washi" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-gradient-sakura rounded-full flex items-center justify-center text-xl seal-stamp">
                              {conversation.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-ink truncate">{conversation.name}</span>
                                {conversation.verified && (
                                  <div className="w-4 h-4 bg-seal rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white">✓</span>
                                  </div>
                                )}
                                <span className="text-xs text-muted-foreground ml-auto">{conversation.timestamp}</span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                            </div>
                            {conversation.unread > 0 && (
                              <Badge variant="secondary" className="bg-seal text-white">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Chat Window */}
                <div className="md:col-span-2">
                  <Card className="paper-card h-full flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-sakura rounded-full flex items-center justify-center text-lg seal-stamp">
                            {selectedConversation.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-ink">{selectedConversation.name}</span>
                              {selectedConversation.verified && (
                                <div className="w-4 h-4 bg-seal rounded-full flex items-center justify-center">
                                  <span className="text-xs text-white">✓</span>
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-bamboo">{selectedConversation.handle}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Video className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                      {mockMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-paper ${
                              message.isSent
                                ? "bg-gradient-sakura text-white"
                                : "bg-washi border border-bamboo"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.isSent ? "text-white/70" : "text-muted-foreground"
                            }`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-border">
                      <div className="flex items-end gap-2">
                        <Button variant="ghost" size="icon" className="mb-2">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Send a message..."
                            className="bg-washi border-bamboo"
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          />
                        </div>
                        <Button variant="ghost" size="icon" className="mb-2">
                          <Smile className="w-4 h-4" />
                        </Button>
                        <Button onClick={handleSendMessage} size="icon" className="mb-2">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TwitterMessages;