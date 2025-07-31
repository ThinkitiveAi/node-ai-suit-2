# Patient Module

This module handles patient-related operations including creation and retrieval of patient records.

## Endpoints

### POST /patients
Creates a new patient account.

**Request Body:**
```json
{
  "email": "patient@example.com",
  "password": "securepassword123",
  "confirm_password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "date_of_birth": "1990-01-01",
  "gender": "MALE",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "emergency_contact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phoneNumber": "+1234567891"
  },
  "medical_history": ["Diabetes", "Hypertension"],
  "insurance_info": {
    "provider": "Blue Cross",
    "policyNumber": "BC123456",
    "groupNumber": "GRP789",
    "expirationDate": "2024-12-31"
  }
}
```

**Response:**
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "patient@example.com",
  "phone_number": "+1234567890",
  "date_of_birth": "1990-01-01T00:00:00.000Z",
  "gender": "MALE",
  "address": { ... },
  "emergency_contact": { ... },
  "medical_history": ["Diabetes", "Hypertension"],
  "insurance_info": { ... },
  "email_verified": false,
  "phone_verified": false,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "user_id": null
}
```

### GET /patients
Retrieves all active patients.

**Response:**
```json
[
  {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "patient@example.com",
    ...
  }
]
```

## Validation Rules

- **Email**: Must be a valid email format and unique
- **Password**: Minimum 8 characters, maximum 128 characters
- **First/Last Name**: Minimum 2 characters, maximum 50 characters
- **Phone Number**: Must match international phone number format
- **Date of Birth**: Must be a valid date string
- **Gender**: Must be one of: MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY

## Error Responses

- **400 Bad Request**: Invalid data provided
- **409 Conflict**: Patient with email already exists
- **500 Internal Server Error**: Server error

## DTOs

- `CreatePatientDto`: Input validation for patient creation
- `PatientResponseDto`: Response structure for patient data
- `AddressDto`: Address information structure
- `EmergencyContactDto`: Emergency contact information structure
- `InsuranceInfoDto`: Insurance information structure 