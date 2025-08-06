import { useState } from 'react'
import { Eye, EyeOff, Mail, Phone, Lock, Heart, User, AlertCircle, CheckCircle, Shield } from 'lucide-react'

function PatientLoginPage({ onSwitchToProviderLogin }) {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSuccess, setIsSuccess] = useState(false)

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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Please enter your email or phone number'
    } else {
      // Check if it's an email or phone number
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      
      if (!emailRegex.test(formData.emailOrPhone) && !phoneRegex.test(formData.emailOrPhone.replace(/[\s\-()]/g, ''))) {
        newErrors.emailOrPhone = 'Please enter a valid email or phone number'
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Please enter your password'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSuccess(true)
      
      // Simulate redirect to patient dashboard
      setTimeout(() => {
        alert('Welcome back! Redirecting to your health portal...')
        // In a real app, you would redirect here
        // window.location.href = '/patient-dashboard'
      }, 1000)
      
    } catch {
      setErrors({ general: 'We couldn\'t sign you in. Please check your information and try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const getInputIcon = () => {
    const value = formData.emailOrPhone
    if (!value) return <Mail className="input-icon" />
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? <Mail className="input-icon" /> : <Phone className="input-icon" />
  }

  return (
    <div className="patient-login-container">
      {/* Calming background with healthcare theme */}
      <div className="patient-background-pattern"></div>
      
      {/* Main Patient Login Card */}
      <div className="patient-login-card">
        {/* Header Section */}
        <div className="patient-login-header">
          <div className="patient-logo-section">
            <div className="patient-logo-icon">
              <Heart size={32} />
            </div>
            <h1 className="patient-app-title">Sample EMR</h1>
          </div>
          <h2 className="patient-login-title">Welcome Back</h2>
          <p className="patient-login-subtitle">Access your health information securely and easily</p>
        </div>

        {/* Patient Login Form */}
        <form onSubmit={handleSubmit} className="patient-login-form">
          {/* Email/Phone Input */}
          <div className="patient-input-group">
            <label htmlFor="emailOrPhone" className="patient-input-label">
              Email or Phone Number
            </label>
            <div className="patient-input-wrapper">
              {getInputIcon()}
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleInputChange}
                placeholder="Enter your email or phone number"
                className={`patient-form-input ${errors.emailOrPhone ? 'error' : ''}`}
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            {errors.emailOrPhone && (
              <div className="patient-error-message">
                <AlertCircle size={16} />
                {errors.emailOrPhone}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="patient-input-group">
            <label htmlFor="password" className="patient-input-label">
              Password
            </label>
            <div className="patient-input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`patient-form-input ${errors.password ? 'error' : ''}`}
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="patient-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <div className="patient-error-message">
                <AlertCircle size={16} />
                {errors.password}
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="patient-form-options">
            <label className="patient-checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isLoading}
                className="patient-checkbox-input"
              />
              <span className="patient-checkbox-custom"></span>
              Keep me signed in
            </label>
            <a href="#" className="patient-forgot-password" onClick={(e) => e.preventDefault()}>
              Forgot Password?
            </a>
          </div>

          {/* Security Assurance */}
          <div className="patient-security-assurance">
            <Shield size={16} />
            <span>Your health information is protected with bank-level security</span>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="patient-error-message patient-general-error">
              <AlertCircle size={16} />
              {errors.general}
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="patient-success-message">
              <CheckCircle size={16} />
              Welcome back! Redirecting to your health portal...
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className={`patient-login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="patient-spinner"></div>
                Signing In...
              </>
            ) : (
              'Sign In to My Health Portal'
            )}
          </button>
        </form>

        {/* Help Section */}
        <div className="patient-help-section">
          <h3 className="patient-help-title">Need Help?</h3>
          <div className="patient-help-options">
            <a href="#" className="patient-help-link" onClick={(e) => e.preventDefault()}>
              <User size={16} />
              New Patient? Create Account
            </a>
            <a href="#" className="patient-help-link" onClick={(e) => e.preventDefault()}>
              <Phone size={16} />
              Call Support: (555) 123-4567
            </a>
            <a href="#" className="patient-help-link" onClick={(e) => e.preventDefault()}>
              <Mail size={16} />
              Email Support
            </a>
          </div>
        </div>

        {/* Footer Links */}
        <div className="patient-login-footer">
          <p className="patient-footer-text">
            Are you a healthcare provider?{' '}
            <button 
              type="button" 
              className="patient-footer-link-button" 
              onClick={onSwitchToProviderLogin}
            >
              Provider Login
            </button>
          </p>
          <div className="patient-footer-links">
            <a href="#" className="patient-footer-link" onClick={(e) => e.preventDefault()}>
              Privacy Policy
            </a>
            <span className="patient-footer-separator">•</span>
            <a href="#" className="patient-footer-link" onClick={(e) => e.preventDefault()}>
              Terms of Service
            </a>
            <span className="patient-footer-separator">•</span>
            <a href="#" className="patient-footer-link" onClick={(e) => e.preventDefault()}>
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientLoginPage 
