import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, LogOut } from 'lucide-react';
import { getStaffSession, clearStaffSession, getAdminSession, clearAdminSession } from '@/lib/storage';

export const Header = () => {
  const navigate = useNavigate();
  const staffSession = getStaffSession();
  const isAdmin = getAdminSession();

  const handleLogout = () => {
    if (staffSession) {
      clearStaffSession();
    }
    if (isAdmin) {
      clearAdminSession();
    }
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DISCOM Queue
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {staffSession && (
            <span className="text-sm text-muted-foreground">
              Counter {staffSession.counterId} • {staffSession.staffName}
            </span>
          )}
          {isAdmin && (
            <span className="text-sm text-muted-foreground font-semibold">
              Admin Panel
            </span>
          )}
          {(staffSession || isAdmin) && (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
