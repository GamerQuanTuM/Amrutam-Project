# Amrutam - Ayurvedic Healthcare Platform

A full-stack healthcare platform connecting patients with certified Ayurvedic practitioners. Built with modern web technologies to provide seamless appointment booking and consultation management.

## 🏗️ Project Structure

```
├── client/          # Next.js frontend application
├── server/          # Node.js backend API
└── tasks.md         # Project tasks and development notes
```

## 🚀 Tech Stack

### Frontend (Client)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with Radix UI primitives
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend (Server)
- **Runtime**: Node.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth system
- **Caching**: Redis
- **Validation**: Zod schemas
- **Logging**: Winston
- **Cron Jobs**: Node-cron for scheduled tasks

## 🌟 Key Features

- **Patient Portal**: User registration, authentication, and profile management
- **Doctor Discovery**: Advanced search and filtering by specialization, mode, and availability
- **Appointment Booking**: Real-time slot booking with availability management
- **Dashboard**: Comprehensive view of upcoming and past appointments
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Real-time Updates**: Live appointment status and availability updates

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- PostgreSQL database
- Redis server (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd amrutam
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   pnpm install

   # Install server dependencies
   cd ../server
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp server/.env.example server/.env
   # Configure your database and other environment variables
   ```

4. **Database Setup**
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1 - Start backend
   cd server
   pnpm dev

   # Terminal 2 - Start frontend
   cd client
   pnpm dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 📱 Application Flow

1. **Landing Page**: Marketing site with features and testimonials
2. **Authentication**: Secure login/signup for patients (doctor portal coming soon)
3. **Dashboard**: Central hub for managing appointments and bookings
4. **Find Doctors**: Advanced search with filters and real-time availability
5. **Booking System**: Seamless appointment scheduling with confirmation

## 🔧 Development

### Client Development
```bash
cd client
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run ESLint
```

### Server Development
```bash
cd server
pnpm dev          # Start development server with hot reload
pnpm build        # Build TypeScript
pnpm start        # Start production server
```

## 📚 API Documentation

The backend provides RESTful APIs for:
- Authentication (`/auth`)
- Doctor management (`/doctor`)
- Appointment booking (`/appointment`)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by the need for accessible healthcare solutions
- UI/UX designed for optimal user experience across devices