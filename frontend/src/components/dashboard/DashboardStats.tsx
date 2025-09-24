import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  DocumentTextIcon,
  SparklesIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import api from '../../utils/api';
import type { DashboardStats as StatsType } from '../../types/dashboard';

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-6 bg-gray-200 rounded" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200 mb-8">
        <p className="text-[#6B3410] text-lg">Failed to load statistics</p>
        <button
          onClick={loadStats}
          className="mt-4 px-4 py-2 bg-[#C4A173] text-white rounded-lg hover:bg-[#4D361E] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      icon: DocumentTextIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Total Impacts',
      value: stats.totalImpacts,
      icon: SparklesIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <motion.div
            key={stat.title}
            variants={cardVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 group"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                
                <h3 className="text-[#6B3410] text-sm font-medium mb-2">
                  {stat.title}
                </h3>
                
                <div className="flex items-baseline space-x-2">
                  <motion.span 
                    className="text-2xl font-bold text-[#4D361E]"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
                  >
                    {typeof stat.value === 'number' && stat.value > 100 ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        {stat.value.toLocaleString()}
                      </motion.span>
                    ) : (
                      stat.value
                    )}
                  </motion.span>
                  
                  {/* Growth indicator for views */}
                  {stat.title === 'Recent Views' && (
                    <div className="flex items-center text-green-600">
                      <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">+12%</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Decorative gradient */}
              <div className={`w-1 h-16 bg-gradient-to-b ${stat.color} rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default DashboardStats;