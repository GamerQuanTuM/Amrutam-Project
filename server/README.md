# Amrutam Healthcare Server

A robust Node.js/TypeScript backend API for a healthcare appointment booking system built with Express, Prisma ORM, PostgreSQL, and Redis.

## 🏗️ Architecture Overview

This server follows a **layered architecture** pattern with clear separation of concerns:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and core functionality
- **Routes**: Define API endpoints
- **Middleware**: Cross-cutting concerns like authentication, logging, error handling
- **Schemas**: Request/response validation using Zod
- **Utils**: Shared utilities and helpers

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- Redis instance
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and Redis credentials

# Run database migrations
pnpm prisma migrate dev

# Seed the database (optional)
pnpm seed

# Start development server
pnpm dev
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
JWT_SECRET=your-secret-key

# Redis (for caching)
REDIS_USERNAME=your-username
REDIS_PASSWORD=your-password
REDIS_HOST=your-redis-host
REDIS_PORT=your-redis-port

# Server
PORT=4000
NODE_ENV=development
```

## 📁 Project Structure

```
server/
├── src/
│   ├── config/           # Configuration files
│   │   ├── config.ts     # App configuration
│   │   ├── env.config.ts # Environment validation
│   │   ├── prisma.ts     # Prisma client instance
│   │   └── redis.ts      # Redis client configuration
│   │
│   ├── controllers/      # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── doctor.controller.ts
│   │   └── appointment.controller.ts
│   │
│   ├── services/         # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── doctor.service.ts
│   │   └── appointment.service.ts
│   │
│   ├── routes/           # API routes
│   │   ├── auth.route.ts
│   │   ├── doctor.route.ts
│   │   └── appointment.route.ts
│   │
│   ├── schemas/          # Request validation schemas
│   │   ├── auth/
│   │   ├── doctor/
│   │   └── appointment/
│   │
│   ├── middlewares/      # Express middlewares
│   │   ├── authenticated.ts
│   │   ├── errorHandler.ts
│   │   └── requestLogger.ts
│   │
│   ├── utils/            # Shared utilities
│   │   ├── httpException.ts
│   │   ├── logger.ts
│   │   ├── redisCache.ts
│   │   └── validateRequest.ts
│   │
│   ├── cron/             # Scheduled jobs
│   │   ├── appointment.ts
│   │   └── index.ts
│   │
│   └── types/            # TypeScript type definitions
│       ├── authUser.types.ts
│       └── validatedHandler.types.ts
│
├── prisma/               # Database schema and migrations
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── logs/                 # Application logs
└── dist/                 # Compiled JavaScript (production)
```

## 🔧 Core Services Documentation

### 1. Appointment Service (`appointment.service.ts`)

The **Appointment Service** is the heart of the booking system, managing the complete appointment lifecycle:

#### Key Features:
- **Slot Booking**: Temporary reservation with 5-minute lock
- **Appointment Confirmation**: Final booking after payment
- **Rescheduling**: Up to 3 times with 24-hour window restriction
- **Cancellation**: 24-hour window from payment confirmation
- **Slot Management**: Automatic cleanup of expired locks
- **Caching**: Redis integration for performance

#### Core Methods:

| Method | Description | Key Logic |
|--------|-------------|-----------|
| `booking()` | Reserve a slot temporarily | Sets 5-minute lock with user ID |
| `confirm()` | Create appointment after booking | Transaction: create appointment + mark slot booked |
| `confirmPayment()` | Mark appointment as paid | Updates status to COMPLETED |
| `cancel()` | Cancel appointment | Transaction: update status + free slot |
| `reschedule()` | Change appointment slot | Max 3 reschedules, 24hr window |
| `getAvailableSlots()` | Get paginated available slots | Redis caching (5min TTL) |
| `getAppointmentsOfUser()` | User's appointment history | Includes doctor details |
| `getBookingsOfUser()` | User's temporary bookings | Locked slots not yet confirmed |
| `userAppointmentCount()` | User's appointments count | Keep track of status |

#### Business Rules:
- **Lock Expiry**: 5 minutes from booking
- **Reschedule Limit**: Maximum 3 times per appointment
- **Cancellation Window**: 24 hours from payment confirmation
- **Payment Window**: 15 minutes to complete payment
- **Cache TTL**: 5 minutes for available slots

### 2. Auth Service (`auth.service.ts`)

Handles user authentication and authorization with JWT tokens.

#### Key Features:
- **User Registration**: Email uniqueness validation
- **Secure Login**: Password hashing with bcrypt
- **JWT Tokens**: 24-hour expiration
- **Current User**: Profile retrieval with optional appointments

#### Core Methods:

| Method | Description | Security Features |
|--------|-------------|-------------------|
| `register()` | Create new user | Email uniqueness check, password hashing |
| `login()` | Authenticate user | Password verification, JWT generation |
| `currentUser()` | Get user profile | Validates JWT, optional appointment inclusion |

#### Security Measures:
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Secret**: Environment-based secret key
- **Token Expiry**: 24 hours for security
- **Email Validation**: Prevents duplicate registrations

### 3. Doctor Service (`doctor.service.ts`)

Manages doctor discovery and availability with intelligent filtering.

#### Key Features:
- **Doctor Search**: By specialization and consultation mode
- **Name Search**: Smart "Dr." prefix handling
- **Availability Filtering**: Only shows available slots
- **Sorting**: By earliest available appointment
- **Pagination**: Efficient result limiting

#### Core Methods:

| Method | Description | Filtering Options |
|--------|-------------|-------------------|
| `findDoctors()` | Get doctors with filters | Specialization, mode, pagination |
| `findDoctorsByName()` | Search doctors by name | Smart prefix handling |

#### Search Intelligence:
- **Auto-prefix**: Adds "Dr." if missing
- **Case-insensitive**: Name searches
- **Availability Priority**: Sorts by earliest slot
- **Slot Filtering**: Only unbooked, unlocked slots

## 🗄️ Database Schema

### Core Entities:

#### User
- **id**: UUID primary key
- **email**: Unique identifier
- **role**: USER | DOCTOR | ADMIN
- **password**: Hashed password

#### Doctor
- **specialization**: Enum-based categories
- **mode**: ONLINE | IN_PERSON
- **consultationFee**: Decimal pricing
- **experience**: Years of practice

#### Availability (Slots)
- **timeRange**: startTime - endTime
- **bookingStatus**: isBooked flag
- **locking**: lockedBy, lockedAt, lockExpiry
- **cleanup**: Automatic past slot removal

#### Appointment
- **status**: BOOKED | COMPLETED | CANCELLED
- **confirmation**: confirmed flag + timestamp
- **rescheduleTracking**: count + original slot
- **payment**: 15-minute auto-cancellation

## 🔄 Background Jobs (Cron)

### Scheduled Tasks:
1. **Release Expired Locks** (Every minute)
   - Frees slots with expired 5-minute locks
   - Logs released slot count

2. **Auto-cancel Unpaid Appointments** (Every minute)
   - Cancels appointments unpaid for 15+ minutes
   - Frees associated slots

3. **Daily Cleanup** (Midnight)
   - Removes past slots and appointments
   - Maintains database hygiene

## 🛡️ Security Features

- **Rate Limiting**: 100 requests per 15 minutes
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers
- **Input Validation**: Zod schemas for all endpoints
- **Authentication**: JWT-based auth middleware
- **Error Handling**: Centralized error responses

## 🚀 API Endpoints

### Authentication
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Doctors
- `GET /api/v1/doctor/find` - Find doctors with filters
- `GET /api/v1/doctor/find/name` - Search by name

### Appointments
- `POST /api/v1/appointment/book` - Book slot
- `POST /api/v1/appointment/confirm` - Confirm appointment
- `PUT /api/v1/appointment/cancel/:appointmentId` - Cancel appointment
- `PUT /api/v1/appointment/make-payment/:appointmentId` - Make Payment for appointment
- `PUT /api/v1/appointment/reschedule` - Reschedule
- `GET /api/v1/appointment/available-slots` - Available slots
- `GET /api/v1/appointment/user-bookings` - User bookings
- `GET /api/v1/appointment/user-appointments` - User appointments
- `GET /api/v1/appointment//user-appointments-count` - User appointments count

## 🧪 Development Commands

```bash
# Development
pnpm dev          # Start with hot reload
pnpm build        # Build for production
pnpm start        # Start production server

# Database
pnpm prisma migrate dev    # Run migrations
pnpm prisma studio         # Open Prisma Studio
pnpm seed                  # Seed database

# Code Quality
pnpm lint           # ESLint
pnpm format         # Prettier (via VS Code extension)
```

## 📊 Performance Optimizations

- **Redis Caching**: Available slots cached for 5 minutes
- **Database Indexing**: Optimized queries on frequently accessed fields
- **Pagination**: Efficient data loading
- **Connection Pooling**: Prisma's built-in optimization
- **Lazy Loading**: Selective field inclusion

## 🔍 Monitoring & Logging

- **Winston Logger**: Structured logging with daily rotation
- **Request Logging**: Morgan for HTTP logs
- **Error Tracking**: Centralized error handling
- **Health Check**: Root endpoint for uptime monitoring

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection**
   ```bash
   # Check database URL
   pnpm prisma db pull
   ```

2. **Redis Connection**
   ```bash
   # Test Redis connection
   pnpm ts-node -e "import { checkRedisConnection } from './src/config/redis'; checkRedisConnection().then(console.log)"
   ```

3. **Port Already in Use**
   ```bash
   # Kill process on port 4000
   npx kill-port 4000
   ```

4. **Prisma Issues**
   ```bash
   # Reset database
   pnpm prisma migrate reset
   pnpm prisma generate
   ```
