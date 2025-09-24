import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { articleService } from '../services/articleService';
import { Navigation } from '../components';
import type { Article } from '../types/dashboard';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await articleService.getPublicArticleById(articleId);
      if (response.data) {
        setArticle(Array.isArray(response?.data) ? response.data[0] : response.data);
      } else {
        setError('Article not found');
      }
    } catch (error) {
      console.error('Failed to load article:', error);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#C5A976] text-[#8B4513] overflow-x-hidden">
        <Navigation />
        <div className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-amber-900 rounded w-1/4 mb-6"></div>
              <div className="h-12 bg-amber-900 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-amber-900 rounded w-1/2 mb-8"></div>
              <div className="h-64 bg-amber-900 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-amber-900 rounded"></div>
                <div className="h-4 bg-amber-900 rounded"></div>
                <div className="h-4 bg-amber-900 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#C5A976] text-[#8B4513] overflow-x-hidden">
        <Navigation />
        <div className="pt-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#4D361E] mb-4">Article Not Found</h1>
              <p className="text-gray-600 mb-8">{error || 'The article you are looking for does not exist.'}</p>
              <motion.button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-6 py-3 bg-[#C4A173] text-white rounded-lg hover:bg-[#4D361E] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Home
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#C5A976] text-[#8B4513] overflow-x-hidden">
      <Navigation />
      <div className="pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <motion.article
          className="overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Image */}
          {/* {article.images && article.images.length > 0 && (
            <div className="w-full h-64 md:h-96 overflow-hidden mt-12">
              <img
                src={article.images[0]}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )} */}

          <div className="p-8 md:p-12">
            {/* Category Badge */}
            {article.category && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-[#C4A173] text-white text-sm font-medium rounded-full">
                  {article.category}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#4D361E] mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-6 border-b border-gray-200">
              {article.author && (
                <div className="flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  <span>{article.author}</span>
                </div>
              )}
              <div className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                <span>{new Date(article.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed prose-headings:text-[#4D361E] prose-p:mb-4 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-strong:text-[#4D361E] prose-strong:font-semibold prose-a:text-[#C4A173] hover:prose-a:text-[#4D361E]"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Additional Images */}
            {article.images && article.images.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-[#4D361E] mb-6">Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {article.images.map((image, index) => (
                    <motion.div
                      key={index}
                      className="rounded-lg overflow-hidden shadow-md"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={image}
                        alt={`${article.title} - Image ${index + 2}`}
                        className="w-full h-48 object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Published: {new Date(article.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.article>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;