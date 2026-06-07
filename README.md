# Student Management System

A full-stack Student Management System built with **Next.js 14 (App Router)**, **GraphQL (Apollo)**, **Prisma ORM**, **PostgreSQL**, **JWT Authentication**, and **TypeScript**.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 App Router, React, Tailwind CSS |
| API | GraphQL (Apollo Server v5) |
| ORM | Prisma 6 |
| Database | PostgreSQL |
| Auth | JWT + bcryptjs |
| Forms | React Hook Form + Zod |
| State | Apollo Client cache |

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/         # Login page
│   ├── (auth)/register/      # Register page
│   ├── (dashboard)/
│   │   ├── dashboard/        # Dashboard with stats
│   │   └── students/         # List, Add, View, Edit pages
│   ├── api/
│   │   ├── graphql/          # Apollo Server route
│   │   └── upload/           # File upload route
│   └── layout.tsx
├── components/
│   ├── auth/
│   ├── layout/               # Navbar, Sidebar
│   ├── students/             # StudentCard, StudentForm
│   └── ui/                   # Button, Input, Select, Modal, Pagination, ImageUpload
├── graphql/
│   ├── resolvers/            # auth.resolver, student.resolver
│   ├── schema/               # typeDefs
│   ├── mutations/            # Frontend mutation documents
│   └── queries/              # Frontend query documents
├── hooks/                    # useAuth, useStudents
├── lib/                      # prisma, jwt, apollo-client, validations
├── middleware.ts             # Route protection
└── types/                    # Shared TypeScript types
```

## Setup

### 1. Prerequisites

- Node.js 18+
- PostgreSQL running locally

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/student_management"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"
NEXT_PUBLIC_GRAPHQL_URL="http://localhost:3000/api/graphql"
```

### 4. Setup database

```bash
# Create and apply migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed admin user (admin@school.com / Admin@123)
npx prisma db seed
```

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Default admin credentials: `admin@school.com` / `Admin@123`

## GraphQL API

Endpoint: `POST /api/graphql`

### Queries

| Query | Description |
|---|---|
| `getStudents(page, limit, search, department, gender, sortBy, sortOrder)` | Paginated, filtered student list |
| `getStudentById(id)` | Single student details |
| `getCurrentUser` | Authenticated user info |

### Mutations

| Mutation | Auth Required | Role |
|---|---|---|
| `register(email, password, role)` | No | — |
| `login(email, password)` | No | — |
| `addStudent(...)` | Yes | ADMIN |
| `updateStudent(id, ...)` | Yes | ADMIN or Owner |
| `deleteStudent(id)` | Yes | ADMIN |
| `uploadProfileImage(studentId, imageUrl)` | Yes | ADMIN or Owner |

## Features

- **JWT Auth** – tokens stored in localStorage + httpOnly-style cookie for SSR middleware
- **Role-based access** – Admins manage all students; Students manage only their own profile
- **Image Upload** – Local file storage under `public/uploads/`, validates type (JPEG/PNG/WebP/GIF) and size (max 5MB)
- **Search & Filter** – Real-time search by name/email, filter by department/gender
- **Pagination** – Server-side pagination with page navigation
- **Sorting** – Sort by creation date, name, or department
- **Form Validation** – Zod schema validation via React Hook Form
- **Toast Notifications** – react-hot-toast for success/error feedback
- **Confirmation Modal** – Delete confirmation before removing students
- **Responsive Design** – Tailwind CSS responsive grid layout

## Scripts

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server
npx prisma studio        # Open Prisma DB browser
npx prisma migrate dev   # Run migrations
```
