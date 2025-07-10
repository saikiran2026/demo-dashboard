'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, AlertCircle, Info, AlertTriangle, Bug, Calendar, Download } from 'lucide-react'
import { format } from 'date-fns'
import { Log, LogLevel } from '@/types'
import { clsx } from 'clsx'

// Fixed base timestamp for consistent server/client rendering (same as mockData)
const BASE_TIMESTAMP = new Date('2024-01-15T10:00:00Z').getTime();

interface LogsViewProps {
  logs: Log[]
}

interface FilterState {
  search: string
  level: LogLevel[]
  source: string[]
  timeRange: 'last_hour' | 'last_24h' | 'last_7d' | 'all'
}

export function LogsView({ logs }: LogsViewProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    level: [],
    source: [],
    timeRange: 'last_24h'
  })
  const [selectedLog, setSelectedLog] = useState<Log | null>(null)

  const sources = useMemo(() => {
    return Array.from(new Set(logs.map(log => log.source)))
  }, [logs])

  const filteredLogs = useMemo(() => {
    // Use fixed timestamp for consistent filtering
    const now = new Date(BASE_TIMESTAMP)
    const timeFilters = {
      last_hour: new Date(now.getTime() - 60 * 60 * 1000),
      last_24h: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      last_7d: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      all: new Date(0)
    }

    return logs
      .filter(log => {
        if (filters.search && !log.message.toLowerCase().includes(filters.search.toLowerCase()) && 
            !log.rawLog.toLowerCase().includes(filters.search.toLowerCase())) {
          return false
        }
        if (filters.level.length > 0 && !filters.level.includes(log.level)) {
          return false
        }
        if (filters.source.length > 0 && !filters.source.includes(log.source)) {
          return false
        }
        if (log.timestamp < timeFilters[filters.timeRange]) {
          return false
        }
        return true
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [logs, filters])

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'error': return 'text-red-400 bg-red-500/20'
      case 'warn': return 'text-yellow-400 bg-yellow-500/20'
      case 'info': return 'text-blue-400 bg-blue-500/20'
      case 'debug': return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case 'error': return AlertCircle
      case 'warn': return AlertTriangle
      case 'info': return Info
      case 'debug': return Bug
    }
  }

  return (
    <div className="flex h-full bg-dark-bg">
      {/* Main Logs List */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-dark-border bg-dark-surface">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-dark-text">System Logs</h1>
              <p className="text-dark-text-secondary">Monitor system events and application logs</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-dark-text-secondary">
                {filteredLogs.length} of {logs.length} logs
              </span>
              <button className="flex items-center space-x-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 w-5 h-5 transition-colors pointer-events-none" />
              <input
                type="text"
                placeholder="Search logs by message, source, event type, user ID, or IP address..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-12 pr-4 py-3 bg-dark-surface border-2 border-gray-600 rounded-xl text-dark-text placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-sm font-medium shadow-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* Level Filter */}
              <div className="min-w-[140px]">
                <label className="block text-xs font-medium text-gray-400 mb-2">Log Level</label>
                <select
                  value=""
                  onChange={(e) => {
                    const value = e.target.value as LogLevel
                    if (value && !filters.level.includes(value)) {
                      setFilters(prev => ({ 
                        ...prev, 
                        level: [...prev.level, value]
                      }))
                    }
                  }}
                  className="w-full px-3 py-3 bg-dark-surface border-2 border-gray-600 rounded-xl text-dark-text focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  <option value="">Filter by level</option>
                  <option value="error">🔴 Error</option>
                  <option value="warn">🟡 Warning</option>
                  <option value="info">🔵 Info</option>
                  <option value="debug">⚪ Debug</option>
                </select>
              </div>

              {/* Time Range Filter */}
              <div className="min-w-[140px]">
                <label className="block text-xs font-medium text-gray-400 mb-2">Time Range</label>
                <select
                  value={filters.timeRange}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    timeRange: e.target.value as FilterState['timeRange']
                  }))}
                  className="w-full px-3 py-3 bg-dark-surface border-2 border-gray-600 rounded-xl text-dark-text focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  <option value="last_hour">⏰ Last Hour</option>
                  <option value="last_24h">📅 Last 24 Hours</option>
                  <option value="last_7d">📊 Last 7 Days</option>
                  <option value="all">🌐 All Time</option>
                </select>
              </div>

              {/* Source Filter */}
              <div className="min-w-[140px]">
                <label className="block text-xs font-medium text-gray-400 mb-2">Source</label>
                <select
                  value=""
                  onChange={(e) => {
                    const value = e.target.value
                    if (value && !filters.source.includes(value)) {
                      setFilters(prev => ({ 
                        ...prev, 
                        source: [...prev.source, value]
                      }))
                    }
                  }}
                  className="w-full px-3 py-3 bg-dark-surface border-2 border-gray-600 rounded-xl text-dark-text focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  <option value="">Filter by source</option>
                  {sources.map(source => (
                    <option key={source} value={source}>🖥️ {source}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.level.length > 0 || filters.source.length > 0 || filters.timeRange !== 'last_24h') && (
            <div className="flex flex-wrap gap-2">
              {filters.level.map(level => (
                <span key={level} className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30">
                  <span>Level: {level}</span>
                  <button 
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      level: prev.level.filter(l => l !== level)
                    }))}
                    className="text-purple-400 hover:text-purple-300 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.source.map(source => (
                <span key={source} className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                  <span>Source: {source}</span>
                  <button 
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      source: prev.source.filter(s => s !== source)
                    }))}
                    className="text-green-400 hover:text-green-300 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.timeRange !== 'last_24h' && (
                <span className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                  <span>Time: {filters.timeRange.replace('_', ' ')}</span>
                  <button 
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      timeRange: 'last_24h'
                    }))}
                    className="text-blue-400 hover:text-blue-300 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => setFilters({ search: '', level: [], source: [], timeRange: 'last_24h' })}
                className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium hover:bg-red-500/30 border border-red-500/30"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Logs List */}
        <div className="flex-1 overflow-auto">
          <div className="space-y-1 p-4">
            {filteredLogs.map((log) => {
              const LevelIcon = getLevelIcon(log.level)
              return (
                <div 
                  key={log.id} 
                  className="bg-dark-surface border border-dark-border rounded-lg p-4 hover:bg-dark-elevated/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedLog(log)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <LevelIcon className={clsx('w-4 h-4', {
                        'text-red-400': log.level === 'error',
                        'text-yellow-400': log.level === 'warn',
                        'text-blue-400': log.level === 'info',
                        'text-gray-400': log.level === 'debug'
                      })} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className={clsx('px-2 py-1 rounded text-xs font-medium', getLevelColor(log.level))}>
                            {log.level.toUpperCase()}
                          </span>
                          <span className="text-sm text-dark-text-secondary">{log.source}</span>
                          {log.sourceIp && (
                            <span className="text-xs text-dark-text-secondary font-mono">{log.sourceIp}</span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-dark-text-secondary">
                            {format(log.timestamp, 'MMM dd, HH:mm:ss')}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-dark-text mb-2">{log.message}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-dark-text-secondary">
                        <span>Event: {log.eventType}</span>
                        {log.userId && <span>User: {log.userId}</span>}
                        {log.details.response_code && (
                          <span>Status: {log.details.response_code}</span>
                        )}
                        {log.relatedAlerts.length > 0 && (
                          <span className="text-red-400">{log.relatedAlerts.length} alerts</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
                <p className="text-dark-text-secondary">No logs found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Details Panel */}
      {selectedLog && (
        <div className="w-96 border-l border-dark-border bg-dark-surface">
          <div className="p-6 border-b border-dark-border">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold text-dark-text">Log Details</h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-dark-text-secondary hover:text-dark-text"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6 overflow-y-auto h-full">
            <div>
              <p className="text-xs text-dark-text-secondary mb-2">Message</p>
              <p className="text-dark-text">{selectedLog.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-dark-text-secondary mb-1">Level</p>
                <span className={clsx('px-2 py-1 rounded text-xs font-medium', getLevelColor(selectedLog.level))}>
                  {selectedLog.level.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs text-dark-text-secondary mb-1">Source</p>
                <p className="text-dark-text text-sm">{selectedLog.source}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-dark-text-secondary mb-2">Timestamp</p>
              <p className="text-dark-text font-mono">{format(selectedLog.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS')}</p>
            </div>

            <div>
              <p className="text-xs text-dark-text-secondary mb-2">Network Information</p>
              <div className="space-y-2 text-sm">
                {selectedLog.sourceIp && (
                  <div className="flex justify-between">
                    <span className="text-dark-text-secondary">Source IP:</span>
                    <span className="text-dark-text font-mono">{selectedLog.sourceIp}</span>
                  </div>
                )}
                {selectedLog.userId && (
                  <div className="flex justify-between">
                    <span className="text-dark-text-secondary">User ID:</span>
                    <span className="text-dark-text">{selectedLog.userId}</span>
                  </div>
                )}
                {selectedLog.sessionId && (
                  <div className="flex justify-between">
                    <span className="text-dark-text-secondary">Session:</span>
                    <span className="text-dark-text font-mono text-xs">{selectedLog.sessionId}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-dark-text-secondary mb-2">Event Details</p>
              <div className="bg-dark-elevated p-3 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-dark-text-secondary">Event Type:</span>
                    <span className="text-dark-text">{selectedLog.eventType}</span>
                  </div>
                  {Object.entries(selectedLog.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-dark-text-secondary">{key}:</span>
                      <span className="text-dark-text">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {selectedLog.relatedAlerts.length > 0 && (
              <div>
                <p className="text-xs text-dark-text-secondary mb-2">Related Alerts</p>
                <div className="space-y-2">
                  {selectedLog.relatedAlerts.map((alertId) => (
                    <div key={alertId} className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                      <p className="text-sm text-red-400">Alert ID: {alertId}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-dark-text-secondary mb-2">Raw Log</p>
              <div className="bg-dark-elevated p-3 rounded-lg">
                <pre className="text-xs text-dark-text font-mono whitespace-pre-wrap break-words">
                  {selectedLog.rawLog}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 