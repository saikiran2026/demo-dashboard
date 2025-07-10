'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, AlertTriangle, Clock, CheckCircle, XCircle, Eye, MoreVertical, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { Alert, AlertSeverity, AlertStatus } from '@/types'
import { clsx } from 'clsx'

interface AlertsViewProps {
  alerts: Alert[]
  onAlertAction: (alertId: string, action: 'resolve' | 'snooze' | 'false_positive') => void
}

interface FilterState {
  search: string
  severity: AlertSeverity[]
  status: AlertStatus[]
  source: string[]
}

export function AlertsView({ alerts, onAlertAction }: AlertsViewProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    severity: [],
    status: [],
    source: []
  })
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [sortBy, setSortBy] = useState<'timestamp' | 'severity' | 'status'>('timestamp')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const sources = useMemo(() => {
    return Array.from(new Set(alerts.map(alert => alert.source)))
  }, [alerts])

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter(alert => {
        if (filters.search && !alert.title.toLowerCase().includes(filters.search.toLowerCase()) && 
            !alert.description.toLowerCase().includes(filters.search.toLowerCase())) {
          return false
        }
        if (filters.severity.length > 0 && !filters.severity.includes(alert.severity)) {
          return false
        }
        if (filters.status.length > 0 && !filters.status.includes(alert.status)) {
          return false
        }
        if (filters.source.length > 0 && !filters.source.includes(alert.source)) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1
        switch (sortBy) {
          case 'timestamp':
            return (a.timestamp.getTime() - b.timestamp.getTime()) * multiplier
          case 'severity':
            const severityOrder = { critical: 4, high: 3, medium: 2, low: 1, info: 0 }
            return (severityOrder[a.severity] - severityOrder[b.severity]) * multiplier
          case 'status':
            return a.status.localeCompare(b.status) * multiplier
          default:
            return 0
        }
      })
  }, [alerts, filters, sortBy, sortOrder])

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20'
      case 'high': return 'text-orange-400 bg-orange-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20'
      case 'low': return 'text-green-400 bg-green-500/20'
      case 'info': return 'text-blue-400 bg-blue-500/20'
    }
  }

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case 'open': return 'text-red-400 bg-red-500/20'
      case 'investigating': return 'text-yellow-400 bg-yellow-500/20'
      case 'resolved': return 'text-green-400 bg-green-500/20'
      case 'snoozed': return 'text-blue-400 bg-blue-500/20'
      case 'false_positive': return 'text-gray-400 bg-gray-500/20'
    }
  }

  return (
    <div className="flex h-full bg-dark-bg">
      {/* Main Alerts List */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-dark-border bg-dark-surface">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-dark-text">Security Alerts</h1>
              <p className="text-dark-text-secondary">Monitor and manage security incidents</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-dark-text-secondary">
                {filteredAlerts.length} of {alerts.length} alerts
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary w-4 h-4" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-dark-elevated border border-dark-border rounded-lg text-dark-text placeholder-dark-text-secondary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Severity Filter */}
            <select
              multiple
              value={filters.severity}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                severity: Array.from(e.target.selectedOptions, option => option.value as AlertSeverity)
              }))}
              className="px-3 py-2 bg-dark-elevated border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-blue-500"
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="info">Info</option>
            </select>

            {/* Status Filter */}
            <select
              multiple
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                status: Array.from(e.target.selectedOptions, option => option.value as AlertStatus)
              }))}
              className="px-3 py-2 bg-dark-elevated border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-blue-500"
            >
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="snoozed">Snoozed</option>
              <option value="false_positive">False Positive</option>
            </select>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-dark-surface border-b border-dark-border">
              <tr>
                <th className="text-left p-4 text-dark-text-secondary font-medium">
                  <button
                    onClick={() => {
                      if (sortBy === 'severity') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      } else {
                        setSortBy('severity')
                        setSortOrder('desc')
                      }
                    }}
                    className="flex items-center space-x-1 hover:text-dark-text"
                  >
                    <span>Severity</span>
                  </button>
                </th>
                <th className="text-left p-4 text-dark-text-secondary font-medium">Alert</th>
                <th className="text-left p-4 text-dark-text-secondary font-medium">Source</th>
                <th className="text-left p-4 text-dark-text-secondary font-medium">
                  <button
                    onClick={() => {
                      if (sortBy === 'timestamp') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      } else {
                        setSortBy('timestamp')
                        setSortOrder('desc')
                      }
                    }}
                    className="flex items-center space-x-1 hover:text-dark-text"
                  >
                    <span>Time</span>
                  </button>
                </th>
                <th className="text-left p-4 text-dark-text-secondary font-medium">
                  <button
                    onClick={() => {
                      if (sortBy === 'status') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      } else {
                        setSortBy('status')
                        setSortOrder('desc')
                      }
                    }}
                    className="flex items-center space-x-1 hover:text-dark-text"
                  >
                    <span>Status</span>
                  </button>
                </th>
                <th className="text-left p-4 text-dark-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr 
                  key={alert.id} 
                  className="border-b border-dark-border hover:bg-dark-elevated/50 cursor-pointer"
                  onClick={() => setSelectedAlert(alert)}
                >
                  <td className="p-4">
                    <span className={clsx('px-2 py-1 rounded text-xs font-medium', getSeverityColor(alert.severity))}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-dark-text">{alert.title}</p>
                      <p className="text-sm text-dark-text-secondary truncate max-w-md">{alert.description}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-dark-text">{alert.source}</p>
                      {alert.sourceIp && (
                        <p className="text-xs text-dark-text-secondary">{alert.sourceIp}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-dark-text">{format(alert.timestamp, 'MMM dd, HH:mm')}</p>
                      <p className="text-xs text-dark-text-secondary">{format(alert.timestamp, 'yyyy')}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={clsx('px-2 py-1 rounded text-xs font-medium', getStatusColor(alert.status))}>
                      {alert.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {alert.status === 'open' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onAlertAction(alert.id, 'resolve')
                            }}
                            className="p-1 text-green-400 hover:bg-green-500/20 rounded"
                            title="Resolve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onAlertAction(alert.id, 'snooze')
                            }}
                            className="p-1 text-blue-400 hover:bg-blue-500/20 rounded"
                            title="Snooze for 24h"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onAlertAction(alert.id, 'false_positive')
                            }}
                            className="p-1 text-gray-400 hover:bg-gray-500/20 rounded"
                            title="Mark as False Positive"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedAlert(alert)
                        }}
                        className="p-1 text-dark-text-secondary hover:text-dark-text"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Details Panel */}
      {selectedAlert && (
        <div className="w-96 border-l border-dark-border bg-dark-surface">
          <div className="p-6 border-b border-dark-border">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold text-dark-text">Alert Details</h2>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-dark-text-secondary hover:text-dark-text"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6 overflow-y-auto h-full">
            <div>
              <h3 className="font-medium text-dark-text mb-2">{selectedAlert.title}</h3>
              <p className="text-dark-text-secondary text-sm">{selectedAlert.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-dark-text-secondary mb-1">Severity</p>
                <span className={clsx('px-2 py-1 rounded text-xs font-medium', getSeverityColor(selectedAlert.severity))}>
                  {selectedAlert.severity.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs text-dark-text-secondary mb-1">Status</p>
                <span className={clsx('px-2 py-1 rounded text-xs font-medium', getStatusColor(selectedAlert.status))}>
                  {selectedAlert.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-dark-text-secondary mb-2">Network Information</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">Source IP:</span>
                  <span className="text-dark-text font-mono">{selectedAlert.sourceIp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">Destination IP:</span>
                  <span className="text-dark-text font-mono">{selectedAlert.destinationIp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">Risk Score:</span>
                  <span className="text-dark-text font-semibold">{selectedAlert.riskScore}/100</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-dark-text-secondary mb-2">Indicators</p>
              <div className="space-y-2">
                {selectedAlert.indicators.map((indicator, index) => (
                  <div key={index} className="bg-dark-elevated p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-dark-text-secondary">{indicator.type}</span>
                    </div>
                    <p className="text-sm text-dark-text font-mono break-all">{indicator.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-dark-text-secondary mb-2">Timeline</p>
              <div className="space-y-3">
                {selectedAlert.timeline.map((event, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-dark-text">{event.action}</p>
                      <p className="text-xs text-dark-text-secondary">
                        {format(event.timestamp, 'MMM dd, HH:mm')} by {event.user}
                      </p>
                      {event.details && (
                        <p className="text-xs text-dark-text-secondary mt-1">{event.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedAlert.status === 'open' && (
              <div className="space-y-2">
                <p className="text-xs text-dark-text-secondary mb-2">Actions</p>
                <button
                  onClick={() => onAlertAction(selectedAlert.id, 'resolve')}
                  className="w-full px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
                >
                  Resolve Alert
                </button>
                <button
                  onClick={() => onAlertAction(selectedAlert.id, 'snooze')}
                  className="w-full px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                >
                  Snooze for 24h
                </button>
                <button
                  onClick={() => onAlertAction(selectedAlert.id, 'false_positive')}
                  className="w-full px-3 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors text-sm"
                >
                  Mark as False Positive
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 