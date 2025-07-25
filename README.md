Primary Link: https://estatebro.onrender.com/

Alternative Link: https://estatebro123.onrender.com/

🏠 Real Estate Platform - Full Stack Web Application

A comprehensive real estate platform built with modern web technologies, offering a seamless experience for property listings, user management, and real estate transactions.

## 💻 Local Development Setup

### Running the Application Locally

1. **Start the Backend Server**
```bash
# Navigate to the root directory (real-estate)
cd real-estate

# Install backend dependencies (if not already done)
npm install

# Start the backend server in development mode
npm run dev
```
The backend server will start on `http://localhost:3000`

2. **Start the Frontend Development Server**
```bash
# Open a new terminal
# Navigate to the client directory
cd client

# Install frontend dependencies (if not already done)
npm install

# Start the frontend development server
npm run dev
```
The frontend development server will start on `http://localhost:5173` (or another port if 5173 is in use)

### Important Notes:
- Make sure both servers are running simultaneously
- The backend server handles API requests on port 3000
- The frontend development server runs on port 5173
- Any changes to the frontend code will automatically trigger hot reloading
- Backend changes will automatically restart the server thanks to nodemon

### Common Issues and Solutions:
1. **Port Already in Use**
   - If port 3000 is in use, you can modify the backend port in `api/index.js`
   - If port 5173 is in use, Vite will automatically suggest using a different port

2. **MongoDB Connection**
   - Ensure MongoDB is running and accessible
   - Check your `.env` file has the correct MongoDB connection string

3. **Dependencies Issues**
   - If you encounter dependency errors, try:
     ```bash
     # In the root directory
     rm -rf node_modules
     npm install
     
     # In the client directory
     cd client
     rm -rf node_modules
     npm install
     ```

4. **Environment Variables**
   - Make sure both `.env` files are properly configured:
     - Root directory `.env` for backend
     - `client/.env` for frontend

### Development Workflow:
1. Backend changes are automatically detected and the server restarts
2. Frontend changes trigger hot module replacement (HMR)
3. API calls from frontend to backend are proxied automatically
4. Console logs appear in their respective terminal windows

### Stopping the Application:
- Press `Ctrl + C` in each terminal window to stop the servers
- Make sure to stop both frontend and backend servers when you're done

Remember: Always keep both terminal windows open and running while developing the application locally.


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


