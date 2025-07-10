'use client'

import { 
  Shield, 
  AlertTriangle, 
  FileText, 
  Briefcase, 
  Activity,
  Settings,
  User,
  Bell
} from 'lucide-react'
import { clsx } from 'clsx'

type ViewType = 'dashboard' | 'alerts' | 'logs' | 'cases'

interface NavigationProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'logs', label: 'Logs', icon: FileText },
  { id: 'cases', label: 'Cases', icon: Briefcase },
]

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <nav className="w-64 bg-dark-surface border-r border-dark-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-dark-text">SOC Center</h1>
            <p className="text-sm text-dark-text-secondary">Security Operations</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-6">
        <div className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as ViewType)}
                className={clsx(
                  'w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200',
                  currentView === item.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-elevated'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-dark-text-secondary">System Operational</span>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 text-dark-text-secondary hover:text-dark-text transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button className="p-2 text-dark-text-secondary hover:text-dark-text transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="mt-3 flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-dark-text">Security Analyst</p>
            <p className="text-xs text-dark-text-secondary">sarah.johnson@corp.com</p>
          </div>
        </div>
      </div>
    </nav>
  )
} 