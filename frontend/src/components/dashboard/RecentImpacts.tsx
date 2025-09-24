import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SparklesIcon, 
  PlusCircleIcon, 
  EyeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import api from '../../utils/api';
import { format } from 'date-fns';

interface Impact {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  images?: string[];
}

const RecentImpacts: React.FC = () => {
  const navigate = useNavigate();
  const [recentImpacts, setRecentImpacts] = useState<Impact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentImpacts();
  }, []);

  const loadRecentImpacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard/recent-impacts?limit=5');
      setRecentImpacts(response.data.data);
    } catch (error) {
      console.error('Failed to load recent impacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={itemVariants} 
      className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#4D361E]">Recent Impacts</h2>
        <motion.button
          onClick={() => navigate('/dashboard/impacts')}
          className="text-[#C4A173] hover:text-[#4D361E] text-sm font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
        >
          View All
        </motion.button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : recentImpacts.length === 0 ? (
        <div className="text-center py-8">
          <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No impact stories yet</p>
          <motion.button
            onClick={() => navigate('/dashboard/impacts/new')}
            className="inline-flex items-center px-3 py-2 bg-[#C4A173] text-white rounded-lg text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircleIcon className="w-4 h-4 mr-1" />
            Create First Impact
          </motion.button>
        </div>
      ) : (
        <div className="space-y-4">
          {recentImpacts.map((impact) => (
            <motion.div
              key={impact._id}
              className="border-l-4 border-purple-400 pl-4 py-2 hover:bg-gray-50 rounded-r-lg transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/dashboard/impacts/${impact._id}/edit`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-[#4D361E] mb-1 line-clamp-1">
                    {impact.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                    {impact.content 
                      ? impact.content
                          .replace(/<[^>]*>/g, '') // Remove HTML tags
                          .replace(/\s+/g, ' ') // Normalize whitespace
                          .trim() // Remove leading/trailing whitespace
                          .substring(0, 100) + (impact.content.replace(/<[^>]*>/g, '').trim().length > 100 ? '...' : '')
                      : 'No content'}
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                      Impact Story
                    </span>
                    <span className="flex items-center">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {format(new Date(impact.updatedAt), 'MMM d')}
                    </span>
                  </div>
                </div>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/impact/${impact._id}`);
                  }}
                  className="p-1 text-gray-400 hover:text-purple-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <EyeIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RecentImpacts;