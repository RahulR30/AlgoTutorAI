import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, Users, BookOpen } from 'lucide-react';
import { problemsAPI } from '../../services/api';

const TopicsPage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      console.log('🔍 Fetching topics list from API...');
      const response = await problemsAPI.getTopics();
      const data = response.data;
      console.log('✅ Topics page: Fetched topics:', data.topics?.length || 0);
      console.log('📊 Sample topic data:', data.topics?.[0]);
      setTopics(data.topics || []);
    } catch (error) {
      console.error('❌ Error fetching topics:', error);
      console.error('   Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTopicIcon = (topic) => {
    const topicIcons = {
      'arrays': '🔢', 'strings': '📝', 'linked-lists': '🔗', 'stacks': '📚',
      'queues': '📋', 'trees': '🌳', 'graphs': '🕸️', 'heaps': '📊',
      'hash-tables': '🗂️', 'dynamic-programming': '⚡', 'greedy': '🎯',
      'backtracking': '🔄', 'two-pointers': '👆', 'sliding-window': '🪟',
      'binary-search': '��', 'sorting': '📈', 'recursion': '🔄',
      'bit-manipulation': '⚙️', 'math': '🧮', 'geometry': '��',
      'game-theory': '🎮', 'system-design': '��️'
    };
    return topicIcons[topic] || '📚';
  };

  const getTopicStats = (topicName) => {
    const topic = topics.find(t => t.name === topicName);
    if (!topic) {
      console.log(`📊 Topic "${topicName}": Not found in topics data`);
      return { total: 0, easy: 0, medium: 0, hard: 0 };
    }
    
    console.log(`📊 Topic "${topicName}": Found in topics data:`, topic);
    
    // Handle both old and new data formats
    let easy = 0, medium = 0, hard = 0;
    
    if (Array.isArray(topic.counts)) {
      // Old format: counts is an array of objects
      if (topic.counts.length > 0 && typeof topic.counts[0] === 'object') {
        easy = topic.counts[0]?.easy || 0;
        medium = topic.counts[0]?.medium || 0;
        hard = topic.counts[0]?.hard || 0;
      } else {
        // Old format: counts is an array of difficulty strings
        easy = topic.counts.filter(c => c === 'easy').length;
        medium = topic.counts.filter(c => c === 'medium').length;
        hard = topic.counts.filter(c => c === 'hard').length;
      }
    } else if (typeof topic.counts === 'object') {
      // New format: counts is a single object
      easy = topic.counts?.easy || 0;
      medium = topic.counts?.medium || 0;
      hard = topic.counts?.hard || 0;
    }
    
    return {
      total: topic.total || 0,
      easy,
      medium,
      hard
    };
  };

  const allTopics = [
    'arrays', 'strings', 'linked-lists', 'stacks', 'queues', 'trees', 'graphs', 
    'heaps', 'hash-tables', 'dynamic-programming', 'greedy', 'backtracking', 
    'two-pointers', 'sliding-window', 'binary-search', 'sorting', 'recursion', 
    'bit-manipulation', 'math', 'geometry', 'game-theory', 'system-design'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Learning Topics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Master each topic with our comprehensive problem collection
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTopics.map((topic, index) => {
          const stats = getTopicStats(topic);
          const icon = getTopicIcon(topic);
          
          return (
            <motion.div
              key={topic}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">{icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {topic.replace('-', ' ')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.total} problems
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                <span className="text-green-600">Easy: {stats.easy}</span>
                <span className="text-yellow-600">Medium: {stats.medium}</span>
                <span className="text-red-600">Hard: {stats.hard}</span>
              </div>

                             <Link
                 to={`/problems?topics=${topic}`}
                 className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
               >
                <Code className="w-4 h-4 mr-2" />
                Practice {topic.replace('-', ' ')}
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{topics.reduce((sum, t) => sum + (t.total || 0), 0)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Problems</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{topics.reduce((sum, t) => {
              if (Array.isArray(t.counts) && t.counts.length > 0 && typeof t.counts[0] === 'object') {
                return sum + (t.counts[0]?.easy || 0);
              }
              return sum + (t.counts?.easy || 0);
            }, 0)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Easy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{topics.reduce((sum, t) => {
              if (Array.isArray(t.counts) && t.counts.length > 0 && typeof t.counts[0] === 'object') {
                return sum + (t.counts[0]?.medium || 0);
              }
              return sum + (t.counts?.medium || 0);
            }, 0)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Medium</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{topics.reduce((sum, t) => {
              if (Array.isArray(t.counts) && t.counts.length > 0 && typeof t.counts[0] === 'object') {
                return sum + (t.counts[0]?.hard || 0);
              }
              return sum + (t.counts?.hard || 0);
            }, 0)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Hard</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;
