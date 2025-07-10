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
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [logs] = useState<Log[]>(mockLogs)
  const [cases] = useState<Case[]>(mockCases)
  const [stats, setStats] = useState(mockStats)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        system: {
          ...prevStats.system,
          responseTime: Math.floor(Math.random() * 100) + 200,
          uptimePercent: 99.5 + Math.random() * 0.5
        }
      }))
    }, 5000)

    return () => clearInterval(interval)
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