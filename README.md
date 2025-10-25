# 🌍 نسخه فارسی README 

[🌍🇮🇷 فارسی](./README.FA.md)


# HomeNest Admin Panel

A responsive and modern admin dashboard(persian) for the [HomeNest](https://github.com/your-org/home-nest) project.  
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

| Technology              | Version | Description                              |
|-------------------------|---------|------------------------------------------|
| ⚛️ **React**            | 19.1.1  | UI library for building components.      |
| 🧭 **React Router DOM** | 7.9.3   | Client-side routing for React apps.      |
| 🌐 **Axios**            | 1.12.2  | Promise-based HTTP client.               |
| 🍪 **cookie**           | 1.0.2   | Parse and serialize cookies.             |
| 🗄️ **Supabase JS**     | 2.75.0  | Database, auth, and storage client.      |
| ⚡ **Vite**              | 7.1.7   | Fast dev server and build tool.          |
| 🚀 **swc**              | 4.1.0   | Super-fast JS/TS compiler.               |
| 🧹 **ESLint**           | 9.36.0  | Linter for code quality and consistency. |
| ▲ **Vercel (global)**   | 48.6.0  | Deployment and serverless platform.      |
| 🎨 **clsx**             | 2.1.1   | Utility for conditional class names.     |
| 💨 **TailwindCSS**      | 4.1.14  | Utility-first CSS framework.             |
| 🧩 **tailwind-merge**   | 3.3.1   | Merge and deduplicate Tailwind classes.  |

---

## 📁 Folder Structure

The project follows a modular structure:

```
home-nest-admin/
├── api/                 # Serverless API routes (executed on Vercel server)
├── public/              # Static public assets (served directly, no bundling)
├── src/
│   ├── assets/          # Project images, icons, and static media
│   ├── components/      # Reusable and shared UI components
│   ├── context/         # Global React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── layout/          # Page and dashboard layout components
│   ├── lib/             # Core utilities, API clients, and helpers
│   ├── pages/           # Route-based React pages
│   ├── routes/          # App route definitions and navigation config
│   ├── styles/          # Global and component-level style files
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Application entry point
│
├── vite.config.js       # Vite build and dev server configuration
├── eslint.config.js     # ESLint setup and linting rules
├── jsconfig.json        # JS path aliases and IntelliSense config
└── package.json         # Project dependencies and scripts
```

---

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com), using API routes for backend logic and Supabase for authentication and data storage.

---

## 📦 Getting Started

Install dependencies, run the development server, build the project, and preview the production build.

```bash
# Clone Reop
git clone https://github.com/homow/home-nest-admin.git

# Navigate to Root
cd home-nest-admin

# Install dependencies
npm install

# Run development server (requires global Vercel CLI)
vercel dev

# Run ESLint to check code quality
npm run lint

# Build production-ready assets
npm run build

# Preview production build locally
npm run preview
```