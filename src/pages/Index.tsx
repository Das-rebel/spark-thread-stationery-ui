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
      <div className="min-h-screen">
        <div className="container mx-auto max-w-6xl p-6">
          {/* Hero Section */}
          <Card className="paper-card-floating p-12 text-center mb-12 relative overflow-hidden">
            <div 
              className="absolute inset-0 opacity-10"
              style={{ 
                backgroundImage: `url(${heroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-sakura rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-seal" />
                </div>
                <Sparkles className="w-8 h-8 text-gold animate-pulse" />
                <div className="w-16 h-16 bg-gradient-ink rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              
              <h1 className="text-5xl font-bold text-ink mb-4">
                Brain Spark - Second Brain
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Your digital knowledge companion. Organize, discover, and connect your thoughts with intelligent bookmark management.
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <Link to="/twitter">
                  <Button variant="ink" size="floating" className="gap-3">
                    <MessageCircle className="w-5 h-5" />
                    Explore Knowledge Hub
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                
                <Button variant="sakura" size="floating" className="gap-3">
                  <Brain className="w-5 h-5" />
                  View Neural Map
                </Button>
              </div>
            </div>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="paper-card p-6 hover:shadow-floating transition-smooth group">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-sakura rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-bounce">
                  <MessageCircle className="w-6 h-6 text-seal" />
                </div>
                <h3 className="text-lg font-semibold text-ink">Collection View</h3>
                <p className="text-sm text-muted-foreground">
                  Swipable bookmark collections with beautiful Japanese stationary aesthetics
                </p>
              </div>
            </Card>

            <Card className="paper-card p-6 hover:shadow-floating transition-smooth group">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-ink rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-bounce">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-ink">Smart Preview</h3>
                <p className="text-sm text-muted-foreground">
                  Rich preview system with image galleries and content summaries for saved bookmarks
                </p>
              </div>
            </Card>

            <Card className="paper-card p-6 hover:shadow-floating transition-smooth group">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-sakura rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-bounce">
                  <Brain className="w-6 h-6 text-seal" />
                </div>
                <h3 className="text-lg font-semibold text-ink">Knowledge Graph</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered knowledge connections with modern brain-computer interfaces
                </p>
              </div>
            </Card>
          </div>

          {/* Knowledge Network Visualization */}
          <Card className="paper-card p-6">
            <h2 className="text-2xl font-bold text-ink mb-6 text-center">Knowledge Network Visualization</h2>
            <NeuralNetworkView />
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
