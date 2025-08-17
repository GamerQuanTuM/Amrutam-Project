# Amrutam Client - Frontend Application

A modern Next.js frontend for the Amrutam Ayurvedic healthcare platform, providing an intuitive interface for patients to discover and book appointments with certified Ayurvedic practitioners.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with Radix UI primitives
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Themes**: next-themes for dark/light mode

## 📁 Project Structure

```
src/
├── actions/              # Server actions for data fetching
│   ├── findDoctors.ts       # Fetch doctors with filters
│   ├── findDoctorByName.ts  # Search doctors by name
│   └── serverSession.ts     # Server-side session management
├── app/                  # Next.js App Router pages
│   ├── (protected)/         # Protected routes (requires auth)
│   │   ├── dashboard/       # User dashboard
│   │   ├── find-doctors/    # Doctor search and booking
│   │   └── layout.tsx       # Protected layout with navbar
│   ├── (root)/             # Public routes
│   │   ├── page.tsx        # Landing page
│   │   └── layout.tsx      # Public layout
│   ├── auth/               # Authentication pages
│   │   └── page.tsx        # Login/signup page
│   ├── globals.css         # Global styles and Tailwind
│   └── layout.tsx          # Root layout
├── components/           # Reusable UI components
│   ├── auth/               # Authentication components
│   │   ├── UserLoginForm.tsx
│   │   └── UserSignupForm.tsx
│   ├── ui/                 # shadcn/ui components
│   │   ├── card.tsx
│   │   ├── sonner.tsx
│   │   └── tabs.tsx
│   ├── appointments.tsx    # Appointment management
│   ├── bookappointmentmodal.tsx # Booking modal
│   ├── bookingclientwrapper.tsx # Dashboard wrapper
│   ├── createappointment.tsx    # Appointment creation
│   ├── findDoctors.tsx     # Doctor search interface
│   ├── navbar.tsx          # Navigation component
│   ├── quickactions.tsx    # Dashboard quick actions
│   └── upcomingbookings.tsx # Upcoming appointments
├── constants/            # Application constants
│   ├── apiUrl.ts           # API endpoints
│   ├── mode.ts             # Consultation modes
│   └── specialization.ts   # Medical specializations
├── functions/            # Utility functions
│   └── formatDate.ts       # Date formatting utilities
├── hooks/                # Custom React hooks
│   ├── useLogout.ts        # Logout functionality
│   ├── useReschedule.ts    # Appointment rescheduling
│   └── useSession.ts       # Session management
├── lib/                  # Library configurations
│   ├── axiosInstance.ts    # Client-side HTTP client
│   ├── serverAxiosInstance.ts # Server-side HTTP client
│   ├── theme.ts            # Theme configuration
│   └── utils.ts            # Utility functions
├── types/                # TypeScript type definitions
│   ├── appointment.ts      # Appointment types
│   ├── booking.ts          # Booking types
│   ├── findDoctor.ts       # Doctor search types
│   └── user.ts             # User types
└── middleware.ts         # Next.js middleware for auth
```

## 🌟 Key Features & Pages

### 🏠 Landing Page (`/`)
- **Purpose**: Marketing homepage showcasing Ayurvedic services
- **Features**: 
  - Hero section with call-to-action
  - Features showcase (Expert Care, Certified Practitioners, Personalized Treatment)
  - Services overview (Consultation, Panchakarma, Herbal Medicine)
  - Patient testimonials
  - Responsive design with modern UI

### 🔐 Authentication (`/auth`)
- **Purpose**: User login and registration
- **Features**:
  - Tabbed interface for Patient/Doctor (Doctor portal coming soon)
  - Login and signup forms with validation
  - JWT token-based authentication
  - Automatic redirection after login
  - Form validation and error handling

### 📊 Dashboard (`/dashboard`)
- **Purpose**: Central hub for authenticated users
- **Features**:
  - Overview of upcoming appointments
  - Recent bookings and appointment history
  - Quick actions for common tasks
  - Appointment status tracking (Booked, Confirmed, Completed, Cancelled)
  - Responsive cards layout

### 🔍 Find Doctors (`/find-doctors`)
- **Purpose**: Advanced doctor search and appointment booking
- **Features**:
  - **Search Options**:
    - Search by doctor name with real-time results
    - Filter by specialization (Cardiology, Dermatology, etc.)
    - Filter by consultation mode (Online/In-person)
  - **Doctor Cards Display**:
    - Doctor information (name, specialization, experience)
    - Consultation fees and availability
    - Next available slot preview
    - Book appointment button
  - **Pagination**: For filter-based results
  - **Booking Modal**: Slot selection and booking confirmation
  - **Real-time Updates**: Availability updates after booking

## 🔧 Component Architecture

### 🎯 Core Components

- **`navbar.tsx`**: Responsive navigation with authentication state
- **`findDoctors.tsx`**: Complex search interface with filters and pagination
- **`bookappointmentmodal.tsx`**: Modal for slot selection and booking
- **`bookingclientwrapper.tsx`**: Dashboard wrapper managing appointments and bookings

### 🎨 UI Components (shadcn/ui)

- **`card.tsx`**: Reusable card component for content sections
- **`tabs.tsx`**: Tab navigation for authentication pages
- **`sonner.tsx`**: Toast notifications for user feedback

### 🔐 Authentication Flow

1. **Middleware Protection**: Routes are protected via `middleware.ts`
2. **Session Management**: Zustand store manages user state
3. **Token Handling**: JWT tokens stored in cookies
4. **Automatic Redirects**: Logged-in users redirected from public routes

## 🌐 API Integration

### Server Actions
- **`findDoctors.ts`**: Fetches doctors with pagination and filters
- **`findDoctorByName.ts`**: Searches doctors by name
- **`serverSession.ts`**: Server-side session validation

### HTTP Clients
- **Client-side**: `axiosInstance.ts` with interceptors for auth
- **Server-side**: `serverAxiosInstance.ts` for server components

## 🎨 Styling & Theming

- **Tailwind CSS v4**: Utility-first CSS framework
- **Custom Theme**: Amber/orange color scheme for Ayurvedic branding
- **Responsive Design**: Mobile-first approach
- **Custom Classes**: Reusable button and input styles
- **Dark/Light Mode**: Theme switching capability

## 🚦 Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## 🔄 State Management

- **Zustand**: Lightweight state management for user session
- **Server State**: React Server Components for data fetching
- **Form State**: Local component state for forms
- **URL State**: Search params for filters and pagination

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: Tailored for sm, md, lg, xl screens
- **Touch-friendly**: Large tap targets and intuitive gestures
- **Performance**: Optimized images and lazy loading

## 🔒 Security Features

- **Route Protection**: Middleware-based authentication
- **CSRF Protection**: Secure form submissions
- **Input Validation**: Client and server-side validation
- **Secure Headers**: Next.js security headers

## 🚀 Performance Optimizations

- **Next.js 15**: Latest features and optimizations
- **Server Components**: Reduced client-side JavaScript
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Efficient data fetching and caching strategies
