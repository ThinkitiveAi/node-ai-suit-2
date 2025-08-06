import { useState } from 'react'
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  DollarSign,
  Tag,
  Settings,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

function AvailabilitySettings({ onBack }) {
  const [activeTab, setActiveTab] = useState('availability')
  const [selectedClinician, setSelectedClinician] = useState('John Doe')
  const [dateRange, setDateRange] = useState({
    startDate: '2025-06-19',
    endDate: '2025-06-25'
  })
  const [timezone, setTimezone] = useState('Select Time Zone')
  const [availabilitySlots, setAvailabilitySlots] = useState([
    { day: 'Monday', from: '09:00 AM', till: '06:00 PM', id: 1 },
    { day: 'Tuesday', from: '09:00 AM', till: '06:00 PM', id: 2 },
    { day: 'Wednesday', from: '09:00 AM', till: '06:00 PM', id: 3 },
    { day: 'Thursday', from: '09:00 AM', till: '06:00 PM', id: 4 },
    { day: 'Friday', from: '09:00 AM', till: '06:00 PM', id: 5 },
    { day: 'Saturday', from: '09:00 AM', till: '06:00 PM', id: 6 }
  ])
  const [blockDays, setBlockDays] = useState([
    { date: '', from: 'Select Start Time', till: 'Select End Time', id: 1 },
    { date: '', from: 'Select Start Time', till: 'Select End Time', id: 2 }
  ])

  const tabs = [
    'Availability', 'Profile', 'Forms', 'Fee Schedule', 'Group Settings', 'Agreements', 'Audit Logs'
  ]

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ]

  const timeSlots = [
    '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM',
    '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM',
    '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM',
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
    '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
  ]

  const timezones = [
    'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00',
    'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00',
    'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00',
    'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00'
  ]

  const addAvailabilitySlot = () => {
    const newSlot = {
      day: 'Monday',
      from: '09:00 AM',
      till: '06:00 PM',
      id: Date.now()
    }
    setAvailabilitySlots([...availabilitySlots, newSlot])
  }

  const removeAvailabilitySlot = (id) => {
    setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== id))
  }

  const updateAvailabilitySlot = (id, field, value) => {
    setAvailabilitySlots(availabilitySlots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ))
  }

  const addBlockDay = () => {
    const newBlockDay = {
      date: '',
      from: 'Select Start Time',
      till: 'Select End Time',
      id: Date.now()
    }
    setBlockDays([...blockDays, newBlockDay])
  }

  const removeBlockDay = (id) => {
    setBlockDays(blockDays.filter(block => block.id !== id))
  }

  const updateBlockDay = (id, field, value) => {
    setBlockDays(blockDays.map(block => 
      block.id === id ? { ...block, [field]: value } : block
    ))
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving availability settings...')
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    }
  }

  return (
    <div className="availability-settings-container">
      {/* Header */}
      <div className="settings-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="settings-title">Other Settings</h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="settings-content">
        <div className="content-grid">
          {/* Left Section - Day Wise Availability */}
          <div className="availability-section">
            <div className="section-header">
              <h2 className="section-title">Day Wise Availability</h2>
              <button className="add-button" onClick={addAvailabilitySlot}>
                <Plus size={16} />
                Add Availability
              </button>
            </div>

            {/* Clinician Selection */}
            <div className="input-group">
              <label className="input-label">Clinician</label>
              <div className="select-wrapper">
                <User className="input-icon" />
                <select
                  value={selectedClinician}
                  onChange={(e) => setSelectedClinician(e.target.value)}
                  className="form-select"
                >
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                  <option value="Dr. Johnson">Dr. Johnson</option>
                </select>
              </div>
            </div>

            {/* Date Range Selection */}
            <div className="input-group">
              <label className="input-label">Select Date Range</label>
              <div className="date-range-wrapper">
                <div className="date-input-wrapper">
                  <Calendar className="input-icon" />
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                    className="form-input"
                    placeholder="Start Date"
                  />
                </div>
                <span className="date-separator">to</span>
                <div className="date-input-wrapper">
                  <Calendar className="input-icon" />
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                    className="form-input"
                    placeholder="End Date"
                  />
                </div>
                <button className="icon-button">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Availability Slots */}
            <div className="slots-container">
              {availabilitySlots.map((slot) => (
                <div key={slot.id} className="slot-row">
                  <div className="slot-day">
                    <select
                      value={slot.day}
                      onChange={(e) => updateAvailabilitySlot(slot.id, 'day', e.target.value)}
                      className="form-select"
                    >
                      {daysOfWeek.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div className="slot-time">
                    <div className="time-input-wrapper">
                      <Clock className="input-icon" />
                      <select
                        value={slot.from}
                        onChange={(e) => updateAvailabilitySlot(slot.id, 'from', e.target.value)}
                        className="form-select"
                      >
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="slot-time">
                    <div className="time-input-wrapper">
                      <Clock className="input-icon" />
                      <select
                        value={slot.till}
                        onChange={(e) => updateAvailabilitySlot(slot.id, 'till', e.target.value)}
                        className="form-select"
                      >
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => removeAvailabilitySlot(slot.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              <button className="add-more-button" onClick={addAvailabilitySlot}>
                <Plus size={16} />
                Add More
              </button>
            </div>
          </div>

          {/* Right Section - Slot Creation Setting */}
          <div className="slot-settings-section">
            <h2 className="section-title">Slot Creation Setting</h2>

            {/* Timezone Selection */}
            <div className="input-group">
              <label className="input-label">Time Zone</label>
              <div className="select-wrapper">
                <Settings className="input-icon" />
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="form-select"
                >
                  <option value="Select Time Zone">Select Time Zone</option>
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Block Days */}
            <div className="block-days-section">
              <h3 className="subsection-title">Block Days</h3>
              {blockDays.map((block) => (
                <div key={block.id} className="block-day-row">
                  <div className="block-date">
                    <div className="date-input-wrapper">
                      <Calendar className="input-icon" />
                      <input
                        type="date"
                        value={block.date}
                        onChange={(e) => updateBlockDay(block.id, 'date', e.target.value)}
                        className="form-input"
                        placeholder="Select Date"
                      />
                    </div>
                  </div>
                  <div className="block-time">
                    <div className="time-input-wrapper">
                      <Clock className="input-icon" />
                      <select
                        value={block.from}
                        onChange={(e) => updateBlockDay(block.id, 'from', e.target.value)}
                        className="form-select"
                      >
                        <option value="Select Start Time">Select Start Time</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="block-time">
                    <div className="time-input-wrapper">
                      <Clock className="input-icon" />
                      <select
                        value={block.till}
                        onChange={(e) => updateBlockDay(block.id, 'till', e.target.value)}
                        className="form-select"
                      >
                        <option value="Select End Time">Select End Time</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => removeBlockDay(block.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              <button className="add-block-button" onClick={addBlockDay}>
                <Plus size={16} />
                Add Block Days
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="settings-actions">
        <button className="cancel-button" onClick={handleBack}>Cancel</button>
        <button className="save-button" onClick={handleSave}>Save</button>
      </div>
    </div>
  )
}

export default AvailabilitySettings 