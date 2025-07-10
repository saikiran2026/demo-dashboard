'use client'

import { useState, useEffect } from 'react'
import { Dashboard } from '@/components/Dashboard'
import { AlertsView } from '@/components/AlertsView'
import { LogsView } from '@/components/LogsView'
import { CasesView } from '@/components/CasesView'
import { Navigation } from '@/components/Navigation'
import { mockAlerts, mockLogs, mockCases, mockStats } from '@/lib/mockData'
import { Alert, Log, Case } from '@/types'

type ViewType = 'dashboard' | 'alerts' | 'logs' | 'cases'

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [alerts, setAlerts] = useState<Alert[]>(() => mockAlerts || [])
  const [logs] = useState<Log[]>(() => mockLogs || [])
  const [cases] = useState<Case[]>(() => mockCases || [])
  const [stats, setStats] = useState(() => mockStats)

  // Simulate real-time updates (client-side only)
  useEffect(() => {
    // Small delay to ensure client-side only execution
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        // Update stats with deterministic variation
        const now = new Date().getTime()
        const variation = (now % 1000) / 10 // Creates predictable variation
        
        setStats(prevStats => ({
          ...prevStats,
          system: {
            ...prevStats.system,
            responseTime: Math.floor(200 + variation),
            uptimePercent: 99.5 + (variation / 1000)
          }
        }))
      }, 5000)

      return () => clearInterval(interval)
    }, 100)

    return () => clearTimeout(timeout)
  }, [])

  const handleAlertAction = (alertId: string, action: 'resolve' | 'snooze' | 'false_positive') => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => {
        if (alert.id === alertId) {
          const updatedAlert = { ...alert }
          
          switch (action) {
            case 'resolve':
              updatedAlert.status = 'resolved'
              updatedAlert.resolvedAt = new Date()
              updatedAlert.resolvedBy = 'Current User'
              break
            case 'snooze':
              updatedAlert.status = 'snoozed'
              updatedAlert.snoozeUntil = new Date(Date.now() + 24 * 60 * 60 * 1000)
              break
            case 'false_positive':
              updatedAlert.status = 'false_positive'
              updatedAlert.falsePositiveReason = 'Marked as false positive by analyst'
              break
          }
          
          updatedAlert.timeline.push({
            timestamp: new Date(),
            action: `Alert ${action}`,
            user: 'Current User',
            details: `Alert marked as ${action}`
          })
          
          return updatedAlert
        }
        return alert
      })
    )
  }

  const renderCurrentView = () => {
    // Safety checks to prevent rendering with undefined data
    if (!stats || !alerts || !logs || !cases) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-dark-text">Loading...</div>
        </div>
      )
    }

    try {
      switch (currentView) {
        case 'dashboard':
          return <Dashboard stats={stats} alerts={alerts} logs={logs} cases={cases} />
        case 'alerts':
          return <AlertsView alerts={alerts} onAlertAction={handleAlertAction} />
        case 'logs':
          return <LogsView logs={logs} />
        case 'cases':
          return <CasesView cases={cases} />
        default:
          return <Dashboard stats={stats} alerts={alerts} logs={logs} cases={cases} />
      }
    } catch (error) {
      console.error('Error rendering view:', error)
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-red-400">Error loading view. Please refresh the page.</div>
        </div>
      )
    }
  }

  return (
    <div className="flex h-screen bg-dark-bg">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-hidden">
        {renderCurrentView()}
      </main>
    </div>
  )
} 