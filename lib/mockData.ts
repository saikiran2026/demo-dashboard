import { Alert, Log, Case, AlertSeverity, AlertStatus, LogLevel, CaseStatus } from '@/types';

// Fixed base timestamp for consistent server/client rendering
const BASE_TIMESTAMP = new Date('2024-01-15T10:00:00Z').getTime();

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

// Seeded random number generator for consistent server/client rendering
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

const rng = new SeededRandom(12345); // Fixed seed for consistency

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(rng.next() * array.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + rng.next() * (end.getTime() - start.getTime()));
}

function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(rng.next() * chars.length)];
  }
  return result;
}

function generateAlert(id: string): Alert {
  const severity = randomChoice(['critical', 'high', 'medium', 'low', 'info'] as AlertSeverity[]);
  const status = randomChoice(['open', 'investigating', 'resolved', 'snoozed', 'false_positive'] as AlertStatus[]);
  const timestamp = randomDate(new Date(BASE_TIMESTAMP - 7 * 24 * 60 * 60 * 1000), new Date(BASE_TIMESTAMP));
  
  const severityWeights = { critical: 90, high: 70, medium: 50, low: 30, info: 10 };
  const riskScore = severityWeights[severity] + Math.floor(rng.next() * 10);

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
    relatedLogs: [`log-${Math.floor(rng.next() * 1000)}`],
    relatedCases: status === 'investigating' ? [`case-${Math.floor(rng.next() * 100)}`] : [],
    snoozeUntil: status === 'snoozed' ? new Date(BASE_TIMESTAMP + 24 * 60 * 60 * 1000) : undefined,
    resolvedAt: status === 'resolved' ? randomDate(timestamp, new Date(BASE_TIMESTAMP)) : undefined,
    resolvedBy: status === 'resolved' ? randomChoice(analysts) : undefined,
    falsePositiveReason: status === 'false_positive' ? 'Authorized maintenance activity' : undefined,
    category: randomChoice(['network', 'endpoint', 'application', 'identity', 'data']),
    riskScore,
    indicators: [
      { type: 'IP', value: randomChoice(sourceIPs) },
      { type: 'Hash', value: `sha256:${generateRandomString(13)}` }
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
  const timestamp = randomDate(new Date(BASE_TIMESTAMP - 24 * 60 * 60 * 1000), new Date(BASE_TIMESTAMP));
  
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
      bytes_transferred: Math.floor(rng.next() * 10000)
    },
    relatedAlerts: rng.next() > 0.7 ? [`alert-${Math.floor(rng.next() * 500)}`] : [],
    relatedCases: rng.next() > 0.9 ? [`case-${Math.floor(rng.next() * 100)}`] : [],
    userId: randomChoice(users),
    sessionId: `session-${generateRandomString(13)}`,
    eventType: randomChoice(['authentication', 'authorization', 'data_access', 'system_event']),
    rawLog: `[${timestamp.toISOString()}] ${level.toUpperCase()}: ${randomChoice(logMessages)}`
  };
}

const caseTemplates = [
  {
    title: "Ransomware Infection - Production Servers",
    description: "Multiple production servers showing signs of ransomware encryption activity. File systems compromised with .crypto extension files detected.",
    category: "Security Incident",
    severity: "critical" as AlertSeverity,
    tags: ["ransomware", "malware", "production"],
    alertTypes: ["Malware Detection", "Suspicious File Upload", "Ransomware Indicators"],
    estimatedHours: 72
  },
  {
    title: "Data Exfiltration via External USB",
    description: "Unauthorized data transfer detected to external USB device. Sensitive customer data may have been compromised.",
    category: "Data Breach",
    severity: "high" as AlertSeverity,
    tags: ["data-breach", "exfiltration", "usb"],
    alertTypes: ["Data Exfiltration Detected", "Unauthorized Access Attempt"],
    estimatedHours: 48
  },
  {
    title: "Privilege Escalation Attack",
    description: "Standard user account gained administrative privileges through exploitation of system vulnerability.",
    category: "System Compromise",
    severity: "high" as AlertSeverity,
    tags: ["privilege-escalation", "vulnerability"],
    alertTypes: ["Privilege Escalation", "Unauthorized Access Attempt"],
    estimatedHours: 24
  },
  {
    title: "SQL Injection on Customer Portal",
    description: "Web application vulnerability exploited to access customer database. Potential unauthorized data access detected.",
    category: "Security Incident",
    severity: "high" as AlertSeverity,
    tags: ["sql-injection", "web-app", "database"],
    alertTypes: ["SQL Injection Attempt", "Database Anomaly Detected"],
    estimatedHours: 36
  },
  {
    title: "Insider Threat - Unusual Data Access",
    description: "Employee accessing large volumes of sensitive data outside normal work hours and responsibilities.",
    category: "Policy Violation",
    severity: "medium" as AlertSeverity,
    tags: ["insider-threat", "policy-violation"],
    alertTypes: ["Unusual Network Traffic", "Unauthorized Access Attempt"],
    estimatedHours: 20
  },
  {
    title: "Phishing Campaign Targeting Employees",
    description: "Coordinated phishing attack targeting multiple employees with credential harvesting attempts.",
    category: "Security Incident",
    severity: "medium" as AlertSeverity,
    tags: ["phishing", "social-engineering"],
    alertTypes: ["Suspicious Login Attempt", "Failed Authentication Spike"],
    estimatedHours: 16
  },
  {
    title: "DDoS Attack on Web Services",
    description: "Distributed denial of service attack overwhelming web infrastructure, causing service unavailability.",
    category: "Security Incident",
    severity: "high" as AlertSeverity,
    tags: ["ddos", "availability"],
    alertTypes: ["DDoS Attack in Progress", "Network Anomaly Detected"],
    estimatedHours: 12
  },
  {
    title: "Cryptocurrency Mining Malware",
    description: "Unauthorized cryptocurrency mining software detected on corporate workstations, degrading system performance.",
    category: "System Compromise",
    severity: "medium" as AlertSeverity,
    tags: ["cryptomining", "malware"],
    alertTypes: ["Malware Detection", "Unusual Network Traffic"],
    estimatedHours: 18
  },
  {
    title: "Brute Force Attack on SSH Services",
    description: "Persistent brute force attempts targeting SSH services across multiple servers from distributed IP addresses.",
    category: "Security Incident",
    severity: "medium" as AlertSeverity,
    tags: ["brute-force", "ssh"],
    alertTypes: ["Brute Force Attack Detected", "Failed Authentication Spike"],
    estimatedHours: 14
  },
  {
    title: "Unauthorized VPN Access",
    description: "VPN connection established from suspicious geographic location using compromised credentials.",
    category: "Security Incident",
    severity: "high" as AlertSeverity,
    tags: ["vpn", "geo-anomaly"],
    alertTypes: ["Suspicious Login Attempt", "Network Anomaly Detected"],
    estimatedHours: 24
  },
  {
    title: "Email Server Compromise",
    description: "Email server showing signs of compromise with unauthorized mail relay activity and suspicious outbound traffic.",
    category: "System Compromise",
    severity: "high" as AlertSeverity,
    tags: ["email", "server-compromise"],
    alertTypes: ["Malware Detection", "Unusual Network Traffic"],
    estimatedHours: 40
  },
  {
    title: "Cloud Storage Data Leak",
    description: "Misconfigured cloud storage bucket exposing sensitive customer data to public internet access.",
    category: "Data Breach",
    severity: "critical" as AlertSeverity,
    tags: ["cloud", "data-leak", "misconfiguration"],
    alertTypes: ["Data Exfiltration Detected", "Unauthorized Access Attempt"],
    estimatedHours: 32
  }
];

// Enhanced alert and log generation for cases
function generateRelatedAlertsForCase(template: typeof caseTemplates[0], caseId: string): Alert[] {
  const relatedAlerts: Alert[] = [];
  const alertCount = Math.floor(rng.next() * 3) + 2; // 2-4 alerts per case
  
  for (let i = 0; i < alertCount; i++) {
    const alertTitle = randomChoice(template.alertTypes);
    const alertId = `${caseId}-alert-${i + 1}`;
    
    // Generate contextual descriptions based on case type
    let description = '';
    let severity: AlertSeverity = template.severity;
    let tags: string[] = [];
    
    switch (template.title.split(' - ')[0]) {
      case 'Ransomware Infection':
        description = `${alertTitle} - Files with .crypto extension detected on ${randomChoice(sourceIPs)}. Suspicious encryption activity observed.`;
        tags = ['ransomware', 'malware', 'encryption'];
        break;
      case 'Data Exfiltration via External USB':
        description = `${alertTitle} - Large data transfer to external USB device detected. ${Math.floor(rng.next() * 5000 + 1000)}MB transferred.`;
        tags = ['data-exfiltration', 'usb', 'policy-violation'];
        break;
      case 'SQL Injection on Customer Portal':
        description = `${alertTitle} - Malicious SQL commands detected in web application requests from ${randomChoice(sourceIPs)}.`;
        tags = ['sql-injection', 'web-security', 'database'];
        break;
      case 'Insider Threat':
        description = `${alertTitle} - Employee ${randomChoice(users)} accessing sensitive files outside normal hours from ${randomChoice(sourceIPs)}.`;
        tags = ['insider-threat', 'access-anomaly', 'policy'];
        break;
      case 'Phishing Campaign Targeting Employees':
        description = `${alertTitle} - Suspicious email with credential harvesting link sent to ${Math.floor(rng.next() * 50 + 10)} employees.`;
        tags = ['phishing', 'email-security', 'credentials'];
        break;
      case 'DDoS Attack on Web Services':
        description = `${alertTitle} - ${Math.floor(rng.next() * 10000 + 5000)} requests/second from ${randomChoice(sourceIPs)}. Service degradation detected.`;
        tags = ['ddos', 'network-attack', 'availability'];
        break;
      case 'Cryptocurrency Mining Malware':
        description = `${alertTitle} - Unauthorized mining process detected on workstation. CPU usage at ${Math.floor(rng.next() * 30 + 70)}%.`;
        tags = ['cryptomining', 'malware', 'performance'];
        break;
      case 'Brute Force Attack on SSH Services':
        description = `${alertTitle} - ${Math.floor(rng.next() * 500 + 100)} failed login attempts from ${randomChoice(sourceIPs)} in 10 minutes.`;
        tags = ['brute-force', 'ssh', 'authentication'];
        break;
      case 'Unauthorized VPN Access':
        description = `${alertTitle} - VPN connection from ${randomChoice(['China', 'Russia', 'North Korea', 'Iran'])} using credentials of ${randomChoice(users)}.`;
        tags = ['vpn', 'geo-anomaly', 'unauthorized-access'];
        break;
      case 'Email Server Compromise':
        description = `${alertTitle} - Email server relaying ${Math.floor(rng.next() * 1000 + 500)} spam messages. Suspicious outbound traffic detected.`;
        tags = ['email-compromise', 'spam', 'server-security'];
        break;
      case 'Cloud Storage Data Leak':
        description = `${alertTitle} - S3 bucket containing ${Math.floor(rng.next() * 100000 + 10000)} customer records exposed to public access.`;
        tags = ['cloud-security', 'data-leak', 'misconfiguration'];
        break;
      default:
        description = `${alertTitle} - Security event detected from ${randomChoice(sourceIPs)}`;
        tags = ['security-event'];
    }
    
    // Vary severity slightly for some alerts
    if (i > 0 && rng.next() > 0.6) {
      const severityLevels: AlertSeverity[] = ['critical', 'high', 'medium', 'low'];
      const currentIndex = severityLevels.indexOf(template.severity);
      if (currentIndex > 0 && rng.next() > 0.5) {
        severity = severityLevels[currentIndex - 1]; // One level lower
      } else if (currentIndex < severityLevels.length - 1) {
        severity = severityLevels[currentIndex + 1]; // One level higher
      }
    }
    
    const timestamp = randomDate(
      new Date(BASE_TIMESTAMP - 48 * 60 * 60 * 1000), 
      new Date(BASE_TIMESTAMP - 2 * 60 * 60 * 1000)
    );
    
    relatedAlerts.push({
      id: alertId,
      title: alertTitle,
      description,
      severity,
      status: randomChoice(['open', 'investigating', 'resolved'] as AlertStatus[]),
      source: randomChoice(sources),
      sourceIp: randomChoice(sourceIPs),
      destinationIp: randomChoice(destinationIPs),
      timestamp,
      assignedTo: severity === 'critical' || severity === 'high' ? randomChoice(analysts) : undefined,
      tags,
      relatedLogs: [], // Will be populated later
      relatedCases: [caseId],
      category: randomChoice(['network', 'endpoint', 'application', 'identity', 'data']),
      riskScore: Math.floor(rng.next() * 30) + (severity === 'critical' ? 80 : severity === 'high' ? 60 : severity === 'medium' ? 40 : 20),
      indicators: [
        { type: 'IP', value: randomChoice(sourceIPs) },
        { type: 'Hash', value: `sha256:${generateRandomString(13)}` }
      ],
      timeline: [
        {
          timestamp,
          action: 'Alert triggered',
          user: 'System',
          details: 'Automated detection'
        }
      ]
    });
  }
  
  return relatedAlerts;
}

function generateRelatedLogsForCase(template: typeof caseTemplates[0], caseId: string, relatedAlerts: Alert[]): Log[] {
  const relatedLogs: Log[] = [];
  const logCount = Math.floor(rng.next() * 8) + 3; // 3-10 logs per case
  
  for (let i = 0; i < logCount; i++) {
    const logId = `${caseId}-log-${i + 1}`;
    
    // Generate contextual log messages based on case type
    let message = '';
    let level: LogLevel = 'info';
    let eventType = 'system_event';
    let details: Record<string, any> = {};
    
    switch (template.title.split(' - ')[0]) {
      case 'Ransomware Infection':
        const ransomwareMessages = [
          'File encryption process detected',
          'Suspicious .crypto file extension created',
          'Multiple file modifications in short timespan',
          'Backup service connection failed',
          'Volume shadow copy deletion attempted'
        ];
        message = randomChoice(ransomwareMessages);
        level = randomChoice(['error', 'warn'] as LogLevel[]);
        eventType = 'data_access';
        details = { 
          process: 'file-encryption', 
          files_affected: Math.floor(rng.next() * 5000 + 100),
          response_code: randomChoice([200, 403, 500])
        };
        break;
        
      case 'Data Exfiltration via External USB':
        const usbMessages = [
          'USB device connection detected',
          'Large file transfer to external device',
          'Data Loss Prevention rule triggered',
          'Unauthorized data copy attempt',
          'USB device policy violation'
        ];
        message = randomChoice(usbMessages);
        level = randomChoice(['warn', 'error'] as LogLevel[]);
        eventType = 'data_access';
        details = { 
          device_type: 'USB_STORAGE', 
          bytes_transferred: Math.floor(rng.next() * 5000000000),
          response_code: 403
        };
        break;
        
      case 'SQL Injection on Customer Portal':
        const sqlMessages = [
          'Malicious SQL command in HTTP request',
          'Database query with suspicious pattern',
          'Web application firewall triggered',
          'Invalid SQL syntax in user input',
          'Database access denied due to suspicious query'
        ];
        message = randomChoice(sqlMessages);
        level = randomChoice(['error', 'warn'] as LogLevel[]);
        eventType = 'authentication';
        details = { 
          process: 'web-app', 
          user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          response_code: randomChoice([400, 403, 500])
        };
        break;
        
      case 'Insider Threat':
        const insiderMessages = [
          'After-hours file access detected',
          'Unusual data access pattern',
          'Multiple sensitive file downloads',
          'Access to restricted directory',
          'Privilege escalation attempt'
        ];
        message = randomChoice(insiderMessages);
        level = 'warn';
        eventType = 'data_access';
        details = { 
          process: 'file-access', 
          access_time: 'outside_hours',
          response_code: 200
        };
        break;
        
      case 'Phishing Campaign Targeting Employees':
        const phishingMessages = [
          'Suspicious email link clicked',
          'Credential harvesting attempt detected',
          'Email security filter triggered',
          'Malicious attachment quarantined',
          'User reported suspicious email'
        ];
        message = randomChoice(phishingMessages);
        level = randomChoice(['warn', 'info'] as LogLevel[]);
        eventType = 'authentication';
        details = { 
          process: 'email-security', 
          email_subject: 'Urgent: Verify Your Account',
          response_code: 200
        };
        break;
        
      case 'DDoS Attack on Web Services':
        const ddosMessages = [
          'High volume of requests detected',
          'Service response time degraded',
          'Rate limiting activated',
          'Connection pool exhausted',
          'Load balancer failover triggered'
        ];
        message = randomChoice(ddosMessages);
        level = randomChoice(['error', 'warn'] as LogLevel[]);
        eventType = 'system_event';
        details = { 
          process: 'web-server', 
          requests_per_second: Math.floor(rng.next() * 10000 + 1000),
          response_code: randomChoice([503, 504, 429])
        };
        break;
        
      default:
        message = randomChoice(logMessages);
        level = randomChoice(['error', 'warn', 'info'] as LogLevel[]);
        eventType = 'system_event';
        details = { 
          process: randomChoice(['auth-service', 'web-server', 'database']),
          response_code: randomChoice([200, 401, 403, 500])
        };
    }
    
    const timestamp = randomDate(
      new Date(BASE_TIMESTAMP - 72 * 60 * 60 * 1000), 
      new Date(BASE_TIMESTAMP - 1 * 60 * 60 * 1000)
    );
    
    relatedLogs.push({
      id: logId,
      timestamp,
      level,
      source: randomChoice(sources),
      sourceIp: randomChoice(sourceIPs),
      message,
      details: {
        ...details,
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        bytes_transferred: Math.floor(rng.next() * 10000)
      },
      relatedAlerts: relatedAlerts.slice(0, Math.floor(rng.next() * 2) + 1).map(a => a.id), // 1-2 related alerts
      relatedCases: [caseId],
      userId: randomChoice(users),
      sessionId: `session-${generateRandomString(13)}`,
      eventType,
      rawLog: `[${timestamp.toISOString()}] ${level.toUpperCase()}: ${message}`
    });
  }
  
  return relatedLogs;
}

function generateCase(id: string): Case {
  const template = randomChoice(caseTemplates);
  const status = randomChoice(['open', 'in_progress', 'closed', 'escalated'] as CaseStatus[]);
  const createdAt = randomDate(new Date(BASE_TIMESTAMP - 30 * 24 * 60 * 60 * 1000), new Date(BASE_TIMESTAMP));
  
  // Generate priority based on severity
  const priorityMap: { [key in AlertSeverity]: number } = { critical: 1, high: 2, medium: 3, low: 4, info: 5 };
  const priority = priorityMap[template.severity];
  
  // Generate related alerts and logs with context
  const relatedAlerts = generateRelatedAlertsForCase(template, id);
  const relatedLogs = generateRelatedLogsForCase(template, id, relatedAlerts);
  
  // Generate realistic timeline based on case progression
  const timeline = [
    {
      timestamp: createdAt,
      action: 'Case created',
      user: randomChoice(analysts),
      details: 'Initial security incident reported and case opened'
    }
  ];
  
  if (status !== 'open') {
    const assignedTime = new Date(createdAt.getTime() + (30 + rng.next() * 120) * 60 * 1000);
    timeline.push({
      timestamp: assignedTime,
      action: 'Investigation started',
      user: randomChoice(analysts),
      details: 'Case assigned to security analyst for investigation'
    });
  }
  
  if (status === 'escalated') {
    const escalatedTime = new Date(createdAt.getTime() + (2 + rng.next() * 6) * 60 * 60 * 1000);
    timeline.push({
      timestamp: escalatedTime,
      action: 'Case escalated',
      user: randomChoice(analysts),
      details: 'Escalated to senior analyst due to severity'
    });
  }
  
  if (status === 'closed') {
    const closedTime = new Date(createdAt.getTime() + (template.estimatedHours + rng.next() * 12) * 60 * 60 * 1000);
    timeline.push({
      timestamp: closedTime,
      action: 'Case resolved',
      user: randomChoice(analysts),
      details: 'Investigation completed and incident resolved'
    });
  }
  
  const actualHours = status === 'closed' ? template.estimatedHours + Math.floor(rng.next() * 10) - 5 : undefined;
  
  return {
    id,
    title: template.title,
    description: template.description,
    status,
    severity: template.severity,
    assignedTo: status !== 'open' ? randomChoice(analysts) : undefined,
    createdBy: randomChoice(analysts),
    createdAt,
    updatedAt: timeline[timeline.length - 1].timestamp,
    closedAt: status === 'closed' ? timeline[timeline.length - 1].timestamp : undefined,
    relatedAlerts: relatedAlerts.map(a => a.id),
    relatedLogs: relatedLogs.map(l => l.id),
    tags: template.tags,
    timeline,
    priority,
    category: template.category,
    estimatedHours: template.estimatedHours,
    actualHours
  };
}

// Generate mock data with relationships
export const mockCases: Case[] = Array.from({ length: 150 }, (_, i) => generateCase(`case-${i + 1}`));

// Generate additional standalone alerts and logs, plus case-related ones
const caseRelatedAlerts: Alert[] = [];
const caseRelatedLogs: Log[] = [];

// Generate case-related alerts and logs
mockCases.forEach(case_ => {
  const template = caseTemplates.find(t => t.title === case_.title) || caseTemplates[0];
  const relatedAlerts = generateRelatedAlertsForCase(template, case_.id);
  const relatedLogs = generateRelatedLogsForCase(template, case_.id, relatedAlerts);
  
  caseRelatedAlerts.push(...relatedAlerts);
  caseRelatedLogs.push(...relatedLogs);
});

// Generate additional standalone alerts
const standaloneAlerts = Array.from({ length: 300 }, (_, i) => generateAlert(`alert-${i + 501}`));

// Generate additional standalone logs  
const standaloneLogs = Array.from({ length: 1200 }, (_, i) => generateLog(`log-${i + 1501}`));

// Combine all alerts and logs
export const mockAlerts: Alert[] = [...caseRelatedAlerts, ...standaloneAlerts];
export const mockLogs: Log[] = [...caseRelatedLogs, ...standaloneLogs];

// Generate dashboard stats using fixed timestamp
const last24Hours = new Date(BASE_TIMESTAMP - 24 * 60 * 60 * 1000);

export const mockStats = {
  alerts: {
    total: mockAlerts.length,
    open: mockAlerts.filter(a => a.status === 'open').length,
    critical: mockAlerts.filter(a => a.severity === 'critical').length,
    high: mockAlerts.filter(a => a.severity === 'high').length,
    medium: mockAlerts.filter(a => a.severity === 'medium').length,
    low: mockAlerts.filter(a => a.severity === 'low').length,
    resolved24h: mockAlerts.filter(a => 
      a.resolvedAt && a.resolvedAt > last24Hours
    ).length
  },
  cases: {
    total: mockCases.length,
    open: mockCases.filter(c => c.status === 'open').length,
    inProgress: mockCases.filter(c => c.status === 'in_progress').length,
    closed24h: mockCases.filter(c => 
      c.closedAt && c.closedAt > last24Hours
    ).length,
    avgResolutionTime: 24.5
  },
  logs: {
    total24h: mockLogs.filter(l => 
      l.timestamp > last24Hours
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