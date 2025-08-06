// API Configuration
export const API_BASE_URL = 'http://192.168.1.116:4000'

export const API_ENDPOINTS = {
  PROVIDER_REGISTRATION: '/api/provider',
  LOGIN: '/api/auth/login',
  AVAILABILITY: '/api/availability',
  AVAILABILITY_PROVIDER: '/api/availability/provider',
  // Add more endpoints as needed
}

// Helper function to get full API URL
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`

// Auth Service
export const authService = {
  async login(email, password) {
    const url = getApiUrl(API_ENDPOINTS.LOGIN)
    const requestBody = { email, password }
    
    console.log('🚀 Making login API call to:', url)
    console.log('📤 Request body:', requestBody)
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
        mode: 'cors',
        credentials: 'include',
      })

      console.log('📥 Response status:', response.status)
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()))

      // Get the response text first to debug
      const responseText = await response.text()
      console.log('📥 Response text:', responseText)

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        
        // Try to parse error response as JSON
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText)
            errorMessage = errorData.message || errorData.error || errorMessage
          } catch (e) {
            console.warn('Could not parse error response as JSON:', e)
            errorMessage = responseText || errorMessage
          }
        }
        
        throw new Error(errorMessage)
      }

      // Parse successful response
      let data = {}
      if (responseText) {
        try {
          data = JSON.parse(responseText)
          console.log('✅ API Success:', data)
        } catch (e) {
          console.warn('Could not parse success response as JSON:', e)
          // If response is empty or not JSON, create a default success response
          data = {
            message: 'Login successful',
            user: { email: email, name: email.split('@')[0] }
          }
        }
      } else {
        // Empty response - create default success response
        data = {
          message: 'Login successful',
          user: { email: email, name: email.split('@')[0] }
        }
      }
      
      return {
        success: true,
        data,
        token: data.token || data.accessToken || 'dummy-token',
        user: data.user || data
      }
    } catch (error) {
      console.error('❌ Login error:', error)
      return {
        success: false,
        error: error.message || 'Login failed. Please try again.'
      }
    }
  },

  // Store authentication data
  setAuthData(token, user) {
    localStorage.setItem('authToken', token)
    localStorage.setItem('userData', JSON.stringify(user))
  },

  // Get stored authentication data
  getAuthData() {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    return {
      token,
      user: userData ? JSON.parse(userData) : null
    }
  },

  // Clear authentication data
  clearAuthData() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  }
}

// Availability Service
export const availabilityService = {
  async createAvailability(availabilityData) {
    const url = getApiUrl(API_ENDPOINTS.AVAILABILITY)
    
    // Format the data according to the API schema
    const formattedData = this.formatAvailabilityForAPI(availabilityData)
    
    console.log('🚀 Creating availability:', url)
    console.log('📤 Request body:', formattedData)
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formattedData),
        mode: 'cors',
        credentials: 'include',
      })

      console.log('📥 Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', errorText)
        
        // Try to parse the error response
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = JSON.parse(errorText)
          if (errorData.message) {
            errorMessage = errorData.message
          }
          if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch (e) {
          console.warn('Could not parse error response as JSON:', e)
        }
        
        // Handle specific foreign key constraint error
        if (errorMessage.includes('Foreign key constraint violated')) {
          errorMessage = 'Cannot create availability: Related data exists. Please try again or contact support.'
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('✅ Availability created:', data)
      
      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('❌ Create availability error:', error)
      return {
        success: false,
        error: error.message || 'Failed to create availability. Please try again.'
      }
    }
  },

  async getProviderAvailability(providerId) {
    const url = getApiUrl(`${API_ENDPOINTS.AVAILABILITY_PROVIDER}/${providerId}`)
    
    console.log('🚀 Fetching provider availability:', url)
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
      })

      console.log('📥 Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Provider availability:', data)
      
      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('❌ Get availability error:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch availability. Please try again.'
      }
    }
  },

  // Helper function to format availability data for the API
  formatAvailabilityForAPI(formData) {
    const {
      providerId = 1,
      bookingWindow = 30,
      timeZone = 'UTC+05:30',
      newAppointmentTime = 60,
      followUpAppointmentTime = 30,
      bufferTime = 15,
      availabilitySlots = [],
      blockDays = [],
      minimumSchedulingThreshold = 24,
      minimumSchedulingThresholdDescription = 'Minimum 24 hours notice required'
    } = formData

    // Validate required fields
    if (!providerId || providerId <= 0) {
      throw new Error('Provider ID is required and must be greater than 0')
    }

    if (!timeZone) {
      throw new Error('Timezone is required')
    }

    if (!availabilitySlots || availabilitySlots.length === 0) {
      throw new Error('At least one availability slot is required')
    }

    // Validate each slot
    availabilitySlots.forEach((slot, index) => {
      if (!slot.day) {
        throw new Error(`Day is required for slot ${index + 1}`)
      }
      if (!slot.startTime) {
        throw new Error(`Start time is required for slot ${index + 1}`)
      }
      if (!slot.endTime) {
        throw new Error(`End time is required for slot ${index + 1}`)
      }
      
      // Validate time format (HH:mm)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeRegex.test(slot.startTime)) {
        throw new Error(`Invalid start time format for slot ${index + 1}. Use HH:mm format (e.g., 09:00)`)
      }
      if (!timeRegex.test(slot.endTime)) {
        throw new Error(`Invalid end time format for slot ${index + 1}. Use HH:mm format (e.g., 17:00)`)
      }
      
      if (slot.startTime >= slot.endTime) {
        throw new Error(`End time must be after start time for slot ${index + 1}`)
      }
    })

    const formattedData = {
      providerId: parseInt(providerId),
      bookingWindow: parseInt(bookingWindow),
      timeZone,
      newAppointmentTime: parseInt(newAppointmentTime),
      followUpAppointmentTime: parseInt(followUpAppointmentTime),
      bufferTime: parseInt(bufferTime),
      availabilitySlots: availabilitySlots.map(slot => ({
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        virtual: slot.virtual || false
      })),
      blockDays: blockDays.map(block => ({
        blockDaysDate: block.blockDaysDate || new Date().toISOString(),
        fullDayBlock: block.fullDayBlock || false,
        blockDaysStartTime: block.blockDaysStartTime || '09:00',
        blockDaysEndTime: block.blockDaysEndTime || '17:00'
      })),
      minimumSchedulingThreshold: parseInt(minimumSchedulingThreshold),
      minimumSchedulingThresholdDescription
    }

    console.log('🔧 Formatted data for API:', JSON.stringify(formattedData, null, 2))
    return formattedData
  },

  // Helper function to format availability data for the calendar
  formatAvailabilityForCalendar(availabilityData) {
    // If the API returns the full availability object, extract the slots
    const slots = availabilityData.availabilitySlots || availabilityData
    
    return slots.map(slot => ({
      date: this.getDateForDay(slot.day),
      type: slot.virtual ? 'virtual' : 'in-person',
      location: slot.availabilityLocationId || 'Unknown',
      startTime: slot.startTime,
      endTime: slot.endTime,
      color: this.getColorForType(slot.virtual ? 'virtual' : 'in-person')
    }))
  },

  // Helper function to get a sample date for a given day of the week
  getDateForDay(day) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayIndex = days.indexOf(day)
    if (dayIndex === -1) return new Date().toISOString().split('T')[0]
    
    const today = new Date()
    const currentDay = today.getDay()
    const daysToAdd = (dayIndex - currentDay + 7) % 7
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + daysToAdd)
    
    return targetDate.toISOString().split('T')[0]
  },

  // Helper function to get color based on availability type
  getColorForType(type) {
    switch (type) {
      case 'virtual':
        return 'yellow'
      case 'blocked':
        return 'red'
      case 'in-person':
      default:
        return 'purple'
    }
  }
} 
