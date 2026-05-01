# 🏥 Medicare Hospital Management System

A modern, full-stack hospital management web application built with React, TypeScript, Supabase, and Tailwind CSS.

## 🚀 Features

- 👨‍⚕️ Doctor listings and profiles
- 📅 Appointment booking system
- 🔐 User authentication (Login / Signup)
- 🧑‍💼 Admin dashboard
- 👤 Patient profile management
- 📊 User dashboard

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React + TypeScript | Frontend framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Supabase | Backend & Database |
| React Router | Navigation |

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Arpitaiam/medicare-hospital-management.git

# Navigate to project folder
cd medicare-hospital-management

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Environment Setup

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Project Structure
src/
├── components/     # Reusable components (Navbar, etc.)
├── contexts/       # Auth & App context providers
├── pages/          # All page components
│   ├── Home.tsx
│   ├── Doctors.tsx
│   ├── BookAppointment.tsx
│   ├── Dashboard.tsx
│   ├── Admin.tsx
│   ├── Auth.tsx
│   └── Profile.tsx
└── lib/            # Supabase client setup

## 🙋‍♀️ Author

**Arpita Singh** — [@Arpitaiam](https://github.com/Arpitaiam)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
