import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  PlusCircleIcon, 
  EyeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import api from '../../utils/api';
import { format } from 'date-fns';

interface Article {
  _id: string;
  title: string;
  content: string;
  author?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  images?: string[];
}

const RecentArticles: React.FC = () => {
  const navigate = useNavigate();
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentArticles();
  }, []);

  const loadRecentArticles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard/recent-articles?limit=5');
      setRecentArticles(response.data.data);
    } catch (error) {
      console.error('Failed to load recent articles:', error);
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
        <h2 className="text-lg font-semibold text-[#4D361E]">Recent Articles</h2>
        <motion.button
          onClick={() => navigate('/dashboard/articles')}
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
      ) : recentArticles.length === 0 ? (
        <div className="text-center py-8">
          <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No articles yet</p>
          <motion.button
            onClick={() => navigate('/dashboard/articles/new')}
            className="inline-flex items-center px-3 py-2 bg-[#C4A173] text-white rounded-lg text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircleIcon className="w-4 h-4 mr-1" />
            Create First Article
          </motion.button>
        </div>
      ) : (
        <div className="space-y-4">
          {recentArticles.map((article) => (
            <motion.div
              key={article._id}
              className="border-l-4 border-[#C4A173] pl-4 py-2 hover:bg-gray-50 rounded-r-lg transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/dashboard/articles/${article._id}/edit`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-[#4D361E] mb-1 line-clamp-1">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                    {article.content 
                      ? article.content
                          .replace(/<[^>]*>/g, '') // Remove HTML tags
                          .replace(/\s+/g, ' ') // Normalize whitespace
                          .trim() // Remove leading/trailing whitespace
                          .substring(0, 100) + (article.content.replace(/<[^>]*>/g, '').trim().length > 100 ? '...' : '')
                      : 'No content'}
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    {article.category && (
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {article.category}
                      </span>
                    )}
                    <span className="flex items-center">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {format(new Date(article.updatedAt), 'MMM d')}
                    </span>
                    {article.author && (
                      <span className="text-gray-500">by {article.author}</span>
                    )}
                  </div>
                </div>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/article/${article._id}`);
                  }}
                  className="p-1 text-gray-400 hover:text-[#C4A173] transition-colors"
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

export default RecentArticles;