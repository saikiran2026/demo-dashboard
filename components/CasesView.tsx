'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Briefcase, Clock, User, Calendar, FileText, AlertTriangle } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { Case, CaseStatus, AlertSeverity } from '@/types'
import { clsx } from 'clsx'

interface CasesViewProps {
  cases: Case[]
}

interface FilterState {
  search: string
  status: CaseStatus[]
  severity: AlertSeverity[]
  assignedTo: string[]
}

export function CasesView({ cases }: CasesViewProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: [],
    severity: [],
    assignedTo: []
  })
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority' | 'status'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const assignees = useMemo(() => {
    return Array.from(new Set(cases.map(case_ => case_.assignedTo)))
  }, [cases])

  const filteredCases = useMemo(() => {
    return cases
      .filter(case_ => {
        if (filters.search && !case_.title.toLowerCase().includes(filters.search.toLowerCase()) && 
            !case_.description.toLowerCase().includes(filters.search.toLowerCase())) {
          return false
        }
        if (filters.status.length > 0 && !filters.status.includes(case_.status)) {
          return false
        }
        if (filters.severity.length > 0 && !filters.severity.includes(case_.severity)) {
          return false
        }
        if (filters.assignedTo.length > 0 && !filters.assignedTo.includes(case_.assignedTo)) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1
        switch (sortBy) {
          case 'createdAt':
            return (a.createdAt.getTime() - b.createdAt.getTime()) * multiplier
          case 'priority':
            return (a.priority - b.priority) * multiplier
          case 'status':
            return a.status.localeCompare(b.status) * multiplier
          default:
            return 0
        }
      })
  }, [cases, filters, sortBy, sortOrder])

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20'
      case 'high': return 'text-orange-400 bg-orange-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20'
      case 'low': return 'text-green-400 bg-green-500/20'
    }
  }

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case 'open': return 'text-red-400 bg-red-500/20'
      case 'in_progress': return 'text-yellow-400 bg-yellow-500/20'
      case 'closed': return 'text-green-400 bg-green-500/20'
      case 'escalated': return 'text-purple-400 bg-purple-500/20'
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'text-red-400'
    if (priority >= 3) return 'text-orange-400'
    if (priority >= 2) return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <div className="flex h-full bg-dark-bg">
      {/* Main Cases List */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-dark-border bg-dark-surface">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-dark-text">Security Cases</h1>
              <p className="text-dark-text-secondary">Manage security incidents and investigations</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-dark-text-secondary">
                {filteredCases.length} of {cases.length} cases
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary w-4 h-4" />
              <input
                type="text"
                placeholder="Search cases..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-dark-elevated border border-dark-border rounded-lg text-dark-text placeholder-dark-text-secondary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Status Filter */}
              <div className="relative">
                <label className="block text-xs text-dark-text-secondary mb-1">Status</label>
                <select
                  value=""
                  onChange={(e) => {
                    const value = e.target.value as CaseStatus
                    if (value && !filters.status.includes(value)) {
                      setFilters(prev => ({ 
                        ...prev, 
                        status: [...prev.status, value]
                      }))
                    }
                  }}
                  className="min-w-[120px] px-3 py-2 bg-dark-elevated border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Add Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                  <option value="escalated">Escalated</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div className="relative">
                <label className="block text-xs text-dark-text-secondary mb-1">Severity</label>
                <select
                  value=""
                  onChange={(e) => {
                    const value = e.target.value as AlertSeverity
                    if (value && !filters.severity.includes(value)) {
                      setFilters(prev => ({ 
                        ...prev, 
                        severity: [...prev.severity, value]
                      }))
                    }
                  }}
                  className="min-w-[120px] px-3 py-2 bg-dark-elevated border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Add Severity</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Assignee Filter */}
              <div className="relative">
                <label className="block text-xs text-dark-text-secondary mb-1">Assignee</label>
                <select
                  value=""
                  onChange={(e) => {
                    const value = e.target.value
                    if (value && !filters.assignedTo.includes(value)) {
                      setFilters(prev => ({ 
                        ...prev, 
                        assignedTo: [...prev.assignedTo, value]
                      }))
                    }
                  }}
                  className="min-w-[140px] px-3 py-2 bg-dark-elevated border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Add Assignee</option>
                  {assignees.map(assignee => (
                    <option key={assignee} value={assignee}>{assignee}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.status.length > 0 || filters.severity.length > 0 || filters.assignedTo.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {filters.status.map(status => (
                <span key={status} className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  <span>Status: {status.replace('_', ' ')}</span>
                  <button 
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      status: prev.status.filter(s => s !== status)
                    }))}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.severity.map(severity => (
                <span key={severity} className="inline-flex items-center space-x-1 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                  <span>Severity: {severity}</span>
                  <button 
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      severity: prev.severity.filter(s => s !== severity)
                    }))}
                    className="text-orange-400 hover:text-orange-300"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.assignedTo.map(assignee => (
                <span key={assignee} className="inline-flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  <span>Assignee: {assignee}</span>
                  <button 
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      assignedTo: prev.assignedTo.filter(a => a !== assignee)
                    }))}
                    className="text-green-400 hover:text-green-300"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={() => setFilters({ search: '', status: [], severity: [], assignedTo: [] })}
                className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm hover:bg-red-500/30"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Cases Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCases.map((case_) => (
              <div 
                key={case_.id} 
                className="bg-dark-surface border border-dark-border rounded-lg p-6 hover:bg-dark-elevated/50 cursor-pointer transition-colors"
                onClick={() => setSelectedCase(case_)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={clsx('px-2 py-1 rounded text-xs font-medium', getSeverityColor(case_.severity))}>
                      {case_.severity.toUpperCase()}
                    </span>
                    <span className={clsx('px-2 py-1 rounded text-xs font-medium', getStatusColor(case_.status))}>
                      {case_.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={clsx('text-sm font-medium', getPriorityColor(case_.priority))}>
                      P{case_.priority}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-dark-text mb-2 line-clamp-2">{case_.title}</h3>
                <p className="text-dark-text-secondary text-sm mb-4 line-clamp-3">{case_.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-dark-text-secondary" />
                    <span className="text-dark-text-secondary">Assigned to:</span>
                    <span className="text-dark-text">{case_.assignedTo}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-dark-text-secondary" />
                    <span className="text-dark-text-secondary">Created:</span>
                    <span className="text-dark-text">{formatDistanceToNow(case_.createdAt, { addSuffix: true })}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-dark-text-secondary" />
                    <span className="text-dark-text-secondary">Alerts:</span>
                    <span className="text-dark-text">{case_.relatedAlerts.length}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <FileText className="w-4 h-4 text-dark-text-secondary" />
                    <span className="text-dark-text-secondary">Logs:</span>
                    <span className="text-dark-text">{case_.relatedLogs.length}</span>
                  </div>

                  {case_.estimatedHours && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-dark-text-secondary" />
                      <span className="text-dark-text-secondary">Est. Time:</span>
                      <span className="text-dark-text">{case_.estimatedHours}h</span>
                      {case_.actualHours && (
                        <span className="text-dark-text-secondary">/ {case_.actualHours}h actual</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {case_.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredCases.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
              <p className="text-dark-text-secondary">No cases found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Case Details Panel */}
      {selectedCase && (
        <div className="w-96 border-l border-dark-border bg-dark-surface">
          <div className="p-6 border-b border-dark-border">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold text-dark-text">Case Details</h2>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-dark-text-secondary hover:text-dark-text"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6 overflow-y-auto h-full">
            <div>
              <h3 className="font-medium text-dark-text mb-2">{selectedCase.title}</h3>
              <p className="text-dark-text-secondary text-sm">{selectedCase.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-dark-text-secondary mb-1">Severity</p>
                <span className={clsx('px-2 py-1 rounded text-xs font-medium', getSeverityColor(selectedCase.severity))}>
                  {selectedCase.severity.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs text-dark-text-secondary mb-1">Status</p>
                <span className={clsx('px-2 py-1 rounded text-xs font-medium', getStatusColor(selectedCase.status))}>
                  {selectedCase.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-dark-text-secondary mb-2">Case Information</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">Priority:</span>
                  <span className={clsx('font-semibold', getPriorityColor(selectedCase.priority))}>
                    P{selectedCase.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">Category:</span>
                  <span className="text-dark-text">{selectedCase.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">Assigned to:</span>
                  <span className="text-dark-text">{selectedCase.assignedTo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">Created by:</span>
                  <span className="text-dark-text">{selectedCase.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">Created:</span>
                  <span className="text-dark-text">{format(selectedCase.createdAt, 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text-secondary">Last updated:</span>
                  <span className="text-dark-text">{format(selectedCase.updatedAt, 'MMM dd, yyyy')}</span>
                </div>
                {selectedCase.closedAt && (
                  <div className="flex justify-between">
                    <span className="text-dark-text-secondary">Closed:</span>
                    <span className="text-dark-text">{format(selectedCase.closedAt, 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-dark-text-secondary mb-2">Time Tracking</p>
              <div className="space-y-2 text-sm">
                {selectedCase.estimatedHours && (
                  <div className="flex justify-between">
                    <span className="text-dark-text-secondary">Estimated:</span>
                    <span className="text-dark-text">{selectedCase.estimatedHours}h</span>
                  </div>
                )}
                {selectedCase.actualHours && (
                  <div className="flex justify-between">
                    <span className="text-dark-text-secondary">Actual:</span>
                    <span className="text-dark-text">{selectedCase.actualHours}h</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-dark-text-secondary mb-2">Related Items</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-dark-text-secondary mb-1">Alerts ({selectedCase.relatedAlerts.length})</p>
                  <div className="space-y-1">
                    {selectedCase.relatedAlerts.slice(0, 3).map((alertId) => (
                      <div key={alertId} className="bg-red-500/10 border border-red-500/20 p-2 rounded text-xs">
                        <span className="text-red-400 font-mono">{alertId}</span>
                      </div>
                    ))}
                    {selectedCase.relatedAlerts.length > 3 && (
                      <p className="text-xs text-dark-text-secondary">
                        +{selectedCase.relatedAlerts.length - 3} more alerts
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-dark-text-secondary mb-1">Logs ({selectedCase.relatedLogs.length})</p>
                  <div className="space-y-1">
                    {selectedCase.relatedLogs.slice(0, 3).map((logId) => (
                      <div key={logId} className="bg-blue-500/10 border border-blue-500/20 p-2 rounded text-xs">
                        <span className="text-blue-400 font-mono">{logId}</span>
                      </div>
                    ))}
                    {selectedCase.relatedLogs.length > 3 && (
                      <p className="text-xs text-dark-text-secondary">
                        +{selectedCase.relatedLogs.length - 3} more logs
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-dark-text-secondary mb-2">Timeline</p>
              <div className="space-y-3">
                {selectedCase.timeline.map((event, index) => (
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

            <div>
              <p className="text-xs text-dark-text-secondary mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {selectedCase.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 