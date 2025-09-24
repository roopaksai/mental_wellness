# Mental Wellness Application - MongoDB Integration

This application has been successfully migrated from mock data to use MongoDB as the database backend.

## Database Setup

The application now uses MongoDB Atlas with the following connection string:
```
mongodb+srv://roopak:t7XvZ8fGazx5xeUB@cluster0.lxzxlsb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

## Features Integrated with MongoDB

### 1. User Authentication
- Users are now stored in MongoDB with encrypted passwords
- Support for student, admin, and support staff roles
- Database-backed login/registration system

### 2. Mental Health Assessments
- PHQ-9 and PARS assessment results stored in database
- Risk level calculation and tracking
- Historical assessment data per user

### 3. Student Support System
- Students can register for peer support
- Support staff can view available students
- Booking system for consultation sessions
- Time slot management

### 4. Chat System
- Chat messages saved to database
- Chat history persistence
- Real-time support conversations

### 5. Analytics Dashboard
- Real-time analytics from database
- Student risk distribution
- Assessment tracking and reporting

## Sample Users (Password: password123)

### Students:
- student@test.com (Alex Student)
- student2@test.com (Jamie Student) 
- emma.j@university.edu (Emma Johnson)
- m.chen@university.edu (Michael Chen)
- s.williams@university.edu (Sarah Williams)
- d.rodriguez@university.edu (David Rodriguez)

### Admin:
- admin@test.com (Sarah Admin)

### Support Staff:
- support@test.com (Dr. Mike Support)

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

### Users
- GET `/api/users` - Get all users
- GET `/api/users/[id]` - Get user by ID

### Assessments
- GET `/api/assessments` - Get assessments (optionally filter by userId)
- POST `/api/assessments` - Create new assessment

### Students
- GET `/api/students` - Get all students with latest assessment data

### Analytics
- GET `/api/analytics` - Get dashboard analytics

### Bookings
- GET `/api/bookings` - Get bookings
- POST `/api/bookings` - Create new booking

### Available Students
- GET `/api/available-students` - Get students available for support

### Student Support
- GET `/api/student-support` - Check registration status
- POST `/api/student-support` - Register for support
- PUT `/api/student-support` - Update support registration

### Chat
- GET `/api/chat` - Get chat messages
- POST `/api/chat` - Send chat message

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Seed the database with sample data:
   ```bash
   npm run seed
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Visit http://localhost:3001 (or the port shown in terminal)

## Database Models

### User
- email, name, role, password (encrypted)
- Supports student, admin, support roles

### Assessment
- Links to User
- PHQ-9 and PARS scores
- Risk level calculation
- Individual question answers

### StudentSupport
- Student registration for peer support
- Available time slots
- Contact preferences

### Booking
- Links Student and Support Staff
- Session scheduling
- Status tracking

### ChatMessage
- User chat history
- Bot conversations
- Message categorization

## Migration Summary

✅ All mock data replaced with MongoDB operations
✅ User authentication migrated to database
✅ Assessment system integrated with database
✅ Student support registration system implemented
✅ Booking system with database persistence
✅ Chat system with message history
✅ Admin analytics dashboard with real-time data
✅ Complete API layer for all data operations

The application now provides a fully functional mental wellness platform with persistent data storage, user management, and comprehensive tracking capabilities.