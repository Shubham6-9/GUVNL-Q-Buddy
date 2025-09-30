export interface Token {
  id: string;
  number: string; // Changed to string for counter-specific numbering (A-1, B-2, etc.)
  serviceType: string;
  priority: boolean;
  status: 'waiting' | 'serving' | 'completed';
  counter?: string; // Changed to string for character-based counters
  timestamp: Date;
  name?: string;
}

export interface Counter {
  id: string; // Changed to string for character-based counters (A, B, C)
  staffName: string;
  isActive: boolean;
  currentToken?: string;
  servicesHandled: string[];
}

export interface QueueStats {
  totalTokens: number;
  waitingTokens: number;
  servingTokens: number;
  completedTokens: number;
  averageWaitTime: number;
}

const STORAGE_KEYS = {
  TOKENS: 'qms_tokens',
  COUNTERS: 'qms_counters',
  COUNTER_NUMBERS: 'qms_counter_numbers',
  STAFF_SESSION: 'qms_staff_session',
  ADMIN_SESSION: 'qms_admin_session',
  SERVICES: 'qms_services',
};

// Token Management
export const saveToken = (token: Token): void => {
  const tokens = getTokens();
  tokens.push(token);
  localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
};

export const getTokens = (): Token[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TOKENS);
  if (!data) return [];
  return JSON.parse(data).map((t: any) => ({
    ...t,
    timestamp: new Date(t.timestamp),
  }));
};

export const updateToken = (id: string, updates: Partial<Token>): void => {
  const tokens = getTokens();
  const index = tokens.findIndex(t => t.id === id);
  if (index !== -1) {
    tokens[index] = { ...tokens[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
  }
};

export const getNextTokenNumber = (counterId: string): string => {
  const counterNumbers = getCounterNumbers();
  const current = counterNumbers[counterId] || 0;
  const next = current + 1;
  counterNumbers[counterId] = next;
  localStorage.setItem(STORAGE_KEYS.COUNTER_NUMBERS, JSON.stringify(counterNumbers));
  return `${counterId}-${next}`;
};

const getCounterNumbers = (): Record<string, number> => {
  const data = localStorage.getItem(STORAGE_KEYS.COUNTER_NUMBERS);
  return data ? JSON.parse(data) : {};
};

export const resetDailyTokens = (): void => {
  localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.COUNTER_NUMBERS, JSON.stringify({}));
};

// Counter Management
export const saveCounter = (counter: Counter): void => {
  const counters = getCounters();
  const index = counters.findIndex(c => c.id === counter.id);
  if (index !== -1) {
    counters[index] = counter;
  } else {
    counters.push(counter);
  }
  localStorage.setItem(STORAGE_KEYS.COUNTERS, JSON.stringify(counters));
};

export const getCounters = (): Counter[] => {
  const data = localStorage.getItem(STORAGE_KEYS.COUNTERS);
  return data ? JSON.parse(data) : [];
};

export const updateCounter = (id: string, updates: Partial<Counter>): void => {
  const counters = getCounters();
  const index = counters.findIndex(c => c.id === id);
  if (index !== -1) {
    counters[index] = { ...counters[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.COUNTERS, JSON.stringify(counters));
  }
};

export const deleteCounter = (id: string): void => {
  const counters = getCounters().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.COUNTERS, JSON.stringify(counters));
};

// Session Management
export const setStaffSession = (counterId: string, staffName: string): void => {
  localStorage.setItem(STORAGE_KEYS.STAFF_SESSION, JSON.stringify({ counterId, staffName }));
};

export const getStaffSession = (): { counterId: string; staffName: string } | null => {
  const data = localStorage.getItem(STORAGE_KEYS.STAFF_SESSION);
  return data ? JSON.parse(data) : null;
};

export const clearStaffSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.STAFF_SESSION);
};

export const setAdminSession = (isLoggedIn: boolean): void => {
  localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(isLoggedIn));
};

export const getAdminSession = (): boolean => {
  const data = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
  return data ? JSON.parse(data) : false;
};

export const clearAdminSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
};

// Analytics
export const getQueueStats = (): QueueStats => {
  const tokens = getTokens();
  const waiting = tokens.filter(t => t.status === 'waiting').length;
  const serving = tokens.filter(t => t.status === 'serving').length;
  const completed = tokens.filter(t => t.status === 'completed').length;
  
  // Calculate average wait time (simplified)
  const completedTokens = tokens.filter(t => t.status === 'completed');
  const avgWait = completedTokens.length > 0 
    ? completedTokens.reduce((acc, t) => acc + 10, 0) / completedTokens.length 
    : 0;

  return {
    totalTokens: tokens.length,
    waitingTokens: waiting,
    servingTokens: serving,
    completedTokens: completed,
    averageWaitTime: Math.round(avgWait),
  };
};

// Service Management
export const getServices = (): string[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
  if (!data) {
    // Default services
    const defaultServices = [
      'New Connection',
      'Bill Payment',
      'Complaint Registration',
      'Meter Reading',
      'Disconnection',
      'Reconnection',
      'Name Transfer',
      'Load Enhancement',
      'General Inquiry',
    ];
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(defaultServices));
    return defaultServices;
  }
  return JSON.parse(data);
};

export const saveService = (service: string): void => {
  const services = getServices();
  if (!services.includes(service)) {
    services.push(service);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }
};

export const deleteService = (service: string): void => {
  const services = getServices().filter(s => s !== service);
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
};

export const updateService = (oldService: string, newService: string): void => {
  const services = getServices();
  const index = services.indexOf(oldService);
  if (index !== -1) {
    services[index] = newService;
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }
};

export const SERVICE_TYPES = getServices();

export const generateCounterId = (): string => {
  const counters = getCounters();
  const usedIds = counters.map(c => c.id);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let i = 0; i < alphabet.length; i++) {
    if (!usedIds.includes(alphabet[i])) {
      return alphabet[i];
    }
  }
  
  // If all single letters are used, start with double letters
  for (let i = 0; i < alphabet.length; i++) {
    for (let j = 0; j < alphabet.length; j++) {
      const id = alphabet[i] + alphabet[j];
      if (!usedIds.includes(id)) {
        return id;
      }
    }
  }
  
  return 'Z1'; // Fallback
};

export const findAvailableCounter = (serviceType: string): string | null => {
  const counters = getCounters().filter(c => 
    c.isActive && c.servicesHandled.includes(serviceType)
  );
  
  if (counters.length === 0) return null;
  
  // Find counter with least tokens waiting
  const tokens = getTokens();
  const counterLoads = counters.map(counter => ({
    id: counter.id,
    load: tokens.filter(t => t.counter === counter.id && t.status === 'waiting').length,
  }));
  
  counterLoads.sort((a, b) => a.load - b.load);
  return counterLoads[0].id;
};
