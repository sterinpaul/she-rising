import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  SparklesIcon, 
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentArticles from '../components/dashboard/RecentArticles';
import RecentImpacts from '../components/dashboard/RecentImpacts';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#C4A173] to-[#4D361E] rounded-xl p-4 md:p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-white/90 text-sm md:text-base">
              Here's what's happening with your content today.
            </p>
          </div>
          <div className="hidden md:block">
            <motion.div
              className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <ArrowTrendingUpIcon className="w-8 h-8" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <DashboardStats />

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-[#4D361E] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            onClick={() => navigate('/dashboard/articles/new')}
            className="flex items-center p-3 md:p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <DocumentTextIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-blue-900 text-sm md:text-base">New Article</p>
              <p className="text-blue-600 text-xs md:text-sm">Create a blog post</p>
            </div>
          </motion.button>

          <motion.button
            onClick={() => navigate('/dashboard/impacts/new')}
            className="flex items-center p-3 md:p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SparklesIcon className="w-6 h-6 md:w-8 md:h-8 text-purple-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-purple-900 text-sm md:text-base">New Impact</p>
              <p className="text-purple-600 text-xs md:text-sm">Share an impact story</p>
            </div>
          </motion.button>

          <motion.button
            onClick={() => navigate('/dashboard/articles')}
            className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg hover:from-green-100 hover:to-green-200 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <DocumentTextIcon className="w-8 h-8 text-green-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-green-900">Manage Articles</p>
              <p className="text-green-600 text-sm">View all articles</p>
            </div>
          </motion.button>

          <motion.button
            onClick={() => navigate('/dashboard/impacts')}
            className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SparklesIcon className="w-8 h-8 text-orange-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-orange-900">Manage Impacts</p>
              <p className="text-orange-600 text-sm">View all impacts</p>
            </div>
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Recent Articles */}
        <RecentArticles />

        {/* Recent Impacts */}
        <RecentImpacts />
      </div>
    </motion.div>
  );
};

export default Dashboard;