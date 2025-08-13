import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Trophy, 
  BookOpen, 
  Code,
  Calendar,
  BarChart3,
  Play,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Problems Solved', value: user?.learningStats?.totalProblemsSolved || 0, icon: Trophy, color: 'text-yellow-600' },
    { label: 'Current Streak', value: user?.learningStats?.currentStreak || 0, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Time Spent', value: `${Math.floor((user?.learningStats?.totalTimeSpent || 0) / 60)}h`, icon: Clock, color: 'text-blue-600' },
    { label: 'Topics Covered', value: user?.topicProgress?.length || 0, icon: BookOpen, color: 'text-purple-600' }
  ];

  const recentActivity = [
    { type: 'problem', title: 'Two Sum', topic: 'Arrays', status: 'completed', time: '2 hours ago' },
    { type: 'problem', title: 'Valid Parentheses', topic: 'Stacks', status: 'attempted', time: '1 day ago' },
    { type: 'achievement', title: 'First Problem Solved', status: 'earned', time: '2 days ago' }
  ];

  const quickActions = [
    { title: 'Start Practice', description: 'Begin solving problems', icon: Play, href: '/practice', color: 'bg-blue-500' },
    { title: 'Browse Topics', description: 'Explore learning topics', icon: BookOpen, href: '/topics', color: 'bg-green-500' },
    { title: 'View Problems', description: 'See all available problems', icon: Code, href: '/problems', color: 'bg-purple-500' },
    { title: 'Check Progress', description: 'Review your learning stats', icon: BarChart3, href: '/profile', color: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.profile?.firstName || user?.username || 'Student'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Ready to continue your algorithm learning journey?
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.a
              key={action.title}
              href={action.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
            >
              <div className={`p-2 rounded-lg ${
                activity.status === 'completed' ? 'bg-green-100 dark:bg-green-900' :
                activity.status === 'attempted' ? 'bg-yellow-100 dark:bg-yellow-900' :
                'bg-blue-100 dark:bg-blue-900'
              }`}>
                {activity.type === 'problem' ? (
                  <Code className={`w-4 h-4 ${
                    activity.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                    activity.status === 'attempted' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-blue-600 dark:text-blue-400'
                  }`} />
                ) : (
                  <Trophy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.topic && `${activity.topic} • `}{activity.status} • {activity.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Daily Goal */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Daily Learning Goal</h2>
              <p className="text-blue-100">Complete 3 problems today to maintain your streak!</p>
              <div className="mt-4 flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span className="text-sm">Progress: 1/3 problems</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{user?.learningStats?.currentStreak || 0}</div>
              <div className="text-blue-100 text-sm">Day Streak</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
