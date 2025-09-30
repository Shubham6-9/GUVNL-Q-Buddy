import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { setStaffSession, getCounters } from '@/lib/storage';
import { UserCog } from 'lucide-react';
import { toast } from 'sonner';

const StaffLogin = () => {
  const navigate = useNavigate();
  const [staffName, setStaffName] = useState('');
  const [counterId, setCounterId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!staffName.trim() || !counterId || !password) {
      toast.error('Please fill all fields');
      return;
    }

    if (password !== 'Admin') {
      toast.error('Invalid password');
      return;
    }

    const counters = getCounters();
    const existingCounter = counters.find(c => c.id === counterId);
    
    if (!existingCounter) {
      toast.error('Counter not found. Please contact admin to set up your counter.');
      return;
    }

    setStaffSession(counterId, staffName.trim());
    toast.success('Login successful!');
    navigate('/staff/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-16">
        <div className="max-w-md mx-auto">
          <Card className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-4 rounded-xl bg-secondary/10">
                <UserCog className="h-12 w-12 text-secondary" />
              </div>
              <h1 className="text-2xl font-bold">Staff Login</h1>
              <p className="text-muted-foreground">
                Access your counter dashboard
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="staffName">Staff Name</Label>
                <Input
                  id="staffName"
                  placeholder="Enter your name"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="counter">Counter</Label>
                <Select value={counterId} onValueChange={setCounterId}>
                  <SelectTrigger id="counter">
                    <SelectValue placeholder="Select counter" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCounters().map((counter) => (
                      <SelectItem key={counter.id} value={counter.id}>
                        Counter {counter.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              <Button 
                variant="secondary" 
                className="w-full"
                onClick={handleLogin}
              >
                Login to Counter
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StaffLogin;
