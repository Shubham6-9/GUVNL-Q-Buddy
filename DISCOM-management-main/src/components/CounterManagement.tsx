import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { getCounters, saveCounter, deleteCounter, getServices, generateCounterId, Counter } from '@/lib/storage';
import { toast } from 'sonner';

export const CounterManagement = () => {
  const [counters, setCounters] = useState(getCounters());
  const [services] = useState(getServices());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCounter, setEditingCounter] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    staffName: '',
    servicesHandled: [] as string[],
  });

  const loadCounters = () => {
    setCounters(getCounters());
  };

  const handleAddCounter = () => {
    if (!formData.staffName.trim()) {
      toast.error('Staff name is required');
      return;
    }
    if (formData.servicesHandled.length === 0) {
      toast.error('Select at least one service');
      return;
    }

    const newCounter: Counter = {
      id: generateCounterId(),
      staffName: formData.staffName.trim(),
      isActive: true,
      servicesHandled: formData.servicesHandled,
    };

    saveCounter(newCounter);
    loadCounters();
    setShowAddForm(false);
    setFormData({ id: '', staffName: '', servicesHandled: [] });
    toast.success('Counter added successfully');
  };

  const handleEditCounter = (counter: Counter) => {
    setEditingCounter(counter.id);
    setFormData({
      id: counter.id,
      staffName: counter.staffName,
      servicesHandled: counter.servicesHandled,
    });
    setShowAddForm(true);
  };

  const handleSaveEdit = () => {
    if (!formData.staffName.trim() || formData.servicesHandled.length === 0) {
      toast.error('Please fill all fields');
      return;
    }

    saveCounter({
      id: formData.id,
      staffName: formData.staffName.trim(),
      isActive: true,
      servicesHandled: formData.servicesHandled,
    });

    loadCounters();
    setShowAddForm(false);
    setEditingCounter(null);
    setFormData({ id: '', staffName: '', servicesHandled: [] });
    toast.success('Counter updated');
  };

  const handleDeleteCounter = (id: string) => {
    if (confirm(`Are you sure you want to delete Counter ${id}?`)) {
      deleteCounter(id);
      loadCounters();
      toast.success('Counter deleted');
    }
  };

  const toggleService = (service: string) => {
    const updated = formData.servicesHandled.includes(service)
      ? formData.servicesHandled.filter(s => s !== service)
      : [...formData.servicesHandled, service];
    setFormData({ ...formData, servicesHandled: updated });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Counter Management</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4" />
          Add Counter
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-4 mb-4 bg-secondary/5">
          <div className="space-y-4">
            <div>
              <Label>Staff Name</Label>
              <Input
                placeholder="Enter staff name"
                value={formData.staffName}
                onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
              />
            </div>

            <div>
              <Label>Services Handled</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {services.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service}`}
                      checked={formData.servicesHandled.includes(service)}
                      onCheckedChange={() => toggleService(service)}
                    />
                    <Label htmlFor={`service-${service}`} className="text-sm cursor-pointer">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={editingCounter ? handleSaveEdit : handleAddCounter}>
                {editingCounter ? 'Save Changes' : 'Add Counter'}
              </Button>
              <Button variant="outline" onClick={() => {
                setShowAddForm(false);
                setEditingCounter(null);
                setFormData({ id: '', staffName: '', servicesHandled: [] });
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {counters.map((counter) => (
          <Card key={counter.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">Counter {counter.id}</h3>
                <p className="text-sm text-muted-foreground">{counter.staffName}</p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => handleEditCounter(counter)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDeleteCounter(counter.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {counter.servicesHandled.map((service) => (
                <Badge key={service} variant="secondary" className="text-xs">
                  {service}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};
