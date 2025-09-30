import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { TokenCard } from '@/components/TokenCard';
import { saveToken, getTokens, getNextTokenNumber, getServices, Token, findAvailableCounter } from '@/lib/storage';
import { Ticket, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const Citizen = () => {
  const [name, setName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [priority, setPriority] = useState(false);
  const [myToken, setMyToken] = useState<Token | null>(null);
  const [waitingTokens, setWaitingTokens] = useState<Token[]>([]);
  const [servingTokens, setServingTokens] = useState<Token[]>([]);
  const [services, setServices] = useState<string[]>([]);

  const loadTokens = () => {
    const allTokens = getTokens();
    setWaitingTokens(allTokens.filter(t => t.status === 'waiting'));
    setServingTokens(allTokens.filter(t => t.status === 'serving'));
    
    // Check if user has an active token
    if (myToken) {
      const updated = allTokens.find(t => t.id === myToken.id);
      if (updated) {
        setMyToken(updated);
      }
    }
  };

  useEffect(() => {
    setServices(getServices());
    loadTokens();
    const interval = setInterval(loadTokens, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, [myToken]);

  const handleGenerateToken = () => {
    if (!name.trim() || !serviceType) {
      toast.error('Please fill all required fields');
      return;
    }

    // Find available counter for this service
    const counterId = findAvailableCounter(serviceType);
    if (!counterId) {
      toast.error('No counter available for this service. Please try again later.');
      return;
    }

    const token: Token = {
      id: `token-${Date.now()}`,
      number: getNextTokenNumber(counterId),
      serviceType,
      priority,
      status: 'waiting',
      timestamp: new Date(),
      name: name.trim(),
      counter: counterId,
    };

    saveToken(token);
    setMyToken(token);
    toast.success(`Token generated! Please proceed to Counter ${counterId}`);
    
    // Reset form
    setName('');
    setServiceType('');
    setPriority(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Ticket className="h-8 w-8 text-primary" />
            Citizen Portal
          </h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Token Generation Form */}
            <Card className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Generate New Token</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="service">Service Type *</Label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="priority" 
                      checked={priority}
                      onCheckedChange={(checked) => setPriority(checked as boolean)}
                    />
                    <Label htmlFor="priority" className="text-sm cursor-pointer">
                      Priority token (Senior citizen / Pregnant / Disabled)
                    </Label>
                  </div>

                  <Button 
                    variant="hero" 
                    className="w-full"
                    onClick={handleGenerateToken}
                  >
                    <Ticket className="h-4 w-4" />
                    Generate Token
                  </Button>
                </div>
              </div>
            </Card>

            {/* My Token Display */}
            <div className="space-y-6">
              {myToken && (
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Your Token</h2>
                    <Button variant="ghost" size="sm" onClick={loadTokens}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <TokenCard token={myToken} />
                  {myToken.status === 'waiting' && (
                    <p className="text-sm text-muted-foreground text-center mt-4">
                      {waitingTokens.findIndex(t => t.id === myToken.id) + 1} people ahead of you
                    </p>
                  )}
                </Card>
              )}

              {/* Current Serving */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Currently Serving</h2>
                {servingTokens.length > 0 ? (
                  <div className="space-y-3">
                    {servingTokens.map((token) => (
                      <TokenCard key={token.id} token={token} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No tokens being served currently
                  </p>
                )}
              </Card>
            </div>
          </div>

          {/* Waiting Queue */}
          <Card className="p-6 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Waiting Queue ({waitingTokens.length})</h2>
              <Button variant="outline" size="sm" onClick={loadTokens}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
            
            {waitingTokens.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {waitingTokens.map((token) => (
                  <TokenCard key={token.id} token={token} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No tokens in queue
              </p>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Citizen;
