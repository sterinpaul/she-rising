import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { impactService } from '../services/impactService';
import { Navigation } from '../components';
import type { Impact } from '../types/dashboard';

const ImpactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [impact, setImpact] = useState<Impact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadImpact(id);
    }
  }, [id]);

  const loadImpact = async (impactId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await impactService.getPublicImpactById(impactId);
      if (response.data) {
        setImpact(Array.isArray(response.data) ? response.data[0] : response.data);
      } else {
        setError('Impact not found');
      }
    } catch (error) {
      console.error('Failed to load impact:', error);
      setError('Failed to load impact');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8DDD4] text-[#8B4513] overflow-x-hidden">
        <Navigation />
        <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }

  if (error || !impact) {
    return (
      <div className="min-h-screen bg-[#E8DDD4] text-[#8B4513] overflow-x-hidden">
        <Navigation />
        <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#4D361E] mb-4">Impact Story Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The impact story you are looking for does not exist.'}</p>
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
    <div className="min-h-screen bg-[#E8DDD4] text-[#8B4513] overflow-x-hidden">
      <Navigation />
      <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <motion.article
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Image */}
          {impact.images && impact.images.length > 0 && (
            <div className="w-full h-64 md:h-96 overflow-hidden">
              <img
                src={impact.images[0]}
                alt={impact.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium rounded-full">
                Impact Story
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#4D361E] mb-6 leading-tight">
              {impact.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                <span>{new Date(impact.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed prose-headings:text-[#4D361E] prose-p:mb-4 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-strong:text-[#4D361E] prose-strong:font-semibold prose-a:text-purple-500 hover:prose-a:text-purple-700"
              dangerouslySetInnerHTML={{ __html: impact.content }}
            />

            {/* Additional Images */}
            {impact.images && impact.images.length > 1 && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-[#4D361E] mb-6">Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {impact.images.slice(1).map((image, index) => (
                    <motion.div
                      key={index}
                      className="rounded-lg overflow-hidden shadow-md"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={image}
                        alt={`${impact.title} - Image ${index + 2}`}
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
                  Last updated: {new Date(impact.createdAt).toLocaleDateString('en-US', {
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

export default ImpactDetail;