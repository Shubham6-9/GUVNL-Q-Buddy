import { Token } from '@/lib/storage';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TokenCardProps {
  token: Token;
}

export const TokenCard = ({ token }: TokenCardProps) => {
  const getStatusColor = () => {
    switch (token.status) {
      case 'waiting':
        return 'bg-muted text-muted-foreground';
      case 'serving':
        return 'bg-secondary text-secondary-foreground';
      case 'completed':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted';
    }
  };

  const getStatusIcon = () => {
    switch (token.status) {
      case 'waiting':
        return <Clock className="h-4 w-4" />;
      case 'serving':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-4 hover:shadow-[var(--shadow-medium)] transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-3xl font-bold text-primary">{token.number}</h3>
          {token.name && (
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <User className="h-3 w-3" />
              {token.name}
            </p>
          )}
        </div>
        <Badge className={getStatusColor()}>
          {getStatusIcon()}
          {token.status}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Service</span>
          <span className="font-medium">{token.serviceType}</span>
        </div>

        {token.counter && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Counter</span>
            <span className="font-bold text-secondary">Counter {token.counter}</span>
          </div>
        )}

        {token.priority && (
          <Badge variant="destructive" className="w-full justify-center">
            Priority Token
          </Badge>
        )}

        <p className="text-xs text-muted-foreground pt-2 border-t">
          {format(token.timestamp, 'hh:mm a')}
        </p>
      </div>
    </Card>
  );
};
