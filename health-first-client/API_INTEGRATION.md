# Provider Registration API Integration

## Overview
The registration form has been integrated with the provider registration API endpoint to create new healthcare provider accounts.

## API Endpoint
- **URL**: `http://192.168.1.116:4000/api/provider`
- **Method**: POST
- **Content-Type**: application/json

## Request Format
The form data is transformed to match the API's expected format:

```javascript
{
  "first_name": "John",
  "last_name": "Doe", 
  "email": "john.doe@clinic.com",
  "phone_number": "+1234567890",
  "password": "SecurePassword123!",
  "confirm_password": "SecurePassword123!",
  "specialization": "Cardiology",
  "license_number": "MD123456789",
  "years_of_experience": 10,
  "clinic_address": {
    "street": "123 Medical Center Dr",
    "city": "New York", 
    "state": "NY",
    "zip": "10001"
  },
  "degree": "MD", // Optional
  "clinic_name": "Medical Center", // Optional
  "practice_type": "Private Practice", // Optional
  "is_verified": false
}
```

## Response Format
On successful registration (201 status):

```javascript
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@clinic.com",
  "phone_number": "+1234567890",
  "specialization": "Cardiology",
  "license_number": "MD123456789",
  "years_of_experience": 10,
  "clinic_address": {
    "zip": "10001",
    "city": "New York",
    "state": "NY", 
    "street": "123 Medical Center Dr"
  },
  "verification_status": "PENDING",
  "is_verified": false,
  "is_active": true,
  "created_at": "2025-07-24T10:18:53.661Z",
  "updated_at": "2025-07-24T10:18:53.661Z"
}
```

## Error Handling
The integration includes comprehensive error handling for:

- **Network errors**: Connection issues
- **400 Bad Request**: Invalid input data
- **409 Conflict**: Email already exists
- **422 Unprocessable Entity**: Validation errors
- **500+ Server errors**: Backend issues

## Configuration
API configuration is centralized in `src/config/api.js`:

```javascript
export const API_BASE_URL = 'http://192.168.1.116:4000'
export const API_ENDPOINTS = {
  PROVIDER_REGISTRATION: '/api/provider',
  // ... other endpoints
}
```

## Usage
The registration form automatically:
1. Validates all required fields
2. Transforms data to API format
3. Sends POST request to the API
4. Handles success/error responses
5. Shows appropriate user feedback

## Testing
To test the integration:
1. Fill out the registration form
2. Submit the form
3. Check browser console for request/response logs
4. Verify success message appears
5. Check API server logs for the request 
