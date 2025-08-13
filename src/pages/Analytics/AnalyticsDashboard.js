import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Brain, 
  Award, 
  Clock, 
  Users, 
  Code, 
  Zap,
  Apple,
  Facebook,
  ShoppingCart,
  Search,
  Building2,
  Play
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { aiAPI } from '../../services/api';

const AnalyticsDashboard = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [interviewReadiness, setInterviewReadiness] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('overall');
  const [selectedRole, setSelectedRole] = useState('software-engineer');

  useEffect(() => {
    fetchAnalyticsData();
    fetchInterviewReadiness();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await aiAPI.getLearningInsights();
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviewReadiness = async () => {
    try {
      const response = await aiAPI.assessInterviewReadiness({
        company: selectedCompany,
        role: selectedRole,
        level: 'mid-level'
      });
      setInterviewReadiness(response.data);
    } catch (error) {
      console.error('Error fetching interview readiness:', error);
    }
  };

  const companyIcons = {
    apple: Apple,
    meta: Facebook,
    amazon: ShoppingCart,
    google: Search,
    microsoft: Building2,
    netflix: Play
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
            AI-Powered Learning Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your progress, identify weak areas, and assess interview readiness
          </p>
        </motion.div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData?.insights?.overallProgress || 75}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Problems Solved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData?.userProfile?.totalProblemsSolved || 0}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData?.userProfile?.currentStreak || 0} days
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Interview Ready</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {interviewReadiness?.assessment?.overallReadiness || 0}%
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Topic Performance Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Topic Performance Analysis
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={interviewReadiness?.topicReadiness ? 
            Object.entries(interviewReadiness.topicReadiness).map(([topic, data]) => ({
              topic: topic.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              score: data.score,
              fullMark: 100
            })) : []
          }>
            <PolarGrid />
            <PolarAngleAxis dataKey="topic" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Performance"
              dataKey="score"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Company Interview Readiness */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Company Interview Readiness
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interviewReadiness?.assessment?.companyReadiness && 
            Object.entries(interviewReadiness.assessment.companyReadiness).map(([company, score]) => {
              const IconComponent = companyIcons[company.toLowerCase()] || Code;
              const getScoreColor = (score) => {
                if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
                if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
                return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
              };
              
              return (
                <div key={company} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <IconComponent className="w-5 h-5 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {company}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </motion.div>

      {/* Progress Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Learning Progress Timeline
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData?.progressTimeline || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="problemsSolved"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          AI Learning Recommendations
        </h2>
        <div className="space-y-4">
          {analyticsData?.insights?.recommendations?.map((recommendation, index) => (
            <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-blue-800 dark:text-blue-200 font-medium">
                    {recommendation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weak Areas Focus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Focus Areas for Improvement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Weak Areas</h3>
            <div className="space-y-2">
              {analyticsData?.insights?.weaknesses?.map((weakness, index) => (
                <div key={index} className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-red-800 dark:text-red-200">{weakness}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Next Steps</h3>
            <div className="space-y-2">
              {analyticsData?.insights?.nextSteps?.map((step, index) => (
                <div key={index} className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-green-800 dark:text-green-200">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;
