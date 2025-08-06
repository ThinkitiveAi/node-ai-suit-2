import { useState } from 'react'
import { 
  ArrowLeft, 
  Save, 
  X, 
  Calendar, 
  Clock, 
  MapPin,
  DollarSign,
  Tag,
  Settings,
  AlertCircle,
  CheckCircle,
  Video,
  Building
} from 'lucide-react'
import { availabilityService } from '../config/api'

function SlotCreationForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    providerId: 1,
    bookingWindow: 30,
    timeZone: 'UTC+05:30',
    newAppointmentTime: 60,
    followUpAppointmentTime: 30,
    bufferTime: 15,
    availabilitySlots: [
      {
        day: 'Monday',
        startTime: '09:00',
        endTime: '17:00',
        virtual: false
      }
    ],
    blockDays: [],
    minimumSchedulingThreshold: 24,
    minimumSchedulingThresholdDescription: 'Minimum 24 hours notice required'
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ]

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ]

  const timezones = [
    'UTC+05:30', 'UTC+00:00', 'UTC-05:00', 'UTC-08:00', 'UTC+01:00', 'UTC+02:00'
  ]

  const appointmentTypes = [
    { id: 'consultation', name: 'Consultation' },
    { id: 'follow-up', name: 'Follow-up' },
    { id: 'emergency', name: 'Emergency' },
    { id: 'routine', name: 'Routine Check' }
  ]

  const tags = [
    'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...formData.availabilitySlots]
    updatedSlots[index] = {
      ...updatedSlots[index],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      availabilitySlots: updatedSlots
    }))
  }

  const addSlot = () => {
    const newSlot = {
      day: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
      virtual: false
    }
    setFormData(prev => ({
      ...prev,
      availabilitySlots: [...prev.availabilitySlots, newSlot]
    }))
  }

  const removeSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      availabilitySlots: prev.availabilitySlots.filter((_, i) => i !== index)
    }))
  }

  const addBlockDay = () => {
    const newBlockDay = {
      blockDaysDate: new Date().toISOString(),
      fullDayBlock: false,
      blockDaysStartTime: '09:00',
      blockDaysEndTime: '17:00'
    }
    setFormData(prev => ({
      ...prev,
      blockDays: [...prev.blockDays, newBlockDay]
    }))
  }

  const removeBlockDay = (index) => {
    setFormData(prev => ({
      ...prev,
      blockDays: prev.blockDays.filter((_, i) => i !== index)
    }))
  }

  const handleBlockDayChange = (index, field, value) => {
    const updatedBlockDays = [...formData.blockDays]
    updatedBlockDays[index] = {
      ...updatedBlockDays[index],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      blockDays: updatedBlockDays
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    // Validate provider ID
    if (!formData.providerId || formData.providerId <= 0) {
      newErrors.providerId = 'Provider ID is required'
    }

    // Validate timezone
    if (!formData.timeZone) {
      newErrors.timeZone = 'Timezone is required'
    }

    // Validate availability slots
    if (formData.availabilitySlots.length === 0) {
      newErrors.availabilitySlots = 'At least one availability slot is required'
    }

    // Validate each slot
    formData.availabilitySlots.forEach((slot, index) => {
      if (!slot.day) {
        newErrors[`slot${index}Day`] = 'Day is required'
      }
      if (!slot.startTime) {
        newErrors[`slot${index}StartTime`] = 'Start time is required'
      }
      if (!slot.endTime) {
        newErrors[`slot${index}EndTime`] = 'End time is required'
      }
      if (slot.startTime >= slot.endTime) {
        newErrors[`slot${index}Time`] = 'End time must be after start time'
      }
    })

    // Validate block days
    formData.blockDays.forEach((block, index) => {
      if (!block.blockDaysDate) {
        newErrors[`block${index}Date`] = 'Date is required'
      }
      if (!block.fullDayBlock && (!block.blockDaysStartTime || !block.blockDaysEndTime)) {
        newErrors[`block${index}Time`] = 'Start and end times are required for partial blocks'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    console.log('📝 Raw form data being submitted:', JSON.stringify(formData, null, 2))
    setIsSubmitting(true)
    
    try {
      const result = await availabilityService.createAvailability(formData)
      
      if (result.success) {
        console.log('✅ Availability created successfully:', result.data)
        onSave(result.data)
      } else {
        console.error('❌ Failed to create availability:', result.error)
        
        // Handle specific error types
        let errorMessage = result.error
        if (result.error.includes('Foreign key constraint violated')) {
          errorMessage = 'Unable to create availability due to existing data conflicts. Please try again or contact your administrator.'
        } else if (result.error.includes('Bad Request')) {
          errorMessage = 'Invalid data provided. Please check your inputs and try again.'
        }
        
        setErrors({ general: errorMessage })
      }
    } catch (error) {
      console.error('❌ Error creating availability:', error)
      setErrors({ general: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="slot-creation-form">
      {/* Header with Back Navigation */}
      <div className="form-header">
        <div className="header-left">
          <button className="back-button" onClick={onCancel}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2>Create Availability</h2>
            <p>Set up your availability schedule and preferences</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="slot-form">
        {/* Basic Settings */}
        <div className="form-section">
          <div className="section-title">
            <Settings size={20} />
            Basic Settings
          </div>
          
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Provider ID</label>
              <input
                type="number"
                value={formData.providerId}
                onChange={(e) => handleInputChange('providerId', parseInt(e.target.value))}
                className={`form-input ${errors.providerId ? 'error' : ''}`}
                placeholder="Enter provider ID"
              />
              {errors.providerId && <div className="error-message">{errors.providerId}</div>}
            </div>

            <div className="input-group">
              <label className="input-label">Timezone</label>
              <div className="select-wrapper">
                <Settings className="input-icon" />
                <select
                  value={formData.timeZone}
                  onChange={(e) => handleInputChange('timeZone', e.target.value)}
                  className={`form-select ${errors.timeZone ? 'error' : ''}`}
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
              {errors.timeZone && <div className="error-message">{errors.timeZone}</div>}
            </div>

            <div className="input-group">
              <label className="input-label">Booking Window (days)</label>
              <input
                type="number"
                value={formData.bookingWindow}
                onChange={(e) => handleInputChange('bookingWindow', parseInt(e.target.value))}
                className="form-input"
                placeholder="30"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Buffer Time (minutes)</label>
              <input
                type="number"
                value={formData.bufferTime}
                onChange={(e) => handleInputChange('bufferTime', parseInt(e.target.value))}
                className="form-input"
                placeholder="15"
              />
            </div>

            <div className="input-group">
              <label className="input-label">New Appointment Time (minutes)</label>
              <input
                type="number"
                value={formData.newAppointmentTime}
                onChange={(e) => handleInputChange('newAppointmentTime', parseInt(e.target.value))}
                className="form-input"
                placeholder="60"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Follow-up Appointment Time (minutes)</label>
              <input
                type="number"
                value={formData.followUpAppointmentTime}
                onChange={(e) => handleInputChange('followUpAppointmentTime', parseInt(e.target.value))}
                className="form-input"
                placeholder="30"
              />
            </div>
          </div>
        </div>

        {/* Availability Slots */}
        <div className="form-section">
          <div className="section-title">
            <Calendar size={20} />
            Availability Slots
          </div>
          
          {formData.availabilitySlots.map((slot, index) => (
            <div key={index} className="slot-row">
              <div className="slot-day">
                <label className="input-label">Day</label>
                <select
                  value={slot.day}
                  onChange={(e) => handleSlotChange(index, 'day', e.target.value)}
                  className={`form-select ${errors[`slot${index}Day`] ? 'error' : ''}`}
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                {errors[`slot${index}Day`] && <div className="error-message">{errors[`slot${index}Day`]}</div>}
              </div>

              <div className="slot-time">
                <label className="input-label">Start Time</label>
                <select
                  value={slot.startTime}
                  onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)}
                  className={`form-select ${errors[`slot${index}StartTime`] ? 'error' : ''}`}
                >
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors[`slot${index}StartTime`] && <div className="error-message">{errors[`slot${index}StartTime`]}</div>}
              </div>

              <div className="slot-time">
                <label className="input-label">End Time</label>
                <select
                  value={slot.endTime}
                  onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)}
                  className={`form-select ${errors[`slot${index}EndTime`] ? 'error' : ''}`}
                >
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors[`slot${index}EndTime`] && <div className="error-message">{errors[`slot${index}EndTime`]}</div>}
              </div>

              <div className="slot-virtual">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={slot.virtual}
                    onChange={(e) => handleSlotChange(index, 'virtual', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  Virtual Appointment
                </label>
              </div>

              <button
                type="button"
                onClick={() => removeSlot(index)}
                className="remove-button"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          {errors[`slot${0}Time`] && <div className="error-message">{errors[`slot${0}Time`]}</div>}
          
          <button type="button" onClick={addSlot} className="add-button">
            <Calendar size={16} />
            Add Slot
          </button>
        </div>

        {/* Block Days */}
        <div className="form-section">
          <div className="section-title">
            <AlertCircle size={20} />
            Block Days
          </div>
          
          {formData.blockDays.map((block, index) => (
            <div key={index} className="block-day-row">
              <div className="block-date">
                <label className="input-label">Date</label>
                <input
                  type="date"
                  value={block.blockDaysDate.split('T')[0]}
                  onChange={(e) => handleBlockDayChange(index, 'blockDaysDate', new Date(e.target.value).toISOString())}
                  className={`form-input ${errors[`block${index}Date`] ? 'error' : ''}`}
                />
                {errors[`block${index}Date`] && <div className="error-message">{errors[`block${index}Date`]}</div>}
              </div>

              <div className="block-full-day">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={block.fullDayBlock}
                    onChange={(e) => handleBlockDayChange(index, 'fullDayBlock', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  Full Day Block
                </label>
              </div>

              {!block.fullDayBlock && (
                <>
                  <div className="block-time">
                    <label className="input-label">Start Time</label>
                    <select
                      value={block.blockDaysStartTime}
                      onChange={(e) => handleBlockDayChange(index, 'blockDaysStartTime', e.target.value)}
                      className="form-select"
                    >
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div className="block-time">
                    <label className="input-label">End Time</label>
                    <select
                      value={block.blockDaysEndTime}
                      onChange={(e) => handleBlockDayChange(index, 'blockDaysEndTime', e.target.value)}
                      className="form-select"
                    >
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => removeBlockDay(index)}
                className="remove-button"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          {errors[`block${0}Time`] && <div className="error-message">{errors[`block${0}Time`]}</div>}
          
          <button type="button" onClick={addBlockDay} className="add-button">
            <AlertCircle size={16} />
            Add Block Day
          </button>
        </div>

        {/* Scheduling Threshold */}
        <div className="form-section">
          <div className="section-title">
            <Clock size={20} />
            Scheduling Preferences
          </div>
          
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Minimum Scheduling Threshold (hours)</label>
              <input
                type="number"
                value={formData.minimumSchedulingThreshold}
                onChange={(e) => handleInputChange('minimumSchedulingThreshold', parseInt(e.target.value))}
                className="form-input"
                placeholder="24"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Threshold Description</label>
              <input
                type="text"
                value={formData.minimumSchedulingThresholdDescription}
                onChange={(e) => handleInputChange('minimumSchedulingThresholdDescription', e.target.value)}
                className="form-input"
                placeholder="Minimum 24 hours notice required"
              />
            </div>
          </div>
        </div>

        {errors.general && (
          <div className="general-error">
            <AlertCircle size={16} />
            <div className="error-content">
              <span>{errors.general}</span>
              <button 
                type="button" 
                onClick={handleSubmit}
                className="retry-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Retrying...' : 'Retry'}
              </button>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button">
            <X size={16} />
            Cancel
          </button>
          <button type="submit" className="save-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Creating...
              </>
            ) : (
              <>
                <Save size={16} />
                Create Availability
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SlotCreationForm 