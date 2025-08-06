import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Plus, 
  Edit3, 
  Calendar, 
  User, 
  MapPin,
  ChevronLeft,
  ChevronRight,
  Video,
  Clock
} from 'lucide-react'
import { availabilityService } from '../config/api'

function AvailabilityCalendar({ onBack, onEditAvailability, onAddAvailability, initialAvailabilityData }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedProvider, setSelectedProvider] = useState('Hemlata metsl')
  const [selectedLocation, setSelectedLocation] = useState('Select Location')
  const [activeTab, setActiveTab] = useState('availability')
  const [availabilityData, setAvailabilityData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Sample availability data - this will come from API
  const sampleAvailability = [
    { date: '2025-07-02', type: 'in-person', location: 'Chennai', startTime: '10:00 AM', endTime: '05:00 PM', color: 'purple' },
    { date: '2025-07-06', type: 'virtual', location: 'Virtual', startTime: '10:00 AM', endTime: '12:00 PM', color: 'yellow' },
    { date: '2025-07-07', type: 'in-person', location: 'Chennai', startTime: '09:00 AM', endTime: '11:00 PM', color: 'purple' },
    { date: '2025-07-08', type: 'in-person', location: 'Chennai', startTime: '10:30 AM', endTime: '11:00 PM', color: 'purple' },
    { date: '2025-07-09', type: 'in-person', location: 'Chennai', startTime: '10:00 AM', endTime: '05:00 PM', color: 'purple' },
    { date: '2025-07-13', type: 'virtual', location: 'Virtual', startTime: '10:00 AM', endTime: '12:00 PM', color: 'yellow' },
    { date: '2025-07-14', type: 'in-person', location: 'Chennai', startTime: '09:00 AM', endTime: '11:00 PM', color: 'purple' },
    { date: '2025-07-16', type: 'in-person', location: 'Chennai', startTime: '10:00 AM', endTime: '05:00 PM', color: 'purple' },
    { date: '2025-07-18', type: 'blocked', location: 'Blocked', startTime: '01:00 PM', endTime: '02:00 PM', color: 'red' },
    { date: '2025-07-25', type: 'in-person', location: 'Chennai', startTime: '10:30 AM', endTime: '11:00 PM', color: 'purple' },
    { date: '2025-07-26', type: 'in-person', location: 'Chennai', startTime: '08:30 AM', endTime: '09:30 PM', color: 'purple' },
    { date: '2025-07-28', type: 'in-person', location: 'Chennai', startTime: '12:00 PM', endTime: '11:30 PM', color: 'purple' },
    { date: '2025-07-30', type: 'in-person', location: 'Chennai', startTime: '11:00 AM', endTime: '12:00 PM', color: 'purple' }
  ]

  const providers = [
    'Hemlata metsl',
    'Dr. John Smith',
    'Dr. Sarah Johnson',
    'Dr. Michael Brown'
  ]

  const locations = [
    'Select Location',
    'Chennai',
    'Mumbai',
    'Delhi',
    'Virtual'
  ]

  useEffect(() => {
    // If we have initial availability data from slot creation, use it
    if (initialAvailabilityData) {
      const formattedData = availabilityService.formatAvailabilityForCalendar(initialAvailabilityData)
      setAvailabilityData(formattedData)
    } else {
      // Load availability data from API only once when component mounts
      loadAvailabilityData()
    }
  }, [initialAvailabilityData]) // Add initialAvailabilityData as dependency

  const loadAvailabilityData = async () => {
    setIsLoading(true)
    try {
      // Get provider ID from selected provider name
      const providerId = getProviderId(selectedProvider)
      
      if (providerId) {
        const result = await availabilityService.getProviderAvailability(providerId)
        
        if (result.success) {
          // Format the data for the calendar
          const formattedData = availabilityService.formatAvailabilityForCalendar(result.data)
          setAvailabilityData(formattedData)
        } else {
          console.error('Failed to load availability:', result.error)
          // Fallback to sample data
          setAvailabilityData(sampleAvailability)
        }
      } else {
        // Fallback to sample data if provider ID not found
        setAvailabilityData(sampleAvailability)
      }
    } catch (error) {
      console.error('Error loading availability:', error)
      // Fallback to sample data
      setAvailabilityData(sampleAvailability)
    } finally {
      setIsLoading(false)
    }
  }

  const getProviderId = (providerName) => {
    // This is a simple mapping - in a real app, you'd get this from the API
    const providerMap = {
      'Hemlata metsl': '1',
      'Dr. John Smith': '2',
      'Dr. Sarah Johnson': '3',
      'Dr. Michael Brown': '4'
    }
    return providerMap[providerName]
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getAvailabilityForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return availabilityData.find(avail => avail.date === dateStr)
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth() && 
           date.getFullYear() === currentDate.getFullYear()
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const renderCalendarGrid = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const availability = getAvailabilityForDate(date)
      const isCurrentDay = isToday(date)
      const isCurrentMonthDay = isCurrentMonth(date)
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isCurrentDay ? 'today' : ''} ${isCurrentMonthDay ? 'current-month' : ''}`}
        >
          <div className="day-number">{day}</div>
          {availability && (
            <div className={`availability-block ${availability.color}`}>
              <div className="availability-location">{availability.location}</div>
              <div className="availability-time">
                {availability.type === 'virtual' && <Video size={12} />}
                {availability.startTime} - {availability.endTime}
              </div>
            </div>
          )}
        </div>
      )
    }
    
    return days
  }

  return (
    <div className="availability-calendar-container">
      {/* Header */}
      <div className="calendar-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="calendar-title">Appointment Settings</h1>
        </div>
        <div className="header-actions">
          <button className="edit-button" onClick={onEditAvailability}>
            <Edit3 size={16} />
            Edit Availability
          </button>
          <button className="add-button" onClick={onAddAvailability}>
            <Plus size={16} />
            Add Availability
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="calendar-tabs">
        <button 
          className={`tab-button ${activeTab === 'availability' ? 'active' : ''}`}
          onClick={() => setActiveTab('availability')}
        >
          Availability
        </button>
        <button 
          className={`tab-button ${activeTab === 'color-configuration' ? 'active' : ''}`}
          onClick={() => setActiveTab('color-configuration')}
        >
          Color Configuration
        </button>
      </div>

      {/* Controls */}
      <div className="calendar-controls">
        <div className="control-group">
          <button className="today-button" onClick={goToToday}>
            Today
          </button>
          <div className="navigation-controls">
            <button className="nav-button" onClick={() => navigateMonth(-1)}>
              <ChevronLeft size={16} />
            </button>
            <button className="nav-button" onClick={() => navigateMonth(1)}>
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="date-display">
            <Calendar className="calendar-icon" />
            <span>{formatDate(currentDate)}</span>
          </div>
        </div>
        
        <div className="filter-controls">
          <div className="select-wrapper">
            <User className="input-icon" />
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="form-select"
            >
              {providers.map(provider => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
          </div>
          
          <div className="select-wrapper">
            <MapPin className="input-icon" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="form-select"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-container">
        {isLoading ? (
          <div className="calendar-loading">
            <div className="spinner"></div>
            <p>Loading availability...</p>
          </div>
        ) : (
          <>
            {/* Days of Week Header */}
            <div className="calendar-header-row">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="day-header">{day}</div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="calendar-grid">
              {renderCalendarGrid()}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AvailabilityCalendar 