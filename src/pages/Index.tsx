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
                Brain Spark UI Boost
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Where neural networks meet social interaction. Experience the future of AI-powered conversations.
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <Link to="/twitter">
                  <Button variant="ink" size="floating" className="gap-3">
                    <MessageCircle className="w-5 h-5" />
                    Explore Twitter Interface
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                
                <Button variant="sakura" size="floating" className="gap-3">
                  <Brain className="w-5 h-5" />
                  View Neural Network
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
                <h3 className="text-lg font-semibold text-ink">Thread View</h3>
                <p className="text-sm text-muted-foreground">
                  Swipable thread navigation with beautiful Japanese stationary aesthetics
                </p>
              </div>
            </Card>

            <Card className="paper-card p-6 hover:shadow-floating transition-smooth group">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-ink rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-bounce">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-ink">Tweet Preview</h3>
                <p className="text-sm text-muted-foreground">
                  Rich preview system with image galleries and content summaries
                </p>
              </div>
            </Card>

            <Card className="paper-card p-6 hover:shadow-floating transition-smooth group">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-sakura rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-bounce">
                  <Brain className="w-6 h-6 text-seal" />
                </div>
                <h3 className="text-lg font-semibold text-ink">Neural UI</h3>
                <p className="text-sm text-muted-foreground">
                  Retro Japanese design with modern AI-powered interactions
                </p>
              </div>
            </Card>
          </div>

          {/* Neural Network Visualization */}
          <Card className="paper-card p-6">
            <h2 className="text-2xl font-bold text-ink mb-6 text-center">Neural Network Visualization</h2>
            <NeuralNetworkView />
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
