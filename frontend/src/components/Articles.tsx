import { motion, useInView } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '../services/articleService';
import type { Article } from '../types/dashboard';

const Articles = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigation = useNavigate()

  const [visibleArticles, setVisibleArticles] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);

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
      setIsLoading(true);
      const response = await articleService.getPublicArticles({ limit: 20 });
      if (response.data) {
        const articlesArray = Array.isArray(response.data) ? response.data : [response.data];
        setArticles(articlesArray);
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayedArticles = articles.slice(0, visibleArticles);
  const hasMoreArticles = visibleArticles < articles.length;

  const loadMoreArticles = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setVisibleArticles(prev => Math.min(prev + 20, articles.length));
      setIsLoading(false);
    }, 800);
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
          {displayedArticles.map((article, index) => (
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
          ))}
        </motion.div>

        {/* Load More Button */}
        {hasMoreArticles && (
          <div className="grid place-items-center">
            <motion.button
              onClick={loadMoreArticles}
              disabled={isLoading}
              className="w-16 h-16 bg-[#C4A173] rounded-full flex items-center justify-center shadow-lg hover:bg-[#6B3410] transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={isLoading ? { rotate: 360 } : {}}
              transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
            >
              <img src="/icons/arrow.svg" className="-rotate-90" alt="Arrow Right" />
            </motion.button>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Articles;