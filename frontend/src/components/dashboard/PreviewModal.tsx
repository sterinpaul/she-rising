import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import type { Article, Impact } from '../../types/dashboard';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Partial<Article> | Partial<Impact> | null;
  type: 'article' | 'impact';
}

const PreviewModal: React.FC<PreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  data, 
  type 
}) => {
  if (!data) return null;

  const isArticle = type === 'article';
  const articleData = isArticle ? data as Partial<Article> : null;
  const impactData = !isArticle ? data as Partial<Impact> : null;

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative rounded-2xl shadow-2xl max-w-5xl max-h-[90vh] w-full mx-4 overflow-hidden"
            style={{ backgroundColor: isArticle ? '#C5A976' : '#E8DDD4' }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#C4A173] to-[#4D361E] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <h2 className="text-lg font-bold">
                  {isArticle ? 'Article Preview' : 'Impact Preview'}
                </h2>
              </div>
              
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <XMarkIcon className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-88px)] p-6">
              <motion.article
                className={`overflow-hidden ${!isArticle ? 'bg-white rounded-2xl shadow-lg' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Hero Image for Impact only */}
                {!isArticle && impactData && data.images && data.images.length > 0 && (
                  <div className="w-full h-64 md:h-96 overflow-hidden">
                    <img
                      src={data.images[0]}
                      alt={data.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-8 md:p-12">
                  {/* Category Badge */}
                  <div className="mb-4">
                    {isArticle ? (
                      articleData?.category && (
                        <span className="inline-block px-3 py-1 bg-[#C4A173] text-white text-sm font-medium rounded-full">
                          {articleData.category}
                        </span>
                      )
                    ) : (
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium rounded-full">
                        Impact Story
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-bold text-[#4D361E] mb-6 leading-tight">
                    {data.title || 'Untitled'}
                  </h1>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-6 border-b border-gray-200">
                    {isArticle && articleData?.author && (
                      <div className="flex items-center">
                        <UserIcon className="w-5 h-5 mr-2" />
                        <span>{articleData.author}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      <span>
                        {isArticle 
                          ? new Date().toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : formatDate(impactData?.date) || new Date().toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                        }
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`prose prose-lg max-w-none text-gray-800 leading-relaxed prose-headings:text-[#4D361E] prose-p:mb-4 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-strong:text-[#4D361E] prose-strong:font-semibold ${
                    isArticle 
                      ? 'prose-a:text-[#C4A173] hover:prose-a:text-[#4D361E]' 
                      : 'prose-a:text-purple-500 hover:prose-a:text-purple-700'
                  }`}>
                    {data.content ? (
                      <div dangerouslySetInnerHTML={{ __html: data.content }} />
                    ) : (
                      <div className="text-gray-500 italic text-center py-12">
                        No content available to preview
                      </div>
                    )}
                  </div>

                  {/* Additional Images */}
                  {data.images && data.images.length > 0 && (
                    <div className="mt-12">
                      <h3 className="text-xl font-semibold text-[#4D361E] mb-6">
                        {isArticle ? 'Images' : 'Gallery'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(isArticle ? data.images : data.images.slice(1)).map((image, index) => (
                          <motion.div
                            key={index}
                            className="rounded-lg overflow-hidden shadow-md"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                          >
                            <img
                              src={image}
                              alt={`${data.title} - Image ${index + (isArticle ? 1 : 2)}`}
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
                        {isArticle ? 'Published:' : 'Last updated:'} {new Date().toLocaleDateString('en-US', {
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

            {/* Footer */}
            <div className="sticky bottom-0 bg-black/80 backdrop-blur-sm border-t border-gray-700 p-4 flex justify-between items-center">
              <div className="text-sm text-gray-300">
                Preview Mode • Changes are not saved yet
              </div>
              
              <motion.button
                onClick={onClose}
                className="px-6 py-2 bg-[#C4A173] text-white rounded-lg hover:bg-[#4D361E] transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue Editing
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreviewModal;