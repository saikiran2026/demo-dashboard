import { Alert, Log, Case, AlertSeverity, AlertStatus, LogLevel, CaseStatus } from '@/types';

const sources = [
  'Firewall', 'IDS/IPS', 'SIEM', 'Endpoint Protection', 'Web Application Firewall',
  'DNS Security', 'Email Security', 'Network Monitor', 'Database Security', 'Cloud Security'
];

const sourceIPs = [
  '192.168.1.100', '10.0.0.45', '172.16.0.23', '203.0.113.15', '198.51.100.42',
  '192.168.50.10', '10.10.10.5', '172.31.1.200', '203.0.113.200', '198.51.100.99'
];

const destinationIPs = [
  '192.168.1.1', '10.0.0.1', '172.16.0.1', '8.8.8.8', '1.1.1.1',
  '192.168.1.254', '10.0.0.254', '172.16.0.254', '208.67.222.222', '9.9.9.9'
];

const users = ['john.doe', 'jane.smith', 'admin', 'security.analyst', 'network.admin'];
const analysts = ['Sarah Johnson', 'Mike Chen', 'Alex Rodriguez', 'Lisa Wang', 'David Kumar'];

const alertTitles = [
  'Suspicious Login Attempt',
  'Brute Force Attack Detected',
  'Malware Detection',
  'DDoS Attack in Progress',
  'Unauthorized Access Attempt',
  'Data Exfiltration Detected',
  'Privilege Escalation',
  'SQL Injection Attempt',
  'Network Anomaly Detected',
  'Suspicious File Upload',
  'Failed Authentication Spike',
  'Port Scan Detected',
  'Unusual Network Traffic',
  'Ransomware Indicators',
  'Command Injection Attempt'
];

const logMessages = [
  'User authentication failed',
  'Network connection established',
  'File access denied',
  'Service started successfully',
  'Database query executed',
  'API request processed',
  'Cache cleared',
  'Session expired',
  'Permission denied',
  'Resource not found',
  'Service unavailable',
  'Connection timeout',
  'Invalid request format',
  'Rate limit exceeded'
];

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateAlert(id: string): Alert {
  const severity = randomChoice(['critical', 'high', 'medium', 'low', 'info'] as AlertSeverity[]);
  const status = randomChoice(['open', 'investigating', 'resolved', 'snoozed', 'false_positive'] as AlertStatus[]);
  const timestamp = randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date());
  
  const severityWeights = { critical: 90, high: 70, medium: 50, low: 30, info: 10 };
  const riskScore = severityWeights[severity] + Math.floor(Math.random() * 10);

  return {
    id,
    title: randomChoice(alertTitles),
    description: `Detected ${randomChoice(alertTitles).toLowerCase()} from ${randomChoice(sourceIPs)}`,
    severity,
    status,
    source: randomChoice(sources),
    sourceIp: randomChoice(sourceIPs),
    destinationIp: randomChoice(destinationIPs),
    timestamp,
    assignedTo: status !== 'open' ? randomChoice(analysts) : undefined,
    tags: [randomChoice(['malware', 'bruteforce', 'injection', 'ddos', 'phishing'])],
    relatedLogs: [`log-${Math.floor(Math.random() * 1000)}`],
    relatedCases: status === 'investigating' ? [`case-${Math.floor(Math.random() * 100)}`] : [],
    snoozeUntil: status === 'snoozed' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined,
    resolvedAt: status === 'resolved' ? randomDate(timestamp, new Date()) : undefined,
    resolvedBy: status === 'resolved' ? randomChoice(analysts) : undefined,
    falsePositiveReason: status === 'false_positive' ? 'Authorized maintenance activity' : undefined,
    category: randomChoice(['network', 'endpoint', 'application', 'identity', 'data']),
    riskScore,
    indicators: [
      { type: 'IP', value: randomChoice(sourceIPs) },
      { type: 'Hash', value: `sha256:${Math.random().toString(36).substring(2, 15)}` }
    ],
    timeline: [
      {
        timestamp,
        action: 'Alert triggered',
        user: 'System',
        details: 'Automated detection'
      }
    ]
  };
}

function generateLog(id: string): Log {
  const level = randomChoice(['error', 'warn', 'info', 'debug'] as LogLevel[]);
  const timestamp = randomDate(new Date(Date.now() - 24 * 60 * 60 * 1000), new Date());
  
  return {
    id,
    timestamp,
    level,
    source: randomChoice(sources),
    sourceIp: randomChoice(sourceIPs),
    message: randomChoice(logMessages),
    details: {
      process: randomChoice(['auth-service', 'web-server', 'database', 'api-gateway']),
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      response_code: randomChoice([200, 401, 403, 404, 500]),
      bytes_transferred: Math.floor(Math.random() * 10000)
    },
    relatedAlerts: Math.random() > 0.7 ? [`alert-${Math.floor(Math.random() * 500)}`] : [],
    relatedCases: Math.random() > 0.9 ? [`case-${Math.floor(Math.random() * 100)}`] : [],
    userId: randomChoice(users),
    sessionId: `session-${Math.random().toString(36).substring(2, 15)}`,
    eventType: randomChoice(['authentication', 'authorization', 'data_access', 'system_event']),
    rawLog: `[${timestamp.toISOString()}] ${level.toUpperCase()}: ${randomChoice(logMessages)}`
  };
}

function generateCase(id: string): Case {
  const status = randomChoice(['open', 'in_progress', 'closed', 'escalated'] as CaseStatus[]);
  const severity = randomChoice(['critical', 'high', 'medium', 'low'] as AlertSeverity[]);
  const createdAt = randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
  
  return {
    id,
    title: `Security Incident: ${randomChoice(alertTitles)}`,
    description: `Investigation into ${randomChoice(alertTitles).toLowerCase()} affecting multiple systems`,
    status,
    severity,
    assignedTo: randomChoice(analysts),
    createdBy: randomChoice(analysts),
    createdAt,
    updatedAt: randomDate(createdAt, new Date()),
    closedAt: status === 'closed' ? randomDate(createdAt, new Date()) : undefined,
    relatedAlerts: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, 
      () => `alert-${Math.floor(Math.random() * 500)}`),
    relatedLogs: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, 
      () => `log-${Math.floor(Math.random() * 1000)}`),
    tags: [randomChoice(['investigation', 'incident', 'breach', 'vulnerability'])],
    timeline: [
      {
        timestamp: createdAt,
        action: 'Case created',
        user: randomChoice(analysts),
        details: 'Initial investigation started'
      }
    ],
    priority: Math.floor(Math.random() * 5) + 1,
    category: randomChoice(['Security Incident', 'Policy Violation', 'Data Breach', 'System Compromise']),
    estimatedHours: Math.floor(Math.random() * 40) + 8,
    actualHours: status === 'closed' ? Math.floor(Math.random() * 50) + 5 : undefined
  };
}

// Generate mock data
export const mockAlerts: Alert[] = Array.from({ length: 500 }, (_, i) => generateAlert(`alert-${i + 1}`));
export const mockLogs: Log[] = Array.from({ length: 2000 }, (_, i) => generateLog(`log-${i + 1}`));
export const mockCases: Case[] = Array.from({ length: 150 }, (_, i) => generateCase(`case-${i + 1}`));

// Generate dashboard stats
export const mockStats = {
  alerts: {
    total: mockAlerts.length,
    open: mockAlerts.filter(a => a.status === 'open').length,
    critical: mockAlerts.filter(a => a.severity === 'critical').length,
    high: mockAlerts.filter(a => a.severity === 'high').length,
    medium: mockAlerts.filter(a => a.severity === 'medium').length,
    low: mockAlerts.filter(a => a.severity === 'low').length,
    resolved24h: mockAlerts.filter(a => 
      a.resolvedAt && a.resolvedAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length
  },
  cases: {
    total: mockCases.length,
    open: mockCases.filter(c => c.status === 'open').length,
    inProgress: mockCases.filter(c => c.status === 'in_progress').length,
    closed24h: mockCases.filter(c => 
      c.closedAt && c.closedAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length,
    avgResolutionTime: 24.5
  },
  logs: {
    total24h: mockLogs.filter(l => 
      l.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length,
    errors: mockLogs.filter(l => l.level === 'error').length,
    warnings: mockLogs.filter(l => l.level === 'warn').length,
    criticalEvents: mockLogs.filter(l => l.relatedAlerts.length > 0).length
  },
  system: {
    uptimePercent: 99.7,
    responseTime: 245,
    activeIncidents: mockCases.filter(c => ['open', 'in_progress'].includes(c.status)).length
  }
}; 