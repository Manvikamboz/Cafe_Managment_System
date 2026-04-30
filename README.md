# ☕ Smart Café Management System

A premium, full-stack MERN application designed for a modern, high-end cafe experience. Inspired by the bold and sophisticated aesthetic of world-class coffee brands, Smart Café combines artisanal design with powerful automation.

![Hero Showcase](/frontend/public/images/hero.png)

## 🌟 Key Features

- **🎯 Starbucks-Inspired UI**: A professional, dark-green themed interface with glassmorphism, bold industrial typography, and high-quality product showcases.
- **🔐 Secure Authentication**: JWT-based authentication with Role-Based Access Control (RBAC) for Customers, Staff, and Admins.
- **🛒 Dynamic Basket System**: Robust shopping cart with real-time updates and persistence.
- **🛰️ Real-time Order Tracking**: Live order status updates (Preparing, Ready, Out for Delivery) powered by **Socket.io**.
- **🤖 AI Barista Assistant**: Integrated chatbot to help customers with menu recommendations and order tracking.
- **📊 Admin & Staff Dashboards**:
  - **Admins**: Full CRUD control over menu items, users, and business analytics.
  - **Staff**: Real-time order fulfillment interface with instant notifications.
- **💖 Customer Feedback & Reviews**: A dedicated "Wall of Love" for verified guest testimonials and a feedback submission system.

## 🏗️ Architecture & Technology

### Backend (Node.js & Express)
- **Modular Service Pattern**: Separated controllers, routes, models, and services for maximum scalability.
- **MongoDB & Mongoose**: Schema-driven data storage with advanced population and indexing.
- **Real-time Engine**: Socket.io integration for instant bi-directional communication.
- **Security**: Password hashing with Bcrypt and secure session handling with JWT.

### Frontend (React & Vite)
- **State Management**: Context API for global auth and cart state.
- **Animations**: **Framer Motion** for smooth, premium transitions and micro-interactions.
- **UI Components**: **Lucide React** icons and customized CSS design system.
- **API Layer**: Centralized Axios instance with request/response interceptors.

## 📁 Project Structure

```
flask-1/
├── backend/            # Express API Server
│   ├── config/         # Database & environment config
│   ├── controllers/    # Business logic handlers
│   ├── middleware/     # Auth, error, and validation middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoint definitions
│   └── services/       # Socket.io & background services
├── frontend/           # React Client
│   ├── public/         # Static assets & images
│   └── src/
│       ├── api/        # Axios configuration
│       ├── components/ # Reusable UI components
│       ├── context/    # Global state (Auth/Cart)
│       ├── pages/      # View components
│       └── App.jsx     # Main routing & layout
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # Update with your MONGO_URI and JWT_SECRET
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Default Credentials
- **Admin**: Create a user via registration and manually change `role` to `admin` in the database.
- **Staff**: Register and change `role` to `staff`.

## 🎨 Design Tokens
- **Primary Green**: `#007042`
- **Dark Forest**: `#1e3932`
- **Cream Accent**: `#d4e9e2`
- **Typography**: Outfit & Playfair Display

---
*Built with ❤️ by the Smart Café Team.*
