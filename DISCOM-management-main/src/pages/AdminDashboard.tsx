import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TokenCard } from '@/components/TokenCard';
import { ServiceManagement } from '@/components/ServiceManagement';
import { CounterManagement } from '@/components/CounterManagement';
import { getAdminSession, getTokens, getCounters, getQueueStats, resetDailyTokens } from '@/lib/storage';
import { BarChart3, RefreshCw, Trash2, Users, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const isAdmin = getAdminSession();
  const [tokens, setTokens] = useState(getTokens());
  const [counters, setCounters] = useState(getCounters());
  const [stats, setStats] = useState(getQueueStats());

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [isAdmin, navigate]);

  const loadData = () => {
    setTokens(getTokens());
    setCounters(getCounters());
    setStats(getQueueStats());
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all tokens? This cannot be undone.')) {
      resetDailyTokens();
      loadData();
      toast.success('System reset successfully');
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-accent" />
              Admin Dashboard
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadData}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button variant="destructive" onClick={handleReset}>
                <Trash2 className="h-4 w-4" />
                Reset System
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold text-primary">{stats.totalTokens}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Tokens</p>
            </Card>

            <Card className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <Clock className="h-8 w-8 text-secondary" />
                <span className="text-3xl font-bold text-secondary">{stats.waitingTokens}</span>
              </div>
              <p className="text-sm text-muted-foreground">Waiting</p>
            </Card>

            <Card className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-8 w-8 text-accent" />
                <span className="text-3xl font-bold text-accent">{stats.servingTokens}</span>
              </div>
              <p className="text-sm text-muted-foreground">Serving</p>
            </Card>

            <Card className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <CheckCircle className="h-8 w-8 text-accent" />
                <span className="text-3xl font-bold">{stats.completedTokens}</span>
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </Card>
          </div>

          {/* Service & Counter Management */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <ServiceManagement />
            <CounterManagement />
          </div>

          {/* Counters Status */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Counters</h2>
            {counters.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {counters.map((counter) => (
                  <Card key={counter.id} className="p-4 bg-secondary/5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Counter {counter.id}</h3>
                      <div className={`h-3 w-3 rounded-full ${counter.isActive ? 'bg-accent' : 'bg-muted'}`} />
                    </div>
                    <p className="text-sm text-muted-foreground">{counter.staffName}</p>
                    {counter.currentToken && (
                      <p className="text-xs text-secondary font-medium mt-2">
                        Serving: {tokens.find(t => t.id === counter.currentToken)?.number}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No active counters
              </p>
            )}
          </Card>

          {/* Token Distribution */}
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-secondary">
                Waiting ({stats.waitingTokens})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tokens.filter(t => t.status === 'waiting').map(token => (
                  <TokenCard key={token.id} token={token} />
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-accent">
                Serving ({stats.servingTokens})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tokens.filter(t => t.status === 'serving').map(token => (
                  <TokenCard key={token.id} token={token} />
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Completed ({stats.completedTokens})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tokens.filter(t => t.status === 'completed').slice(-10).reverse().map(token => (
                  <TokenCard key={token.id} token={token} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
