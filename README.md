# ReAlign AI - Frontend

**Bridging Design Assumptions with Site Reality**

Next.js-powered web application for AI-driven generative design and autonomous construction site execution. Designed for the CreateTech 2026 Hackathon - Problem Statement 3.

---

## 📋 Problem Statement

**Challenge:** Construction projects experience significant gaps between design assumptions and actual site conditions, causing:
- Rework and delays
- Cost overruns
- Resource inefficiencies
- Disconnected workflows

**Solution:** A collaborative web platform enabling Design Engineers and Site Engineers to dynamically recalibrate construction designs based on real-time site data and predictive simulations.

---

## 🎨 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│         REALIGN AI - FRONTEND APPLICATION               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │        Next.js 14 Server/Client              │      │
│  │  • App Router (React 18)                     │      │
│  │  • Server Components & Client Components    │      │
│  │  • Tailwind CSS Styling                      │      │
│  └──────────────────────────────────────────────┘      │
│              ↓         ↓         ↓                      │
│   ┌──────────────┬────────────┬──────────────┐         │
│   │  Auth Layer  │Dashboard   │Project Pages │         │
│   │ (NextAuth)   │Components  │& Views       │         │
│   └──────────────┴────────────┴──────────────┘         │
│              ↓         ↓         ↓                      │
│   ┌────────────────────────────────────────┐           │
│   │       State Management                  │
│   │  • User auth state  • Project data      │           │
│   │  • UI state         • Real-time updates │           │
│   └────────────────────────────────────────┘           │
│              ↓                                          │
│   ┌────────────────────────────────────────┐           │
│   │    API Client Layer (Axios)             │           │
│   │  • RESTful API integration              │           │
│   │  • Error handling & retries             │           │
│   │  • Request/Response interceptors        │           │
│   └────────────────────────────────────────┘           │
│              ↓                                          │
│   ┌────────────────────────────────────────┐           │
│   │    Backend API (FastAPI)                │           │
│   │    http://localhost:8000                 │           │
│   └────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Features

### 👨‍💼 Design Engineer Dashboard
- **Project Management:** Create, edit, and manage construction projects
- **Layout Design & Optimization:** 
  - Propose design layouts
  - Retrieve similar layouts from 571+ layout database
  - Run multi-constraint optimization (cost, timeline, area, safety)
  - Generate new designs using AI (Generative VAE)
- **Cost & Timeline Prediction:** Automated estimation based on project parameters
- **Design Approval Workflow:** Submit designs, track approvals
- **Project Analytics:** Cost vs timeline charts, budget tracking

### 👷 Site Engineer Dashboard
- **Real-Time Project Monitoring:** Track project execution status
- **Sensor Dashboard:** 
  - Environmental sensors (temperature, humidity, wind)
  - Structural sensors (soil moisture, bearing capacity, concrete strength)
  - Resource tracking (material stockpiles, equipment)
  - Workforce monitoring (worker count, equipment status)
- **Issue Reporting:** Report site anomalies and request design changes
- **Live Recalibration Alerts:** Notifications when designs are adapted
- **Execution Tracking:** Monitor actual vs. predicted metrics

### 🔐 Authentication & Authorization
- **Email/Password Registration & Login**
- **Role-Based Access Control:** Design Engineer vs Site Engineer
- **Persistent Sessions:** Automatic token refresh
- **Secure Password Management:** Client-side validation + backend hashing

### 📊 Interactive Dashboards
- **Real-time Data Visualization:** Charts and gauges using Recharts
- **Project Overview Panels:** Status, budget, timeline, risk metrics
- **Design Evolution Tracking:** See how designs adapt over time
- **Issue Resolution Timeline:** Monitor issue status and resolution

---

## 🚀 Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| Framework | Next.js 14 | React framework with SSR/SSG |
| Language | TypeScript | Type-safe JavaScript |
| Styling | Tailwind CSS | Utility-first CSS framework |
| UI Components | Heroicons | Ready-made SVG icons |
| State Management | Zustand | Lightweight state store |
| Forms | React Hook Form | Efficient form validation |
| Validation | Zod | TypeScript-first schema validation |
| HTTP Client | Axios | Promise-based API requests |
| Charts | Recharts | React charting library |
| Date Handling | date-fns | Utility functions for dates |
| Notifications | React Toastify | Toast notifications |
| Auth | NextAuth.js | Authentication & session management |


### Installation

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Edit .env.local with your API URL and NextAuth configuration
```

## 🎬 User Workflows

### Design Engineer Workflow

1. **Login** → Authenticate with credentials
2. **Create Project** → Define project scope, budget, timeline
3. **Propose Design** → Create or retrieve layout design
4. **Optimize Layout** → Run multi-constraint optimization
5. **Review Options** → Compare cost vs timeline tradeoffs
6. **Submit for Approval** → Send design to site engineers
7. **Monitor Execution** → Track actual vs predicted metrics
8. **Respond to Recalibration** → Adapt design based on site conditions

### Site Engineer Workflow

1. **Login** → Authenticate with credentials
2. **View Projects** → See assigned projects and status
3. **Monitor Sensors** → View real-time site data:
   - Environmental conditions (temperature, humidity)
   - Structural health (soil moisture, concrete strength)
   - Resource availability (material stockpiles)
   - Workforce status (worker count, equipment)
4. **Report Issues** → Flag problems or anomalies
5. **Track Recalibration** → See design adaptations
6. **Provide Feedback** → Update issue resolution status

---

## 🔑 Authentication Flow

```
┌─────────────────┐
│  User Register  │
└────────┬────────┘
         │ POST /auth/register
         ▼
┌─────────────────┐      ┌──────────────┐
│  User Login     │─────►│  JWT Token   │
└────────┬────────┘      │  (access +   │
         │               │   refresh)   │
         │               └──────────────┘
         │ Zustand Store (auth + user)
         │
         ▼
┌─────────────────────────┐
│  Authenticated Pages    │
│  (Protected Routes)     │
└─────────────────────────┘
```

### Key Points:
- **Credentials Validation:** Frontend + Backend bcrypt hashing
- **Token Management:** Access tokens (short-lived) + Refresh tokens (long-lived)
- **Protected Routes:** `lib/auth-guard.ts` redirects unauthorized users
- **Auto Refresh:** Axios interceptors refresh expired tokens

---

## 🎨 UI/UX Features

### Design System
- **Tailwind CSS** for consistent styling
- **Responsive Design:** Mobile, tablet, desktop support
- **Dark Mode Ready:** Easy theme switching capability
- **Accessibility:** WCAG 2.1 AA compliant

### Interactive Components
- **Navigation Bar:** Role-based menu options
- **Project Cards:** Status indicators with quick actions
- **Charts & Graphs:** Real-time data visualization with Recharts
- **Modal Dialogs:** Confirmation & form dialogs
- **Toast Notifications:** Success/error/info messages
- **Loading States:** Spinners & skeleton screens

### Form Validation
- **Client-Side:** React Hook Form + Zod validation
- **Real-Time Feedback:** Field-level error messages
- **Password Strength:** Visual password input with strength indicator
- **API Feedback:** Server-side validation messages


## 📈 System Capabilities

| Feature | Status | Notes |
|---------|--------|-------|
| User Authentication | ✅ Complete | NextAuth + JWT |
| Designer Dashboard | ✅ Complete | Project & design management |
| Site Dashboard | ✅ Complete | Sensor monitoring & issues |
| Cost/Timeline Prediction | ✅ Complete | Real-time estimates |
| Optimization UI | ✅ Complete | Multi-constraint solver |
| Design Generation | ✅ Complete | VAE-based generation |
| Real-time Updates | ✅ Complete | Sensor data integration |
| Responsive Design | ✅ Complete | Mobile/tablet/desktop |

---

## 🤝 Contributing

To contribute to the frontend:

1. Create a feature branch from `main`
2. Follow the existing component structure
3. Ensure TypeScript types are defined
4. Test responsiveness on multiple screen sizes
5. Update this README if adding major features
6. Run `npm run type-check` and `npm run lint` before committing

---

## 📝 License

CreateTech 2026 Hackathon Project

---


**Made with ❤️ for CreateTech 2026 Hackathon - Problem Statement 3: AI-Driven Generative Design & Autonomous Construction Site Execution**
