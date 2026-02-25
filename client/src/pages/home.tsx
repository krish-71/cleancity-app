import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Leaf, MapPin, CheckCircle } from "lucide-react";
import heroImage from "@assets/generated_images/clean_eco-city_hero_background.png";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Clean City" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 backdrop-blur-[2px]" />
        </div>
        
        <div className="container relative z-10 px-4 text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md text-primary-foreground text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Leaf className="w-4 h-4" />
            <span>Building a Cleaner Future Together</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 leading-tight max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Keep Your City Clean, <br/>
            <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Green & Beautiful</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Report waste issues, track cleanup progress, and contribute to a healthier environment with just a few clicks.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link href="/auth?tab=register">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all">
                Report an Issue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/education">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/30 text-white hover:bg-white/10 hover:border-white backdrop-blur-sm">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-foreground">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              We've made it simple for citizens to report issues and for authorities to take action.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={MapPin}
              title="Report Location"
              description="Snap a photo and automatically tag the location of the waste."
              delay={0}
            />
            <FeatureCard 
              icon={CheckCircle}
              title="Track Status"
              description="Get real-time updates as your complaint moves from Pending to Resolved."
              delay={100}
            />
            <FeatureCard 
              icon={Leaf}
              title="Earn & Learn"
              description="Learn about waste management and help your city stay eco-friendly."
              delay={200}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) {
  return (
    <div 
      className="p-8 rounded-2xl bg-card border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-xl font-bold font-heading mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
