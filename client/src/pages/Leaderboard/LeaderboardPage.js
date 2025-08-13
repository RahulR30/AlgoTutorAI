import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users } from 'lucide-react';

const LeaderboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Leaderboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            See how you rank among other learners
          </p>
        </motion.div>
      </div>

      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Leaderboard coming soon!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Global rankings and competitive features will be available in the next update.
        </p>
      </div>
    </div>
  );
};

export default LeaderboardPage;
