import { useState, useRef, useEffect } from 'react'
import { 
  Eye, EyeOff, Mail, Phone, Lock, Stethoscope, User, AlertCircle, CheckCircle,
  Camera, MapPin, Building, GraduationCap, Award, FileText, Upload, X
} from 'lucide-react'
import { getApiUrl, API_ENDPOINTS } from '../config/api'

function RegistrationPage({ onSwitchToLogin, onRegistrationSuccess }) {
  // Debug: Check if API configuration is loaded
  console.log('API Configuration loaded:', {
    baseUrl: 'http://192.168.1.116:4000',
    endpoint: API_ENDPOINTS.PROVIDER_REGISTRATION,
    fullUrl: getApiUrl(API_ENDPOINTS.PROVIDER_REGISTRATION)
  })
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    specialization: '',
    yearsExperience: '',
    degree: '',
    clinicName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    practiceType: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSuccess, setIsSuccess] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileInputRef = useRef(null)

  // Test API connection on component mount
  useEffect(() => {
    testApiConnection()
  }, [])

  const specializations = [
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Internal Medicine',
    'Orthopedics',
    'Neurology',
    'Psychiatry',
    'Oncology',
    'Emergency Medicine',
    'Family Medicine',
    'Obstetrics & Gynecology',
    'Radiology',
    'Anesthesiology',
    'Pathology',
    'General Surgery',
    'Other'
  ]

  const practiceTypes = [
    'Private Practice',
    'Hospital',
    'Clinic',
    'Urgent Care',
    'Academic Medical Center',
    'Government Facility',
    'Other'
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, photo: 'File size must be less than 5MB' }))
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: 'Please select a valid image file' }))
        return
      }
      
      setProfilePhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
      setErrors(prev => ({ ...prev, photo: '' }))
    }
  }

  const removePhoto = () => {
    setProfilePhoto(null)
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Personal Information
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      const cleanPhone = formData.phone.replace(/[\s\-()]/g, '')
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = 'Please enter a valid phone number'
      }
    }
    
    // Professional Information
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'Medical license number is required'
    }
    
    if (!formData.specialization) {
      newErrors.specialization = 'Specialization is required'
    }
    
    if (!formData.yearsExperience) {
      newErrors.yearsExperience = 'Years of experience is required'
    } else if (parseInt(formData.yearsExperience) < 0 || parseInt(formData.yearsExperience) > 50) {
      newErrors.yearsExperience = 'Please enter a valid number of years (0-50)'
    }
    
    // Degree is optional for API but we'll keep it required in UI for now
    if (!formData.degree.trim()) {
      newErrors.degree = 'Medical degree/qualifications are required'
    }
    
    // Practice Information
    // Clinic name is optional for API but we'll keep it required in UI for now
    if (!formData.clinicName.trim()) {
      newErrors.clinicName = 'Clinic/hospital name is required'
    }
    
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Street address is required'
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required'
    } else {
      // More flexible ZIP code validation - accepts 5 digits or 5+4 format
      const zipRegex = /^\d{5}(-\d{4})?$/
      const cleanZip = formData.zipCode.replace(/\s/g, '') // Remove spaces
      if (!zipRegex.test(cleanZip)) {
        newErrors.zipCode = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'
      }
    }
    
    if (!formData.practiceType) {
      newErrors.practiceType = 'Practice type is required'
    }
    
    // Security
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#059669']
    
    return {
      strength: Math.min(strength, 5),
      label: labels[Math.min(strength - 1, 4)],
      color: colors[Math.min(strength - 1, 4)]
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submitted')
    
    const isValid = validateForm()
    console.log('Form validation result:', isValid)
    
    if (!isValid) {
      console.log('Form validation failed, errors:', errors)
      return
    }
    
    setIsLoading(true)
    
    // Prepare data for API
    const apiData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: cleanPhoneNumber(formData.phone),
      password: formData.password,
      confirm_password: formData.confirmPassword,
      specialization: formData.specialization,
      license_number: formData.licenseNumber,
      years_of_experience: parseInt(formData.yearsExperience),
      clinic_address: {
        street: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        zip: cleanZipCode(formData.zipCode)
      },
      // Optional fields that might be supported by the API
      degree: formData.degree || undefined,
      clinic_name: formData.clinicName || undefined,
      practice_type: formData.practiceType || undefined,
      is_verified: false
    }
    
    // Log the data being sent (for debugging)
    console.log('Sending registration data:', apiData)
    console.log('API URL:', getApiUrl(API_ENDPOINTS.PROVIDER_REGISTRATION))
    
    try {
      console.log('Making API request...')
      const response = await fetch(getApiUrl(API_ENDPOINTS.PROVIDER_REGISTRATION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        body: JSON.stringify(apiData)
      })
      console.log('API response received:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        let errorMessage = errorData.message || `HTTP error! status: ${response.status}`
        
        // Handle specific error cases
        if (response.status === 409) {
          errorMessage = 'An account with this email already exists.'
        } else if (response.status === 400) {
          errorMessage = errorData.message || 'Please check your input and try again.'
        } else if (response.status === 422) {
          errorMessage = 'Please check your input and try again.'
        }
        
        throw new Error(errorMessage)
      }
      
      const result = await response.json()
      setIsSuccess(true)
      
      // Call success callback if provided
      if (onRegistrationSuccess) {
        onRegistrationSuccess(result)
      }
      
      // Show success message and redirect
      setTimeout(() => {
        alert('Registration successful! Please check your email for verification.')
        // In a real app, you would redirect here
        // window.location.href = '/login'
      }, 2000)
      
    } catch (error) {
      console.error('Registration error:', error)
      let errorMessage = 'Registration failed. Please try again.'
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  // Helper function to clean phone number
  const cleanPhoneNumber = (phone) => {
    return phone.replace(/[\s\-()]/g, '')
  }

  // Helper function to clean ZIP code
  const cleanZipCode = (zip) => {
    return zip.replace(/\s/g, '') // Remove spaces only, keep dashes
  }

  // Test API connectivity
  const testApiConnection = async () => {
    try {
      console.log('Testing API connection...')
      const response = await fetch(getApiUrl('/api/health'), {
        method: 'GET',
        mode: 'cors'
      })
      console.log('API health check response:', response.status)
    } catch (error) {
      console.log('API health check failed:', error.message)
    }
  }

  // Test API call with sample data
  const testApiCall = async () => {
    const testData = {
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      phone_number: "+1234567890",
      password: "TestPassword123!",
      confirm_password: "TestPassword123!",
      specialization: "Cardiology",
      license_number: "TEST123456",
      years_of_experience: 5,
      clinic_address: {
        street: "123 Test St",
        city: "Test City",
        state: "TS",
        zip: "12345"
      },
      is_verified: false
    }
    
    console.log('Testing API call with sample data:', testData)
    
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.PROVIDER_REGISTRATION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        body: JSON.stringify(testData)
      })
      console.log('Test API response:', response.status, response.statusText)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Test API success:', result)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.log('Test API error:', errorData)
      }
    } catch (error) {
      console.log('Test API call failed:', error.message)
    }
  }

  return (
    <div className="registration-container">
      {/* Background with medical theme */}
      <div className="background-pattern"></div>
      
      {/* Main Registration Card */}
      <div className="registration-card">
        {/* Header Section */}
        <div className="registration-header">
          <div className="logo-section">
            <div className="logo-icon">
              <Stethoscope size={32} />
            </div>
            <h1 className="app-title">Sample EMR</h1>
          </div>
          <h2 className="registration-title">Provider Registration</h2>
          <p className="registration-subtitle">Join our healthcare network and start managing your practice</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="registration-form">
          {/* Personal Information Section */}
          <div className="form-section">
            <h3 className="section-title">
              <User size={20} />
              Personal Information
            </h3>
            
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="firstName" className="input-label">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.firstName}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="lastName" className="input-label">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.lastName}
                  </div>
                )}
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="email" className="input-label">Email Address *</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="phone" className="input-label">Phone Number *</label>
                <div className="input-wrapper">
                  <Phone className="input-icon" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    autoComplete="tel"
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Photo Upload */}
            <div className="input-group">
              <label className="input-label">Profile Photo</label>
              <div className="photo-upload-area">
                {photoPreview ? (
                  <div className="photo-preview">
                    <img src={photoPreview} alt="Profile preview" />
                    <button
                      type="button"
                      className="remove-photo"
                      onClick={removePhoto}
                      disabled={isLoading}
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="upload-zone"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={32} />
                    <p>Click to upload or drag and drop</p>
                    <span>PNG, JPG up to 5MB</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden-input"
                  disabled={isLoading}
                />
              </div>
              {errors.photo && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.photo}
                </div>
              )}
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="form-section">
            <h3 className="section-title">
              <Award size={20} />
              Professional Information
            </h3>
            
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="licenseNumber" className="input-label">Medical License Number *</label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your medical license number"
                  className={`form-input ${errors.licenseNumber ? 'error' : ''}`}
                  disabled={isLoading}
                />
                {errors.licenseNumber && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.licenseNumber}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="specialization" className="input-label">Specialization *</label>
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className={`form-input ${errors.specialization ? 'error' : ''}`}
                  disabled={isLoading}
                >
                  <option value="">Select specialization</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                {errors.specialization && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.specialization}
                  </div>
                )}
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="yearsExperience" className="input-label">Years of Experience *</label>
                <input
                  type="number"
                  id="yearsExperience"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleInputChange}
                  placeholder="Enter years of experience"
                  min="0"
                  max="50"
                  className={`form-input ${errors.yearsExperience ? 'error' : ''}`}
                  disabled={isLoading}
                />
                {errors.yearsExperience && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.yearsExperience}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="degree" className="input-label">Medical Degree/Qualifications *</label>
                <div className="input-wrapper">
                  <GraduationCap className="input-icon" />
                  <input
                    type="text"
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    placeholder="e.g., MD, DO, MBBS"
                    className={`form-input ${errors.degree ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.degree && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.degree}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Practice Information Section */}
          <div className="form-section">
            <h3 className="section-title">
              <Building size={20} />
              Practice Information
            </h3>
            
            <div className="input-group">
              <label htmlFor="clinicName" className="input-label">Clinic/Hospital Name *</label>
              <input
                type="text"
                id="clinicName"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleInputChange}
                placeholder="Enter clinic or hospital name"
                className={`form-input ${errors.clinicName ? 'error' : ''}`}
                disabled={isLoading}
              />
              {errors.clinicName && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.clinicName}
                </div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="streetAddress" className="input-label">Street Address *</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" />
                <input
                  type="text"
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  placeholder="Enter street address"
                  className={`form-input ${errors.streetAddress ? 'error' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.streetAddress && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.streetAddress}
                </div>
              )}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="city" className="input-label">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  className={`form-input ${errors.city ? 'error' : ''}`}
                  disabled={isLoading}
                />
                {errors.city && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.city}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="state" className="input-label">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                  className={`form-input ${errors.state ? 'error' : ''}`}
                  disabled={isLoading}
                />
                {errors.state && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.state}
                  </div>
                )}
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="zipCode" className="input-label">ZIP Code *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="Enter ZIP code"
                  className={`form-input ${errors.zipCode ? 'error' : ''}`}
                  disabled={isLoading}
                />
                {errors.zipCode && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.zipCode}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="practiceType" className="input-label">Practice Type *</label>
                <select
                  id="practiceType"
                  name="practiceType"
                  value={formData.practiceType}
                  onChange={handleInputChange}
                  className={`form-input ${errors.practiceType ? 'error' : ''}`}
                  disabled={isLoading}
                >
                  <option value="">Select practice type</option>
                  {practiceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.practiceType && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.practiceType}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Security Section */}
          <div className="form-section">
            <h3 className="section-title">
              <Lock size={20} />
              Account Security
            </h3>
            
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="password" className="input-label">Password *</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill" 
                        style={{ 
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      ></div>
                    </div>
                    <span className="strength-label" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
                {errors.password && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword" className="input-label">Confirm Password *</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="form-section">
            <label className="checkbox-label terms-checkbox">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                disabled={isLoading}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              I agree to the{' '}
              <a href="#" className="terms-link" onClick={(e) => e.preventDefault()}>
                Terms and Conditions
              </a>
              {' '}and{' '}
              <a href="#" className="terms-link" onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </a>
            </label>
            {errors.termsAccepted && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.termsAccepted}
              </div>
            )}
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="error-message general-error">
              <AlertCircle size={16} />
              {errors.general}
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="success-message">
              <CheckCircle size={16} />
              Registration successful! Please check your email for verification.
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`registration-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Test API Button - Remove this in production */}
          <button
            type="button"
            onClick={testApiCall}
            className="test-api-button"
            style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test API Call
          </button>
        </form>

        {/* Footer Links */}
        <div className="registration-footer">
          <p className="footer-text">
            Already have an account?{' '}
            <button 
              type="button" 
              className="footer-link-button" 
              onClick={onSwitchToLogin}
            >
              Sign In
            </button>
          </p>
          <div className="footer-links">
            <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>
              Support
            </a>
            <span className="footer-separator">•</span>
            <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>
              Privacy Policy
            </a>
            <span className="footer-separator">•</span>
            <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistrationPage 
