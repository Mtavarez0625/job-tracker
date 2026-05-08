# Job Tracker SaaS

A production-ready full-stack SaaS application for tracking job applications, interviews, offers, and recruiting progress.

Built with Next.js 16, React 19, TypeScript, Prisma ORM, PostgreSQL, NextAuth, and Tailwind CSS.

---

## 🚀 Live Demo

https://job-tracker-sigma-six.vercel.app

---

## 📌 Overview

Job Tracker SaaS is a modern job application management platform designed to help users organize and streamline their job search pipeline in one secure dashboard.

Users can:

- Create accounts and securely authenticate
- Track job applications and recruiting progress
- Manage interviews and offers
- Search and filter opportunities
- Edit or delete applications
- Monitor job statuses in real time

This project demonstrates production-level full-stack engineering patterns including:

- Authentication
- Protected routes
- Database persistence
- CRUD operations
- Optimistic UI updates
- Responsive SaaS UI/UX
- Production deployment workflows

---

## ✨ Features

- 🔐 Secure authentication with NextAuth
- 🛡️ Protected dashboard routes
- ➕ Create new job applications
- ✏️ Edit application details
- ❌ Delete applications
- 📊 Application status tracking
- 🔎 Search and filtering
- ⚡ Optimistic UI updates
- 🔔 Toast notifications
- 📱 Fully responsive design
- 🗄️ PostgreSQL database integration
- 🧠 Prisma ORM for database management
- ☁️ Deployed on Vercel

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 |
| Frontend | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Authentication | NextAuth |
| Database | PostgreSQL |
| ORM | Prisma |
| Database Hosting | Neon |
| Deployment | Vercel |

---

## 📸 Screenshots

### Dashboard

Dashboard

---

### Applications

Applications

---

### Authentication

Authentication

---

## 🧱 Architecture Highlights

- Built using the Next.js App Router
- Server + Client Component architecture
- Secure session-based authentication
- RESTful API route handlers
- Prisma ORM connected to Neon PostgreSQL
- Optimistic state updates for better UX
- Responsive dashboard design system
- Environment-secured production deployment

---

## ⚡ Performance & UX

- Fast page rendering with Next.js 16
- Responsive mobile-first interface
- Clean SaaS-style dashboard layout
- Smooth transitions and modern UI patterns
- Lightweight and scalable architecture

---

## 📂 Project Structure

bash app/  ├── api/  ├── dashboard/  ├── login/  ├── register/  └── applications/  components/ lib/ prisma/ public/ types/ 

---

## 🧪 Getting Started

Clone the repository:

bash git clone https://github.com/Mtavarez0625/job-tracker.git 

Move into the project directory:

bash cd job-tracker 

Install dependencies:

bash npm install 

Create a .env file using .env.example:

env DATABASE_URL= DIRECT_DATABASE_URL= NEXTAUTH_SECRET= NEXTAUTH_URL= 

Generate the Prisma client:

bash npx prisma generate 

Run the development server:

bash npm run dev 

Open the application:

text http://localhost:3000 

---

## 🏗️ Production Build

bash npm run build 

---

## 📚 What I Learned

This project strengthened my understanding of:

- Full-stack SaaS architecture
- Authentication and route protection
- Prisma schema modeling
- PostgreSQL integration
- Next.js App Router patterns
- API route handling
- Optimistic UI strategies
- Responsive UI/UX engineering
- Production deployment workflows

---

## 🌐 Deployment

The application is deployed on Vercel with:

- Environment-secured credentials
- Production PostgreSQL database
- Prisma ORM integration
- Optimized Next.js production builds

Live URL:

https://job-tracker-sigma-six.vercel.app

---

## 👨‍💻 Author

### Marcos Tavarez

- Portfolio: https://marcostavarez.com
- GitHub: https://github.com/Mtavarez0625
- LinkedIn: https://www.linkedin.com/in/marcos-tavarez/

---

## 📄 License

This project is licensed under the MIT L
