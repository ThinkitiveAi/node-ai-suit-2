import { useState, useEffect } from 'react'
import LoginPage from './components/LoginPage'
import RegistrationPage from './components/RegistrationPage'
import PatientLoginPage from './components/PatientLoginPage'
import Dashboard from './components/Dashboard'
import AvailabilitySettings from './components/AvailabilitySettings'
import AvailabilityCalendar from './components/AvailabilityCalendar'
import SlotCreationForm from './components/SlotCreationForm'
import { authService } from './config/api'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login') // 'patient-login', 'login', 'registration', 'dashboard', 'availability-settings', 'availability-calendar', 'slot-creation'
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [availabilityData, setAvailabilityData] = useState(null)

  useEffect(() => {
    // Check if user is authenticated on app load
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true)
      setCurrentPage('dashboard')
    }
  }, [])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    authService.clearAuthData()
    setIsAuthenticated(false)
    setCurrentPage('login')
  }

  const handleNavigateToSettings = () => {
    setCurrentPage('availability-settings')
  }

  const handleNavigateToCalendar = () => {
    setCurrentPage('availability-calendar')
  }

  const handleNavigateToSlotCreation = () => {
    setCurrentPage('slot-creation')
  }

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard')
  }

  const handleBackToCalendar = () => {
    setCurrentPage('availability-calendar')
  }

  const handleBackToSettings = () => {
    setCurrentPage('availability-settings')
  }

  const handleAvailabilityCreated = (data) => {
    // Store the created availability data
    setAvailabilityData(data)
    // Navigate back to calendar
    setCurrentPage('availability-calendar')
    
    // Clear the data after a short delay to prevent re-use
    setTimeout(() => {
      setAvailabilityData(null)
    }, 100)
  }

  // If authenticated, show appropriate page
  if (isAuthenticated && ['dashboard', 'availability-settings', 'availability-calendar', 'slot-creation'].includes(currentPage)) {
    if (currentPage === 'availability-settings') {
      return <AvailabilitySettings onBack={handleBackToDashboard} />
    }
    if (currentPage === 'availability-calendar') {
      return (
        <AvailabilityCalendar 
          onBack={handleBackToDashboard}
          onEditAvailability={handleNavigateToSettings}
          onAddAvailability={handleNavigateToSlotCreation}
          initialAvailabilityData={availabilityData}
        />
      )
    }
    if (currentPage === 'slot-creation') {
      return (
        <SlotCreationForm 
          onSave={handleAvailabilityCreated}
          onCancel={handleBackToCalendar}
        />
      )
    }
    return <Dashboard onLogout={handleLogout} onNavigateToSettings={handleNavigateToCalendar} />
  }

  return (
    <div className="app-container">
      {currentPage === 'patient-login' ? (
        <PatientLoginPage onSwitchToProviderLogin={() => setCurrentPage('login')} />
      ) : currentPage === 'login' ? (
        <LoginPage 
          onSwitchToRegistration={() => setCurrentPage('registration')}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <RegistrationPage onSwitchToLogin={() => setCurrentPage('login')} />
      )}
    </div>
  )
}

export default App
