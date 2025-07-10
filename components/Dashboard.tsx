'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { AlertTriangle, Shield, Activity, Clock, TrendingUp, Users, Server, Zap } from 'lucide-react'
import { Alert, Log, Case, DashboardStats } from '@/types'
import { format, subDays } from 'date-fns'

interface DashboardProps {
  stats: DashboardStats
  alerts: Alert[]
  logs: Log[]
  cases: Case[]
}

const SEVERITY_COLORS = {
  critical: '#dc2626',
  high: '#ea580c', 
  medium: '#ca8a04',
  low: '#16a34a',
  info: '#3b82f6'
}

export function Dashboard({ stats, alerts, logs, cases }: DashboardProps) {
  // Prepare chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const dayAlerts = alerts.filter(alert => 
      alert.timestamp.toDateString() === date.toDateString()
    )
    
    return {
      date: format(date, 'MMM dd'),
      alerts: dayAlerts.length,
      critical: dayAlerts.filter(a => a.severity === 'critical').length,
      high: dayAlerts.filter(a => a.severity === 'high').length,
      medium: dayAlerts.filter(a => a.severity === 'medium').length,
      low: dayAlerts.filter(a => a.severity === 'low').length
    }
  })

  const severityData = [
    { name: 'Critical', value: stats.alerts.critical, color: SEVERITY_COLORS.critical },
    { name: 'High', value: stats.alerts.high, color: SEVERITY_COLORS.high },
    { name: 'Medium', value: stats.alerts.medium, color: SEVERITY_COLORS.medium },
    { name: 'Low', value: stats.alerts.low, color: SEVERITY_COLORS.low }
  ]

  const recentAlerts = alerts
    .filter(alert => alert.status === 'open' || alert.status === 'investigating')
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5)

  const recentCases = cases
    .filter(case_ => case_.status !== 'closed')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-dark-bg">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark-text">Security Operations Center</h1>
          <p className="text-dark-text-secondary mt-1">Real-time security monitoring and threat detection</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-dark-text">System Operational</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-dark-text-secondary">Last Updated</p>
            <p className="text-sm font-medium text-dark-text">{format(new Date(), 'HH:mm:ss')}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-secondary text-sm font-medium">Active Alerts</p>
              <p className="text-3xl font-bold text-dark-text mt-2">{stats.alerts.open}</p>
              <p className="text-sm text-green-500 mt-1">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {stats.alerts.resolved24h} resolved today
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-secondary text-sm font-medium">Open Cases</p>
              <p className="text-3xl font-bold text-dark-text mt-2">{stats.cases.open}</p>
              <p className="text-sm text-blue-500 mt-1">
                <Clock className="w-4 h-4 inline mr-1" />
                {stats.cases.avgResolutionTime}h avg resolution
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-secondary text-sm font-medium">System Uptime</p>
              <p className="text-3xl font-bold text-dark-text mt-2">{stats.system.uptimePercent.toFixed(1)}%</p>
              <p className="text-sm text-green-500 mt-1">
                <Server className="w-4 h-4 inline mr-1" />
                {stats.system.responseTime}ms response
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-secondary text-sm font-medium">Log Events (24h)</p>
              <p className="text-3xl font-bold text-dark-text mt-2">{stats.logs.total24h.toLocaleString()}</p>
              <p className="text-sm text-yellow-500 mt-1">
                <Zap className="w-4 h-4 inline mr-1" />
                {stats.logs.errors} errors detected
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Trends */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Alert Trends (7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="critical" stackId="a" fill={SEVERITY_COLORS.critical} />
                <Bar dataKey="high" stackId="a" fill={SEVERITY_COLORS.high} />
                <Bar dataKey="medium" stackId="a" fill={SEVERITY_COLORS.medium} />
                <Bar dataKey="low" stackId="a" fill={SEVERITY_COLORS.low} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Alert Severity Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {severityData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-dark-text-secondary">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-dark-surface border border-dark-border rounded-lg">
          <div className="p-6 border-b border-dark-border">
            <h3 className="text-lg font-semibold text-dark-text">Recent Alerts</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="p-4 border-b border-dark-border last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-2 h-2 rounded-full bg-${alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : alert.severity === 'medium' ? 'yellow' : 'green'}-500`}></div>
                      <h4 className="font-medium text-dark-text">{alert.title}</h4>
                    </div>
                    <p className="text-sm text-dark-text-secondary mb-2">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-dark-text-secondary">
                      <span>{alert.source}</span>
                      <span>{format(alert.timestamp, 'HH:mm')}</span>
                      {alert.sourceIp && <span>{alert.sourceIp}</span>}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium bg-${alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : alert.severity === 'medium' ? 'yellow' : 'green'}-500/20 text-${alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : alert.severity === 'medium' ? 'yellow' : 'green'}-400`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Cases */}
        <div className="bg-dark-surface border border-dark-border rounded-lg">
          <div className="p-6 border-b border-dark-border">
            <h3 className="text-lg font-semibold text-dark-text">Active Cases</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recentCases.map((case_) => (
              <div key={case_.id} className="p-4 border-b border-dark-border last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-dark-text mb-1">{case_.title}</h4>
                    <p className="text-sm text-dark-text-secondary mb-2">{case_.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-dark-text-secondary">
                      <span>Assigned to: {case_.assignedTo}</span>
                      <span>{format(case_.createdAt, 'MMM dd')}</span>
                      <span>Priority: {case_.priority}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium bg-${case_.status === 'open' ? 'red' : case_.status === 'in_progress' ? 'yellow' : 'green'}-500/20 text-${case_.status === 'open' ? 'red' : case_.status === 'in_progress' ? 'yellow' : 'green'}-400`}>
                    {case_.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 