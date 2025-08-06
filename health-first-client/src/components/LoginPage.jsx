import { useState } from 'react'
import { Eye, EyeOff, Mail, Phone, Lock, Stethoscope, AlertCircle, CheckCircle } from 'lucide-react'
import { authService } from '../config/api'

function LoginPage({ onSwitchToRegistration, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('🔐 Form submitted with data:', formData)
    
    if (!validateForm()) {
      console.log('❌ Form validation failed')
      return
    }
    
    console.log('✅ Form validation passed, making API call...')
    
    setIsLoading(true)
    setErrors({})
    setIsSuccess(false)
    
    try {
      const result = await authService.login(formData.email, formData.password)
      
      console.log('📋 Login result:', result)
      
      if (result.success) {
        // Store authentication data
        authService.setAuthData(result.token, result.user)
        
        setIsSuccess(true)
        
        // Show success message and redirect
        setTimeout(() => {
          alert('Login successful! Welcome to your health portal.')
          // Call the success callback to update app state
          if (onLoginSuccess) {
            onLoginSuccess()
          }
        }, 1000)
        
      } else {
        setErrors({ general: result.error })
      }
      
    } catch (error) {
      console.error('❌ Login submission error:', error)
      setErrors({ general: 'Network error. Please check your connection and try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      {/* Background with medical theme */}
      <div className="background-pattern"></div>
      
      {/* Main Login Card */}
      <div className="login-card">
        {/* Header Section */}
        <div className="login-header">
          <div className="logo-section">
            <div className="logo-icon">
              <Stethoscope size={32} />
            </div>
            <h1 className="app-title">Sample EMR</h1>
          </div>
          <h2 className="login-title">Provider Login</h2>
          <p className="login-subtitle">Access your healthcare dashboard securely</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Input */}
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email Address
            </label>
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

          {/* Password Input */}
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                autoComplete="current-password"
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
            {errors.password && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.password}
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isLoading}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              Remember me
            </label>
            <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
              Forgot Password?
            </a>
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
              Login successful! Redirecting...
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Signing In...
              </>
            ) : (
              'Sign In to My Health Portal'
            )}
          </button>

          {/* Test API Button - Remove this after testing */}
          <button
            type="button"
            onClick={async () => {
              console.log('🧪 Testing API call...')
              const result = await authService.login('test@example.com', 'testpassword123')
              console.log('🧪 Test result:', result)
            }}
            style={{
              marginTop: '10px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Test API Call
          </button>
        </form>

        {/* Footer Links */}
        <div className="login-footer">
          <p className="footer-text">
            New to Sample EMR?{' '}
            <button 
              type="button" 
              className="footer-link-button" 
              onClick={onSwitchToRegistration}
            >
              Register as a Provider
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

export default LoginPage 
