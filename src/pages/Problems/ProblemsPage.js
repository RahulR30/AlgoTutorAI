import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { problemsAPI } from '../../services/api';

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [totalProblems, setTotalProblems] = useState(0);

  // Debug: Log the API URL being used
  useEffect(() => {
    console.log('🔍 API Configuration:');
    console.log('   REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    console.log('   Current API base:', process.env.REACT_APP_API_URL || 'http://localhost:5001/api');
  }, []);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      console.log('📡 Fetching problems from API...');
      // Use the problemsAPI service instead of hardcoded fetch
      const response = await problemsAPI.getAll({ limit: 1000 });
      const data = response.data;
      setProblems(data.problems || []);
      setTotalProblems(data.pagination?.totalProblems || 0);
      console.log(`✅ Fetched ${data.problems?.length || 0} problems out of ${data.pagination?.totalProblems || 0} total`);
    } catch (error) {
      console.error('❌ Error fetching problems:', error);
      console.error('   Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
    const matchesTopic = selectedTopic === 'all' || (problem.topics && problem.topics.includes(selectedTopic));
    
    return matchesSearch && matchesDifficulty && matchesTopic;
  });

  // Debug logging for filtering
  useEffect(() => {
    if (problems.length > 0) {
      console.log(`Filtering ${problems.length} problems:`);
      console.log(`- Search term: "${searchTerm}"`);
      console.log(`- Difficulty: ${selectedDifficulty}`);
      console.log(`- Topic: ${selectedTopic}`);
      console.log(`- Filtered result: ${filteredProblems.length} problems`);
    }
  }, [problems, searchTerm, selectedDifficulty, selectedTopic, filteredProblems]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getTopicIcon = (topic) => {
    if (!topic) return '📚';
    
    const topicIcons = {
      'arrays': '🔢',
      'strings': '📝',
      'linked-lists': '🔗',
      'stacks': '📚',
      'queues': '📋',
      'trees': '🌳',
      'graphs': '🕸️',
      'heaps': '📊',
      'hash-tables': '🗂️',
      'dynamic-programming': '⚡',
      'greedy': '🎯',
      'backtracking': '🔄',
      'two-pointers': '👆',
      'sliding-window': '🪟',
      'binary-search': '🔍',
      'sorting': '📈',
      'recursion': '🔄',
      'bit-manipulation': '⚙️',
      'math': '🧮',
      'geometry': '📐',
      'game-theory': '🎮',
      'system-design': '🏗️'
    };
    return topicIcons[topic] || '📚';
  };

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
            Coding Problems
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Practice with our collection of algorithm and data structure problems
          </p>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredProblems.length} of {totalProblems} problems
            </div>
            <button
              onClick={fetchProblems}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Refresh Problems
            </button>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="flex gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Topics</option>
              <option value="arrays">Arrays</option>
              <option value="strings">Strings</option>
              <option value="linked-lists">Linked Lists</option>
              <option value="stacks">Stacks</option>
              <option value="queues">Queues</option>
              <option value="trees">Trees</option>
              <option value="graphs">Graphs</option>
              <option value="heaps">Heaps</option>
              <option value="hash-tables">Hash Tables</option>
              <option value="dynamic-programming">Dynamic Programming</option>
              <option value="greedy">Greedy</option>
              <option value="backtracking">Backtracking</option>
              <option value="two-pointers">Two Pointers</option>
              <option value="sliding-window">Sliding Window</option>
              <option value="binary-search">Binary Search</option>
              <option value="sorting">Sorting</option>
              <option value="recursion">Recursion</option>
              <option value="bit-manipulation">Bit Manipulation</option>
              <option value="math">Math</option>
              <option value="geometry">Geometry</option>
              <option value="game-theory">Game Theory</option>
              <option value="system-design">System Design</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDifficulty('all');
                setSelectedTopic('all');
              }}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProblems.map((problem, index) => (
          <motion.div
            key={problem._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getTopicIcon(problem.topics && problem.topics[0])}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {problem.topics && problem.topics[0] ? problem.topics[0].replace('-', ' ') : 'General'}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {problem.description}
            </p>

            {problem.examples && problem.examples.length > 0 && problem.examples[0] && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example:</p>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Input:</strong> {problem.examples[0].input || 'N/A'}</p>
                  <p><strong>Output:</strong> {problem.examples[0].output || 'N/A'}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{problem.statistics?.totalSubmissions || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{problem.statistics?.successRate || 0}%</span>
                </div>
              </div>
              
              <Link
                to={`/problems/${problem._id}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {/* Code icon removed as per new_code */}
                Start Solving
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          {/* BookOpen icon removed as per new_code */}
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No problems found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or filters.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Total problems loaded: {problems.length}</p>
            <p>Current filters: Difficulty={selectedDifficulty}, Topic={selectedTopic}</p>
            <p>Search term: "{searchTerm}"</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProblemsPage;
