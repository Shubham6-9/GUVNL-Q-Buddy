import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { getServices, saveService, deleteService, updateService } from '@/lib/storage';
import { toast } from 'sonner';

export const ServiceManagement = () => {
  const [services, setServices] = useState(getServices());
  const [newService, setNewService] = useState('');
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddService = () => {
    if (!newService.trim()) {
      toast.error('Service name cannot be empty');
      return;
    }
    saveService(newService.trim());
    setServices(getServices());
    setNewService('');
    toast.success('Service added successfully');
  };

  const handleDeleteService = (service: string) => {
    if (confirm(`Are you sure you want to delete "${service}"?`)) {
      deleteService(service);
      setServices(getServices());
      toast.success('Service deleted');
    }
  };

  const handleEditService = (service: string) => {
    setEditingService(service);
    setEditValue(service);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim() || !editingService) return;
    updateService(editingService, editValue.trim());
    setServices(getServices());
    setEditingService(null);
    toast.success('Service updated');
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setEditValue('');
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Service Management</h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add new service"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
          />
          <Button onClick={handleAddService}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {services.map((service) => (
            <div key={service} className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg">
              {editingService === service ? (
                <>
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 mr-2"
                  />
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                      <Check className="h-4 w-4 text-accent" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Badge variant="outline">{service}</Badge>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEditService(service)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDeleteService(service)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
