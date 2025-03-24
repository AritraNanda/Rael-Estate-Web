🏠 Real Estate Platform - Full Stack Web Application

A comprehensive real estate platform built with modern web technologies, offering a seamless experience for property listings, user management, and real estate transactions.

## 🌟 Features

### 1. User Management
- Secure authentication and authorization
- User profiles and preferences
- Role-based access control (Admin, Staff, Regular Users)
- JWT-based session management
- Password hashing with bcrypt

### 2. Property Management
- Property listings with detailed information
- Advanced search and filtering capabilities
- Saved properties functionality
- Property analytics and insights
- Image upload and management
- Property status tracking

### 3. Subscription System
- Multiple subscription plans
- Payment integration
- Transaction history
- Staff-specific subscription features
- Subscription analytics
- Automated billing

### 4. Admin Dashboard
- User management
- Property moderation
- Analytics and reporting
- System configuration
- Role management
- Activity monitoring

### 5. Staff Portal
- Property listing management
- Subscription management
- Transaction tracking
- Performance metrics
- Client management
- Reporting tools

## 🛠️ Tech Stack

### Frontend
- React.js 18
- Vite for build tooling
- Redux Toolkit for state management
- React Router DOM for routing
- Tailwind CSS for styling
- Recharts for data visualization
- React Hot Toast for notifications
- Swiper for carousels
- Firebase integration
- Supabase integration

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cookie-based sessions
- RESTful API architecture

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager
- Git

## 🚀 Installation & Setup

1. **Clone the Repository**
```bash
git clone <repository-url>
cd real-estate
```

2. **Install Dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

3. **Environment Setup**

Create a `.env` file in the root directory with the following variables:
```env
MONGO=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_SECRET2=your_secondary_jwt_secret
JWT_SECRET3=your_tertiary_jwt_secret
JWT_SECRET4=your_quaternary_jwt_secret
```

4. **Database Setup**
- Create a MongoDB database
- Update the MONGO connection string in your .env file
- The application will automatically create necessary collections

5. **Running the Application**

Development Mode:
```bash
# Start backend server
npm run dev

# In a new terminal, start frontend
cd client
npm run dev
```

Production Mode:
```bash
# Build frontend
cd client
npm run build

# Start production server
cd ..
npm start
```

## 📁 Project Structure

Rael-Estate-Web/
├── public/                # Static assets
│   ├── images/            # Property and UI images
│   └── index.html         # Main HTML template
├── src/                   # Application source code
│   ├── assets/            # Additional assets (icons, logos)
│   ├── components/        # Reusable UI components
│   │   ├── Header/        # Navigation header
│   │   ├── PropertyCard/  # Individual property listing component
│   │   └── Search/        # Search functionality components
│   ├── pages/             # Main application views
│   │   ├── Home/          # Landing page with featured properties
│   │   ├── Properties/    # Full property listings
│   │   └── Property/      # Detailed property view
│   ├── styles/            # Global styling and CSS modules
│   ├── App.js             # Main application component
│   └── index.js           # Application entry point
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation
