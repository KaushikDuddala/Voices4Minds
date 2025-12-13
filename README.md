# Voices4Minds - Mental Health Awareness & Support Platform

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-3178c6)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)

A comprehensive, accessible mental health awareness website providing resources, professional counseling services, community support, and evidence-based information to destigmatize mental health.

---

## 🎯 Overview

Voices4Minds is a modern, full-stack mental health platform designed to be a trusted hub for individuals seeking mental health resources, professional counseling, and peer support. The platform combines educational content, professional services, and community engagement to create a holistic approach to mental health awareness and support.

### Core Mission
- **Destigmatize** mental health issues through education and community
- **Connect** individuals with professional counselors and resources
- **Empower** users with knowledge and tools for mental wellness
- **Support** through accessible, judgement-free platforms

---

## ✨ Key Features

### 📚 Educational Resources
- **Comprehensive Mental Health Information**
  - Detailed guides on anxiety, depression, and other common disorders
  - Evidence-based information and professional insights
  - Accessible medical terminology and layman's explanations

- **Curated Blog Platform**
  - Professional and user-generated blog posts
  - Mental health awareness articles
  - Expert perspectives and success stories
  - Full-featured blog creation for authenticated users

- **Resource Directory**
  - National and local helplines
  - Emergency crisis resources with 24/7 availability
  - Mental health organizations and support services
  - Quick-access crisis banner on all pages

### 👥 Professional Counseling Services
- **Counselor Management Portal**
  - Profile customization with bio and credentials
  - Availability scheduling with calendar interface
  - Real-time appointment management
  - Counselor approval system ensuring quality control
  - Discord integration for extended support

- **Appointment Scheduling System**
  - Interactive calendar booking interface
  - Multiple counselor selection
  - Real-time availability checking
  - Appointment confirmation and management
  - User appointment history and management portal

### 🤝 Community Features
- **Interactive Forums**
  - Category-based discussion spaces
  - Create, read, and reply to forum posts
  - User engagement and peer support
  - Reply system with threading
  - Community-driven mental health conversations

- **Testimonials & Success Stories**
  - User submissions of personal recovery journeys
  - Community-validated success stories
  - Inspiration and hope through real experiences
  - Submit testimonials feature for authenticated users

### 🔐 User Management & Authentication
- **Secure Authentication System**
  - User login and registration
  - Email verification
  - Password security with Supabase Auth
  - Session management

- **User Profiles**
  - Personalized dashboards
  - Appointment history
  - Blog post management
  - Forum activity tracking

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16 (React 19.2)
  - Server-side rendering and static generation
  - Optimized performance and SEO
  - App Router for modern file-based routing

- **Styling & UI**
  - Tailwind CSS for responsive, utility-first styling
  - Radix UI components for accessible, unstyled primitives
  - Custom component library built on Radix/Tailwind
  - PostCSS for advanced CSS processing

- **Form Handling**
  - React Hook Form for efficient form management
  - Zod validation for type-safe schema validation
  - Custom form components

### Backend & Database
- **Database**: Supabase (PostgreSQL)
  - Real-time database subscriptions
  - Row-level security policies
  - Automatic backup and recovery
  - Secure API endpoints

- **Authentication**: Supabase Auth
  - Email/password authentication
  - Session management
  - JWT-based security

- **Server**: Next.js API Routes + Supabase
  - Serverless backend functions
  - Server-side data fetching
  - Proxy configuration for third-party integrations

### Development Tools
- **Language**: TypeScript for type safety and developer experience
- **Package Manager**: pnpm for efficient dependency management
- **Linting**: ESLint for code quality
- **Build**: Next.js build system with optimizations

---

## ♿ Accessibility Features

Voices4Minds is built with accessibility as a core principle, ensuring everyone can access mental health resources:

- **WCAG 2.1 Compliance**
  - Semantic HTML structure
  - ARIA labels and roles throughout
  - Keyboard navigation support
  - Screen reader optimization

- **User Experience Accessibility**
  - Skip navigation links for keyboard users
  - High contrast color schemes (light mode optimized)
  - Readable font sizes and line heights
  - Clear focus indicators
  - Form validation with clear error messages

- **Accessibility Badge**
  - Accessible skip link component
  - Tested with screen readers
  - Keyboard-only navigation support

---

## 📱 Responsive Design

The platform is fully responsive across all devices:

- **Desktop**: Full-featured interface with optimal spacing and layouts
- **Tablet**: Optimized touch interactions and navigation
- **Mobile**: Touch-friendly buttons, simplified navigation, readable content
- **Multi-browser Support**: Chrome, Firefox, Safari, Edge
- **CSS Media Queries**: Responsive breakpoints from 320px to 4K

---

## 🎨 Design System

### Color Scheme (Light Mode Only)
Our carefully curated purple and yellow color palette creates a calming, therapeutic atmosphere:

#### Primary Colors
- **Primary Purple**: `#ea9ad0` - Soft, welcoming purple for primary actions
- **Deep Purple**: `#b75a98`, `#9e3e7d` - Rich purples for depth and emphasis
- **Warm Background**: `#ffe8e2` - Peachy cream background promoting calm

#### Secondary & Accent Colors
- **Secondary Yellow/Peach**: `#ffe1ea` - Light, warm secondary tones
- **Soft Accent Purple**: `#f4c5e8`, `#fbc2dc` - Lighter purples for accents
- **Sidebar Colors**: `#fbc2dc` with `#a9558e` foreground

#### Semantic Colors
- **Neutral Tones**: `#f2e6e0` (border) - Warm grays for readability
- **Destructive Actions**: `#c99e9e` - Muted red for alerts
- **Input Fields**: Neutral light tones for form accessibility

#### Color Psychology
- **Purple**: Represents trust, wisdom, and mental clarity - perfect for mental health support
- **Warm Yellows/Peach**: Creates a welcoming, approachable, non-clinical feeling
- **Light Mode Emphasis**: All colors optimized for light mode only, ensuring consistency and accessibility

### Typography
- **Headings**: Modern, sans-serif fonts (Geist) for clarity and hierarchy
- **Body Text**: Optimized for readability with generous line height and spacing
- **Monospace**: Geist Mono for code and technical content
- **Consistent Sizing**: Clear visual hierarchy throughout all pages

---

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Homepage
│   ├── about/                   # About page
│   ├── appointments/            # Appointment booking system
│   │   ├── book/[counselorId]   # Booking calendar
│   │   └── my-appointments/     # User's appointment history
│   ├── auth/                    # Authentication pages
│   │   ├── login/               # Login page
│   │   ├── sign-up/             # Registration page
│   │   └── sign-up-success/     # Success confirmation
│   ├── blog/                    # Blog platform
│   │   ├── [postId]/            # Individual blog post
│   │   └── new/                 # Create new blog post
│   ├── counselor/               # Counselor portal
│   │   ├── dashboard/           # Counselor dashboard
│   │   ├── appointments/        # Manage appointments
│   │   ├── availability/        # Set availability
│   │   └── profile/             # Edit profile
│   ├── forum/                   # Community forum
│   │   ├── category/[slug]/     # Forum categories
│   │   ├── post/[postId]/       # Individual forum thread
│   │   └── new/                 # Create new forum post
│   ├── dashboard/               # User dashboard
│   ├── resources/               # Mental health resources
│   ├── search/                  # Search functionality
│   └── testimonials/            # Success stories
│
├── components/                   # React components
│   ├── ui/                      # Radix UI component library
│   ├── site-header.tsx          # Navigation header
│   ├── site-footer.tsx          # Footer
│   ├── crisis-banner.tsx        # Emergency resources banner
│   ├── booking-calendar.tsx     # Appointment booking calendar
│   ├── theme-provider.tsx       # Theme configuration
│   ├── accessible-skip-link.tsx # Accessibility feature
│   └── ...                      # Additional components
│
├── lib/                          # Utilities and helpers
│   ├── utils.ts                 # General utilities
│   ├── supabase/
│   │   ├── client.ts            # Client-side Supabase
│   │   ├── server.ts            # Server-side Supabase
│   │   └── proxy.ts             # API proxy configuration
│
├── public/                       # Static assets
├── styles/                       # Global styles
├── scripts/                      # Database setup scripts
│   ├── 00_COMPLETE_DATABASE_SETUP.sql
│   ├── 001_create_tables.sql
│   ├── 002_create_profile_trigger.sql
│   ├── 003_seed_initial_data.sql
│   └── ...
│
└── Configuration Files
    ├── next.config.mjs          # Next.js configuration
    ├── tsconfig.json            # TypeScript configuration
    ├── tailwind.config.ts       # Tailwind CSS configuration
    ├── components.json          # UI component mapping
    └── postcss.config.mjs       # PostCSS configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account (free tier available)
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KaushikDuddala/Voices4Minds
   cd voices4minds-main
   ```

2. **Install dependencies**
   ```bash
   npm i
   ```

3. **Set up environment variables**
   Create a `.env` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   BLOB_READ_WRITE_TOKEN=
   ```

4. **Initialize the database**
   - Log into your Supabase console
   - Run the SQL script in the `scripts/` directory:
     - `00_COMPLETE_DATABASE_SETUP.sql` - Complete database setup with all tables and seed data

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

### Build for Production
```bash
npm build 
npm start
```

---

## 📋 Database Schema

The platform uses a comprehensive PostgreSQL database via Supabase:

- **profiles**: User profile information and roles
- **appointments**: Counselor-client appointment bookings
- **counselors**: Professional counselor information and credentials
- **counselor_availability**: Time slot availability for scheduling
- **blog_posts**: Blog content and metadata
- **forum_posts**: Community forum discussions
- **forum_replies**: Threaded conversation system
- **testimonials**: User success stories and experiences
- **resources**: Mental health helplines and resources

---

## 🔒 Security & Privacy

- **Row-Level Security**: Supabase RLS policies ensure data isolation
- **Authentication**: Secure JWT-based session management
- **Data Encryption**: All sensitive data encrypted in transit and at rest
- **HIPAA Considerations**: Built with healthcare privacy principles
- **Approval System**: Counselors vetted before going live
- **Input Validation**: Server and client-side validation with Zod

---

## 🤝 Counselor Approval System

The platform includes a comprehensive approval system for counselors:

- **Admin Verification**: Counselors require approval before appearing in the platform
- **Profile Management**: Counselors manage their bio, credentials, and specialties
- **Status Tracking**: Clear approval status indicators
- **Professional Standards**: Ensures quality and trustworthiness

---

## 💬 Community & Discord Integration

- **Discord Support**: Extended community support through Discord
- **Real-time Communication**: Forums with immediate engagement
- **Peer Support**: Safe spaces for users to connect
- **Moderation**: Community guidelines and moderation tools

---

## 📊 Features Demonstration

### Design Principles Implemented
✅ **Content Tailored to Audience**: Mental health language appropriate for all literacy levels

✅ **Responsibility Delegation**: Clear separation of user, counselor, and admin roles

✅ **Navigation & UX**: Intuitive sitemap with clear information hierarchy

✅ **Accessibility**: ADA compliant with WCAG 2.1 support

✅ **Responsive Design**: Mobile-first approach supporting all devices

✅ **Multiple Search Options**: Integrated search functionality

✅ **Rich Graphics**: Professional iconography with Lucide React

✅ **Clean Code**: TypeScript, organized components, validated HTML

✅ **Standards-Based**: Modern web standards, semantic HTML5

---

## 🧪 Testing & Quality Assurance

- **TypeScript**: Full type safety throughout the codebase
- **ESLint**: Code quality and consistency checks
- **Cross-browser Testing**: Validated on major browsers
- **Responsive Testing**: Tested on various device sizes
- **Accessibility Testing**: Screen reader compatibility verified

---

## 🚢 Deployment

The project is optimized for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Self-hosted servers**

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Supabase Documentation](https://supabase.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Mental Health Resources](https://www.samhsa.gov/find-help)

---

## 📝 Contributing

We welcome contributions to Voices4Minds. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Support

For support, please:
- Check existing documentation
- Open an issue on GitHub
- Contact through the website's support form
- Join our Discord community

---

## 💡 Acknowledgments

- Built with modern web technologies
- Designed with mental health professionals in mind
- Community-driven development
- Accessibility at the core

---

**Voices4Minds** - Breaking the Stigma, Building Support, One Connection at a Time.
