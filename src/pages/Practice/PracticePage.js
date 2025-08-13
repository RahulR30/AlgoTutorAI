import React from 'react';
import { motion } from 'framer-motion';
import { Play, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const PracticePage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Practice Mode
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Start practicing with our curated collection of problems
          </p>
        </motion.div>
      </div>

      <div className="text-center py-12">
        <Play className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Ready to practice?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Browse our problems and start coding!
        </p>
        <Link
          to="/problems"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Play className="w-5 h-5 mr-2" />
          Browse Problems
        </Link>
      </div>
    </div>
  );
};

export default PracticePage;
