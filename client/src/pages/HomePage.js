import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code, 
  Brain,
  Target, 
  TrendingUp, 
  Users, 
  Zap,
  ArrowRight,
  Play,
  BookOpen,
  Trophy,
  BarChart3,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const currentFeatures = [
    {
      icon: Code,
      title: 'Coding Problems',
      description: 'Access a collection of algorithm and data structure problems with examples and test cases.',
      color: 'from-blue-500 to-blue-600',
      status: 'available'
    },
    {
      icon: Target,
      title: 'Problem Categories',
      description: 'Problems organized by difficulty (Easy, Medium, Hard) and topic areas.',
      color: 'from-green-500 to-green-600',
      status: 'available'
    },
    {
      icon: TrendingUp,
      title: 'Basic Progress',
      description: 'Track which problems you\'ve attempted and completed.',
      color: 'from-orange-500 to-orange-600',
      status: 'available'
    },
    {
      icon: Users,
      title: 'User Accounts',
      description: 'Create an account to save your progress and track your learning journey.',
      color: 'from-purple-500 to-purple-600',
      status: 'available'
    },
    {
      icon: Zap,
      title: 'Code Editor',
      description: 'Built-in code editor supporting JavaScript, Python, Java, and C++.',
      color: 'from-yellow-500 to-yellow-600',
      status: 'available'
    },
    {
      icon: BookOpen,
      title: 'Learning Resources',
      description: 'Problem descriptions, examples, and hints to help you understand concepts.',
      color: 'from-indigo-500 to-indigo-600',
      status: 'available'
    }
  ];

  const plannedFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Intelligent problem generation and personalized feedback (Coming Soon).',
      color: 'from-gray-400 to-gray-500',
      status: 'planned'
    },
    {
      icon: Target,
      title: 'Adaptive Difficulty',
      description: 'Problems that adjust to your skill level (Coming Soon).',
      color: 'from-gray-400 to-gray-500',
      status: 'planned'
    },
    {
      icon: Trophy,
      title: 'Leaderboards',
      description: 'Compete with other learners (Coming Soon).',
      color: 'from-gray-400 to-gray-500',
      status: 'planned'
    }
  ];

  const topics = [
    { name: 'Arrays & Strings', count: '50+', icon: '🔢' },
    { name: 'Linked Lists', count: '20+', icon: '🔗' },
    { name: 'Trees & Graphs', count: '30+', icon: '🌳' },
    { name: 'Dynamic Programming', count: '25+', icon: '⚡' },
    { name: 'Sorting & Searching', count: '20+', icon: '🔍' },
    { name: 'System Design', count: '15+', icon: '🏗️' }
  ];

  const currentStats = [
    { label: 'Total Problems', value: '294', icon: Target },
    { label: 'Topics Covered', value: '15+', icon: BookOpen },
    { label: 'Difficulty Levels', value: '3', icon: TrendingUp },
    { label: 'Programming Languages', value: '4', icon: Code }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Learn Algorithms with{' '}
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Practice
              </span>{' '}
              and Persistence
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              A platform for practicing coding problems, learning data structures and algorithms, 
              and preparing for technical interviews through hands-on problem solving.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/practice"
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Practicing
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link
                    to="/problems"
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold border-2 border-primary-600 text-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all duration-200"
                  >
                    Browse Problems
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Current Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What We Currently Offer
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Transparent information about our current platform capabilities
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {currentStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Current Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Available Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              These features are fully functional and ready to use right now.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-200 border-l-4 border-green-500"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Planned Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Coming Soon
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're actively developing these advanced features to enhance your learning experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plannedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-soft border-l-4 border-gray-400"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <AlertCircle className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Available Topics
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Practice problems across various algorithm and data structure topics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 shadow-soft"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{topic.icon}</span>
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {topic.count}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {topic.name}
                </h3>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/topics"
              className="inline-flex items-center px-6 py-3 text-lg font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Explore All Topics
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Honest CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Practicing?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join our community of learners who are building their algorithm skills through practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-primary-600 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-primary-600 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
                  >
                    Create Free Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link
                    to="/problems"
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-200"
                  >
                    Browse Problems
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
