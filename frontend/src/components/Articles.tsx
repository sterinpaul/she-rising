import { motion, useInView } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '../services/articleService';
import type { Article } from '../types/dashboard';

const Articles = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigation = useNavigate();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await articleService.getPublicArticles({ limit: 100 }); // Load more to enable pagination
      if (response.data) {
        const articlesArray = Array.isArray(response.data) ? response.data : [response.data];
        setArticles(articlesArray);
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedArticles = articles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top of section
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <section ref={ref} id="articles" className="bg-[#C4A173] py-20">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Title Section */}
        <div className="mb-16">
          <motion.h1 
            variants={titleVariants}
            className="text-5xl font-bold text-white mb-4 tracking-wide"
            whileHover={{ 
              scale: 1.02,
              textShadow: "0px 0px 20px rgba(255, 255, 255, 0.3)",
              transition: { duration: 0.3 }
            }}
          >
            ARTICLES & BLOGS
          </motion.h1>
          
          <motion.h2 
            variants={textVariants}
            className="text-lg md:text-xl text-white font-medium mb-6"
          >
            BRIDGING RESEARCH AND RESISTANCE
          </motion.h2>
          
          <motion.p 
            variants={textVariants}
            className="text-black text-base md:text-lg leading-relaxed max-w-7xl"
          >
            This is where academia meets activism. Our blog features short articles, reflections, and summaries of peer-reviewed journals that connect scholarly 
            work with real-world issues. Whether you're a student, educator, or curious reader, our articles help you understand key social topics without the 
            academic jargon.
          </motion.p>
        </div>

        {/* Articles Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12"
          variants={containerVariants}
        >
          {loading ? (
            // Loading skeleton
            [...Array(itemsPerPage)].map((_, index) => (
              <motion.div
                key={index}
                className="bg-gray-200 rounded-2xl h-48 animate-pulse"
                variants={cardVariants}
              />
            ))
          ) : (
            displayedArticles.map((article, index) => (
              <motion.div
                key={article._id}
                variants={cardVariants}
                transition={{ delay: (index % 10) * 0.05 }}
                className="group"
                whileHover={{ 
                  scale: 1.03,
                  y: -5,
                  transition: { duration: 0.3 }
                }}
                onClick={()=>navigation(`/article/${article._id}`)}
              >
                <div className="bg-white rounded-2xl h-48 flex flex-col justify-end shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  {/* Article image or placeholder */}
                  <div className="flex-grow mb-4 bg-gray-200 rounded-lg">
                    {article.images && article.images.length > 0 ? (
                      <img 
                        src={article.images[0]} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                  </div>
                  
                  {/* Article info */}
                  <div className='px-4 pb-4'>
                    <h3 className="text-black font-bold text-sm mb-2 leading-tight line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600 font-medium">{article.category || 'Article'}</span>
                      <span className="text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            {/* Previous Button */}
            <motion.button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white text-[#4D361E] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors border border-gray-300"
              whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
            >
              ‹ Previous
            </motion.button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((page, index) => (
                <div key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-[#4D361E]">...</span>
                  ) : (
                    <motion.button
                      onClick={() => handlePageChange(page as number)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-[#4D361E] text-white'
                          : 'bg-white text-[#4D361E] hover:bg-[#E8DDD4] border border-[#C4A173]'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {page}
                    </motion.button>
                  )}
                </div>
              ))}
            </div>

            {/* Next Button */}
            <motion.button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white text-[#4D361E] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors border border-gray-300"
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            >
              Next ›
            </motion.button>
          </div>
        )}

        {/* Page Info */}
        {articles.length > 0 && (
          <div className="text-center mt-4">
            <p className="text-white text-sm">
              Showing {startIndex + 1}-{Math.min(endIndex, articles.length)} of {articles.length} articles
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Articles;