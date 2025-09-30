import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setAdminSession } from '@/lib/storage';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password !== 'Admin') {
      toast.error('Invalid password');
      return;
    }

    setAdminSession(true);
    toast.success('Admin login successful!');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-16">
        <div className="max-w-md mx-auto">
          <Card className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-4 rounded-xl bg-accent/10">
                <Shield className="h-12 w-12 text-accent" />
              </div>
              <h1 className="text-2xl font-bold">Admin Login</h1>
              <p className="text-muted-foreground">
                Access system administration
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              <Button 
                variant="default" 
                className="w-full bg-accent hover:bg-accent/90"
                onClick={handleLogin}
              >
                Login as Admin
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
