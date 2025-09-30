import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TokenCard } from '@/components/TokenCard';
import { getStaffSession, getTokens, updateToken, updateCounter, getCounters, Token } from '@/lib/storage';
import { PlayCircle, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const session = getStaffSession();
  const [currentToken, setCurrentToken] = useState<Token | null>(null);
  const [waitingTokens, setWaitingTokens] = useState<Token[]>([]);

  useEffect(() => {
    if (!session) {
      navigate('/staff/login');
      return;
    }
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [session, navigate]);

  const loadData = () => {
    if (!session) return;
    
    const counters = getCounters();
    const myCounter = counters.find(c => c.id === session.counterId);
    if (!myCounter) return;

    const tokens = getTokens();
    // Filter tokens for services this counter handles
    const waiting = tokens.filter(t => 
      t.status === 'waiting' && 
      myCounter.servicesHandled.includes(t.serviceType)
    );
    setWaitingTokens(waiting);

    const serving = tokens.find(t => t.status === 'serving' && t.counter === session.counterId);
    setCurrentToken(serving || null);
  };

  const handleCallNext = () => {
    if (!session) return;

    // Find priority tokens first, then regular tokens
    const priorityToken = waitingTokens.find(t => t.priority);
    const nextToken = priorityToken || waitingTokens[0];

    if (!nextToken) {
      toast.error('No tokens in queue');
      return;
    }

    // Complete current token if exists
    if (currentToken) {
      updateToken(currentToken.id, { status: 'completed' });
    }

    // Serve next token
    updateToken(nextToken.id, {
      status: 'serving',
      counter: session.counterId,
    });

    updateCounter(session.counterId, {
      currentToken: nextToken.id,
    });

    toast.success(`Token ${nextToken.number} called to Counter ${session.counterId}`);
    loadData();
  };

  const handleComplete = () => {
    if (!currentToken || !session) return;

    updateToken(currentToken.id, { status: 'completed' });
    updateCounter(session.counterId, { currentToken: undefined });
    
    toast.success('Token completed');
    setCurrentToken(null);
    loadData();
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Counter {session.counterId} Dashboard</h1>
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Current Token */}
            <Card className="p-6 space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-secondary" />
                Current Token
              </h2>

              {currentToken ? (
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/10 rounded-lg border-2 border-secondary">
                    <TokenCard token={currentToken} />
                  </div>
                  
                  <Button 
                    variant="default" 
                    className="w-full bg-accent hover:bg-accent/90"
                    onClick={handleComplete}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Complete Service
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No token being served</p>
                  <Button 
                    variant="hero" 
                    onClick={handleCallNext}
                    disabled={waitingTokens.length === 0}
                  >
                    <PlayCircle className="h-4 w-4" />
                    Call Next Token
                  </Button>
                </div>
              )}
            </Card>

            {/* Queue Stats */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Queue Statistics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Waiting</p>
                    <p className="text-3xl font-bold text-primary">{waitingTokens.length}</p>
                  </div>
                  <div className="p-4 bg-secondary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <p className="text-3xl font-bold text-secondary">
                      {waitingTokens.filter(t => t.priority).length}
                    </p>
                  </div>
                </div>
              </Card>

              {currentToken && (
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={handleCallNext}
                  disabled={waitingTokens.length === 0}
                >
                  <PlayCircle className="h-4 w-4" />
                  Call Next (Complete Current)
                </Button>
              )}
            </div>
          </div>

          {/* Waiting Queue */}
          <Card className="p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Waiting Queue ({waitingTokens.length})</h2>
            {waitingTokens.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {waitingTokens.map((token) => (
                  <TokenCard key={token.id} token={token} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No tokens waiting
              </p>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
