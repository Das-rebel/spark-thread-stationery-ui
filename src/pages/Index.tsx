import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NeuralNetworkView } from "@/components/brain/NeuralNetworkView";
import { MessageCircle, Brain, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/japanese-hero.jpg";

const Index = () => {
  return (
    <AppLayout>
      <div className="min-h-screen font-sans">
        <div className="container mx-auto max-w-md p-4">
          {/* Hero Section */}
          <Card className="paper-card-floating p-8 text-center mb-8 relative overflow-hidden">
            <div 
              className="absolute inset-0 opacity-5"
              style={{ 
                backgroundImage: `url(${heroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-sakura rounded-2xl flex items-center justify-center shadow-paper">
                  <Brain className="w-6 h-6 text-seal" />
                </div>
                <Sparkles className="w-6 h-6 text-gold animate-pulse" />
                <div className="w-12 h-12 bg-gradient-ink rounded-2xl flex items-center justify-center shadow-paper">
                  <MessageCircle className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              
              <h1 className="text-3xl font-display font-bold text-ink mb-3 leading-tight">
                Brain Spark
                <br />
                <span className="text-2xl font-medium text-bamboo">Second Brain</span>
              </h1>
              <p className="text-base text-muted-foreground mb-6 leading-relaxed px-2">
                Your digital knowledge companion. Organize, discover, and connect your thoughts.
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <Link to="/twitter" className="w-full">
                  <Button 
                    variant="ink" 
                    size="lg" 
                    className="w-full gap-3 h-12 rounded-2xl font-medium shadow-paper hover:shadow-floating transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Explore Knowledge Hub
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
                
                <Button 
                  variant="sakura" 
                  size="lg" 
                  className="w-full gap-3 h-12 rounded-2xl font-medium shadow-paper hover:shadow-floating transition-all"
                >
                  <Brain className="w-5 h-5" />
                  View Neural Map
                </Button>
              </div>
            </div>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <Card className="paper-card p-5 hover:shadow-floating transition-smooth group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-sakura rounded-2xl flex items-center justify-center group-hover:scale-110 transition-bounce shadow-paper">
                  <MessageCircle className="w-6 h-6 text-seal" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-ink mb-1">Collection View</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Swipable bookmark collections with beautiful Japanese stationary aesthetics
                  </p>
                </div>
              </div>
            </Card>

            <Card className="paper-card p-5 hover:shadow-floating transition-smooth group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-ink rounded-2xl flex items-center justify-center group-hover:scale-110 transition-bounce shadow-paper">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-ink mb-1">Smart Preview</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Rich preview system with image galleries and content summaries for saved bookmarks
                  </p>
                </div>
              </div>
            </Card>

            <Card className="paper-card p-5 hover:shadow-floating transition-smooth group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-sakura rounded-2xl flex items-center justify-center group-hover:scale-110 transition-bounce shadow-paper">
                  <Brain className="w-6 h-6 text-seal" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-ink mb-1">Knowledge Graph</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    AI-powered knowledge connections with modern brain-computer interfaces
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Knowledge Network Visualization */}
          <Card className="paper-card p-5">
            <h2 className="text-xl font-display font-bold text-ink mb-4 text-center">Knowledge Network</h2>
            <NeuralNetworkView />
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
