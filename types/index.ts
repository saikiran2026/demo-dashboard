export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type AlertStatus = 'open' | 'investigating' | 'resolved' | 'snoozed' | 'false_positive';
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
export type CaseStatus = 'open' | 'in_progress' | 'closed' | 'escalated';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  source: string;
  sourceIp?: string;
  destinationIp?: string;
  timestamp: Date;
  assignedTo?: string;
  tags: string[];
  relatedLogs: string[];
  relatedCases: string[];
  snoozeUntil?: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  falsePositiveReason?: string;
  category: 'network' | 'endpoint' | 'application' | 'identity' | 'data';
  riskScore: number;
  indicators: {
    type: string;
    value: string;
  }[];
  timeline: {
    timestamp: Date;
    action: string;
    user: string;
    details?: string;
  }[];
}

export interface Log {
  id: string;
  timestamp: Date;
  level: LogLevel;
  source: string;
  sourceIp?: string;
  message: string;
  details: Record<string, any>;
  relatedAlerts: string[];
  relatedCases: string[];
  userId?: string;
  sessionId?: string;
  eventType: string;
  rawLog: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  severity: AlertSeverity;
  assignedTo: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  relatedAlerts: string[];
  relatedLogs: string[];
  tags: string[];
  timeline: {
    timestamp: Date;
    action: string;
    user: string;
    details?: string;
  }[];
  priority: number;
  category: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface DashboardStats {
  alerts: {
    total: number;
    open: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    resolved24h: number;
  };
  cases: {
    total: number;
    open: number;
    inProgress: number;
    closed24h: number;
    avgResolutionTime: number;
  };
  logs: {
    total24h: number;
    errors: number;
    warnings: number;
    criticalEvents: number;
  };
  system: {
    uptimePercent: number;
    responseTime: number;
    activeIncidents: number;
  };
}

export interface FilterOptions {
  severity?: AlertSeverity[];
  status?: AlertStatus[];
  source?: string[];
  timeRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
  assignedTo?: string[];
  category?: string[];
} 