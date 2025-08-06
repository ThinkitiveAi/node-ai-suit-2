import { useState, useEffect } from 'react'
import { User, LogOut, Stethoscope, Activity, Calendar, Users, Settings } from 'lucide-react'
import { authService } from '../config/api'

function Dashboard({ onLogout, onNavigateToSettings }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authData = authService.getAuthData()
    if (authData.user) {
      setUser(authData.user)
    }
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    authService.clearAuthData()
    if (onLogout) {
      onLogout()
    } else {
      window.location.reload()
    }
  }

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="dashboard-error">
        <h2>Authentication Required</h2>
        <p>Please log in to access your dashboard.</p>
        <button onClick={() => window.location.reload()}>Go to Login</button>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <Stethoscope size={24} />
          <h1>Sample EMR - Provider Dashboard</h1>
        </div>
        <div className="dashboard-user">
          <div className="user-info">
            <User size={20} />
            <span>{user.name || user.email}</span>
          </div>
          <div className="dashboard-actions">
            <button onClick={onNavigateToSettings} className="settings-button">
              <Calendar size={16} />
              View Availability
            </button>
            <button onClick={handleLogout} className="logout-button">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome back, {user.name || 'Provider'}!</h2>
          <p>Here's your healthcare portal overview</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>Active Patients</h3>
              <p className="stat-number">24</p>
              <p className="stat-change positive">+3 this week</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <h3>Today's Appointments</h3>
              <p className="stat-number">8</p>
              <p className="stat-change">2 pending</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Activity size={24} />
            </div>
            <div className="stat-content">
              <h3>Recent Activity</h3>
              <p className="stat-number">12</p>
              <p className="stat-change">Updates today</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <button className="action-button">
              <Calendar size={20} />
              Schedule Appointment
            </button>
            <button className="action-button">
              <Users size={20} />
              View Patients
            </button>
            <button className="action-button">
              <Activity size={20} />
              View Reports
            </button>
            <button className="action-button" onClick={onNavigateToSettings}>
              <Calendar size={20} />
              Manage Availability
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard 