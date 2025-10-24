# HomeNest Admin Panel

A responsive and modern admin dashboard for the [HomeNest](https://github.com/your-org/home-nest) platform.  
Built with React, TailwindCSS, and Supabase, this panel provides authenticated access and management tools for administrators.

---

## ✨ Features

- **Responsive Design**: Fully optimized for both desktop and mobile, including collapsible sidebar navigation.
- **Dark & Light Themes**: Seamless theme switching for user preference.
- **Supabase Integration**: Authentication and data operations via Supabase API.
- **Vercel Server Functions**: Secure backend logic handled through Vercel's serverless architecture.
- **Modular Architecture**: Clean folder structure for scalability and maintainability.

---

## 🛠️ Tech Stack

| Technology / Package            | Version |
|---------------------------------|---------|
| **React**                       | 19.1.1  |
| **React Router DOM**            | 7.9.3   |
| **Axios**                       | 1.12.2  |
| **Supabase JS**                 | 2.75.0  |
| **clsx**                        | 2.1.1   |
| **cookie**                      | 1.0.2   |
| **tailwind-merge**              | 3.3.1   |
| **Vite**                        | 7.1.7   |
| **swc**                         | 4.1.0   |
| **TailwindCSS**                 | 4.1.14  |
| **ESLint**                      | 9.36.0  |

---

## 📁 Folder Structure

The project follows a modular structure:

```
home-nest-admin/
├── api/                 # Vercel serverless functions
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and icons
│   ├── components/      # Reusable UI components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom hooks
│   ├── layout/          # Layout components
│   ├── pages/           # Route-based pages
│   ├── routes/          # Route definitions
├── .env                 # Environment variables
├── vite.config.js       # Vite configuration
└── package.json         # Project metadata
```

---

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com), using API routes for backend logic and Supabase for authentication and data storage.

---

## 📦 Getting Started

Install dependencies, run the development server, build the project, and preview the production build.

```bash
# 1️⃣ Install dependencies
npm install

# 2️⃣ Run development server (Vercel CLI required)
vercel dev

# 3️⃣ Build production-ready assets
npm run build

# 4️⃣ Preview production build locally
npm run preview
```