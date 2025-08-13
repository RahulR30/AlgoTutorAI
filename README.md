# 🚀 AlgoTutorAI - AI-Powered Algorithm Learning Platform

AlgoTutorAI is a comprehensive web-based platform that helps students learn data structures, algorithms, and technical interview topics through AI-generated problems and adaptive learning. Built with modern web technologies and powered by OpenAI's GPT models, it provides a personalized learning experience that adapts to each student's skill level and progress.

## ✨ Features

### 🧠 AI-Powered Learning
- **Intelligent Problem Generation**: AI creates unique coding problems based on topic, difficulty, and learning objectives
- **Adaptive Difficulty**: Problems automatically adjust to match your skill level
- **Real-time Feedback**: Get instant AI analysis of your code with suggestions for improvement
- **Smart Hints**: Progressive hints that guide you toward solutions without giving them away
- **Personalized Recommendations**: AI suggests problems based on your learning patterns and weak areas

### 📚 Comprehensive Topic Coverage
- **Data Structures**: Arrays, Strings, Linked Lists, Stacks, Queues, Trees, Graphs, Heaps, Hash Tables
- **Algorithms**: Dynamic Programming, Greedy, Backtracking, Two Pointers, Sliding Window, Binary Search
- **Advanced Topics**: Sorting, Recursion, Bit Manipulation, Math, Geometry, Game Theory, System Design
- **Interview Preparation**: All topics commonly covered in technical coding interviews

### 🎯 Learning Features
- **Progress Tracking**: Monitor your improvement with detailed analytics
- **Achievement System**: Earn badges and rewards for milestones
- **Streak Tracking**: Maintain daily learning habits
- **Performance Analytics**: Detailed insights into your strengths and weaknesses
- **Learning Paths**: Structured progression through topics

### 💻 Development Environment
- **Multi-language Support**: JavaScript, Python, Java, C++
- **Code Editor**: Monaco Editor with syntax highlighting and autocomplete
- **Test Execution**: Run your code against test cases
- **Solution Comparison**: Compare your approach with optimal solutions

### 🌟 User Experience
- **Modern UI/UX**: Beautiful, responsive design with dark/light mode
- **Mobile Responsive**: Works seamlessly on all devices
- **Real-time Updates**: Live progress tracking and notifications
- **Community Features**: Leaderboards and user rankings

## 🛠️ Technology Stack

### Backend
- **Node.js** with **Express.js** framework
- **MongoDB** with **Mongoose** ODM
- **OpenAI API** for AI-powered features
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Rate limiting** and security middleware

### Frontend
- **React 18** with modern hooks
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for data fetching
- **Monaco Editor** for code editing
- **Lucide React** for icons

### Development Tools
- **ESLint** for code quality
- **Prettier** for code formatting
- **Nodemon** for backend development
- **Concurrently** for running both servers

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or cloud)
- OpenAI API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/algotutor-ai.git
cd algotutor-ai
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/algotutor-ai

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Client Configuration
CLIENT_URL=http://localhost:3000
```

### 4. Start the Application
```bash
# Development mode (runs both backend and frontend)
npm run dev

# Or run separately:
# Backend only
npm run server

# Frontend only
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
algotutor-ai/
├── server/                 # Backend server
│   ├── config/            # Database and configuration
│   ├── middleware/        # Express middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.js         # Main app component
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── package.json           # Backend dependencies
└── README.md              # This file
```

## 🔧 Configuration

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `algotutor-ai`
3. Update the `MONGODB_URI` in your `.env` file

### OpenAI API Setup
1. Sign up for OpenAI API access
2. Generate an API key
3. Add the key to your `.env` file

### JWT Secret
Generate a strong random string for JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🎯 Usage Guide

### For Students
1. **Create an Account**: Sign up with email and password
2. **Choose Topics**: Select topics you want to learn
3. **Set Difficulty**: Start with beginner level
4. **Practice Problems**: Solve AI-generated problems
5. **Get Feedback**: Review AI analysis of your solutions
6. **Track Progress**: Monitor your improvement over time

### For Educators
1. **Review Problems**: AI-generated problems are reviewed before publication
2. **Custom Problems**: Create custom problems for specific learning objectives
3. **Student Analytics**: Monitor class performance and progress
4. **Adaptive Learning**: Let AI adjust difficulty based on student performance

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Sanitize and validate all inputs
- **CORS Protection**: Configured for production use
- **Helmet.js**: Security headers and protection

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Problems
- `GET /api/problems` - List all problems
- `GET /api/problems/:id` - Get problem details
- `POST /api/problems/:id/submit` - Submit solution
- `GET /api/problems/topics/list` - List all topics

### AI Features
- `POST /api/ai/generate-problem` - Generate new problem
- `POST /api/ai/analyze-solution` - Analyze user solution
- `POST /api/ai/get-hint` - Get problem hint
- `POST /api/ai/recommend-problems` - Get recommendations

### User Management
- `GET /api/users/progress` - Get learning progress
- `GET /api/users/submissions` - Get submission history
- `GET /api/users/achievements` - Get user achievements
- `GET /api/users/leaderboard` - Get leaderboard

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use PM2 or similar process manager
3. Configure MongoDB connection
4. Set up reverse proxy (Nginx)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Serve static files with Nginx or similar
3. Configure API proxy

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
OPENAI_API_KEY=your-openai-api-key
CLIENT_URL=https://yourdomain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- MongoDB for the database
- React and Node.js communities
- All contributors and users

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/algotutor-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/algotutor-ai/discussions)
- **Email**: support@algotutor-ai.com

## 🔮 Roadmap

- [ ] **Mobile App**: React Native mobile application
- [ ] **Video Tutorials**: Integrated video learning content
- [ ] **Collaborative Learning**: Pair programming features
- [ ] **Advanced Analytics**: Machine learning insights
- [ ] **Interview Simulator**: Mock technical interviews
- [ ] **Code Review System**: Peer code review features
- [ ] **Integration APIs**: Connect with other learning platforms

---

**Made with ❤️ for the developer community**

Transform your algorithm learning journey with AI-powered intelligence!