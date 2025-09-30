import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Users, UserCog, Shield, Zap, Clock, CheckCircle, TrendingDown } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4">
            <Zap className="h-12 w-12 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
            DISCOM Queue Management
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Smart queue system for GUVNL DISCOM offices. Reduce wait times, improve service efficiency, and enhance citizen experience.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 text-center space-y-2 border-primary/20">
            <TrendingDown className="h-8 w-8 mx-auto text-accent" />
            <h3 className="text-3xl font-bold text-primary">70%</h3>
            <p className="text-sm text-muted-foreground">Wait Time Reduction</p>
          </Card>
          <Card className="p-6 text-center space-y-2 border-secondary/20">
            <Clock className="h-8 w-8 mx-auto text-secondary" />
            <h3 className="text-3xl font-bold text-secondary">5 min</h3>
            <p className="text-sm text-muted-foreground">Average Service Time</p>
          </Card>
          <Card className="p-6 text-center space-y-2 border-accent/20">
            <CheckCircle className="h-8 w-8 mx-auto text-accent" />
            <h3 className="text-3xl font-bold text-accent">500+</h3>
            <p className="text-sm text-muted-foreground">Daily Tokens Served</p>
          </Card>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-8 text-center space-y-4 hover:shadow-[var(--shadow-strong)] transition-all cursor-pointer group">
            <div className="inline-flex p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Users className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Citizen</h2>
            <p className="text-muted-foreground">
              Generate token and track your queue position in real-time
            </p>
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full"
              onClick={() => navigate('/citizen')}
            >
              Get Token
            </Button>
          </Card>

          <Card className="p-8 text-center space-y-4 hover:shadow-[var(--shadow-strong)] transition-all cursor-pointer group">
            <div className="inline-flex p-4 rounded-xl bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
              <UserCog className="h-12 w-12 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold">Staff</h2>
            <p className="text-muted-foreground">
              Manage counter operations and serve customers efficiently
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full"
              onClick={() => navigate('/staff/login')}
            >
              Staff Login
            </Button>
          </Card>

          <Card className="p-8 text-center space-y-4 hover:shadow-[var(--shadow-strong)] transition-all cursor-pointer group">
            <div className="inline-flex p-4 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <Shield className="h-12 w-12 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">Admin</h2>
            <p className="text-muted-foreground">
              Monitor analytics and manage the entire queue system
            </p>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              onClick={() => navigate('/admin/login')}
            >
              Admin Login
            </Button>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center space-y-8">
          <h2 className="text-3xl font-bold">Key Features</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: 'Real-time Updates', desc: 'Live queue status' },
              { icon: Users, title: 'Priority Queue', desc: 'Fast-track for seniors' },
              { icon: CheckCircle, title: 'Smart Allocation', desc: 'Optimal counter routing' },
              { icon: TrendingDown, title: 'Analytics', desc: 'Performance insights' },
            ].map((feature, i) => (
              <Card key={i} className="p-6 space-y-3">
                <feature.icon className="h-8 w-8 mx-auto text-primary" />
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
