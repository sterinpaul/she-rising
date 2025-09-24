
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation } from '../components';

// Interface for article data
interface ArticleData {
  id: string;
  title: string;
  createdAt: string;
  content: string;
  images: string[];
  author?: string;
  category?: string;
}

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  // Load article details from server
  useEffect(() => {
    const fetchArticleDetails = async () => {
      if (!id) {
        setError('No article ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Simulate API call - replace with actual server endpoint
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data based on the reference image
        const mockData: ArticleData = {
          id,
          title: "Why Mensuration Education Matters In Canada And Beyond",
          createdAt: "September 15, 2024",
          author: "Dr. Sarah Johnson",
          category: "Education & Health",
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In augue tellus, aliquam vitae ligula eu, laoreet ultricies arcu. Aliquam convallis, turpis eu maximus dictum, dui metus vehicula libero, ac convallis est ligula at eros. Nulla convallis lacus eget magna accumsan, suscipit placerat sapien scelerisque. Phasellus elementum volutpat tempus. Phasellus dignissim fermentum orci, facilisis sodales sapien eleifend eu. Aenean volutpat, nisl a lobortis egestas, eros sapien gravida ex, et placerat nisl lacus ut odio. Nunc id magna quis mi lacinia sodales. Integer dui velit, imperdiet a ipsum vitae, aliquam faucibus elit. Quisque fermentum in est in mattis. Morbi sagittis iaculis dolor id venenatis. Praesent ullamcorper hendrerit sapien, ac hendrerit mauris lobortis pretium. Sed placerat ipsum ac arcu vulputate, nec iaculis nisl volutpat.

Donec pellentesque vehicula tempor. Duis luctus urna efficitur, consectetur libero in, feugiat risus. Donec sodales tempus nisl at volutpat. Duis bibendum ex risus, nec euismod tortor sollicitudin ac. Fusce nec sem egestas, aliquam tortor in, mollis nunc. Fusce auctor interdum massa vitae mattis. Suspendisse faucibus risus ac lectus eleifend tempus. Aenean iaculis elit nec pellentesque auctor. Fusce sodales nisl nulla, vel volutpat lacus suscipit ut. Quisque euismod metus sed purus sodales dignissim. Vivamus aliquet vitae augue quis venenatis.

Donec sed lacinia ante, vel semper ex. Donec venenatis vel mi et accumsan. Suspendisse ut nunc porta, tincidunt metus quis, pretium nulla. Nullam viverra sem a mi condimentum accumsan. Praesent pharetra tempor erat nec vehicula. Cras sit amet nisl felis. Nulla aliquam eros vitae nisl vehicula, sit amet fermentum nunc pretium. Vivamus blandit volutpat velit, eu faucibus nisl ornare eu. Maecenas vitae massa velit. Donec est purus, imperdiet nec purus id, pharetra sagittis enim. Nam pellentesque molestie justo. Quisque sed quam vitae elit rhoncus rhoncus.`,
          images: Array(8).fill('/api/placeholder/300/200') // Placeholder images
        };

        setArticleData(mockData);
      } catch (err) {
        setError('Failed to load article details');
        console.error('Error fetching article details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#C4A173] flex items-center justify-center">
        <div className="text-[#4D361E] text-lg">Loading article details...</div>
      </div>
    );
  }

  if (error || !articleData) {
    return (
      <div className="min-h-screen bg-[#C4A173] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error || 'Article not found'}</div>
          <button 
            onClick={() => navigate('/')}
            className="bg-[#C4A173] text-white px-6 py-2 rounded-lg hover:bg-[#4D361E] transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#C4A173]">
      <Navigation />
      
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a0704] leading-tight"
            whileHover={{
              scale: 1.01,
              textShadow: "0px 0px 15px rgba(77, 54, 30, 0.2)",
              transition: { duration: 0.3 },
            }}
          >
            {articleData.title}
          </motion.h1>
        </motion.div>

        {/* Content Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          <div className="backdrop-blur-sm p-8 md:p-12">
            <motion.div 
              className="text-[#4D361E] text-base md:text-lg leading-relaxed whitespace-pre-line"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
            >
              {articleData.content}
            </motion.div>
          </div>
        </motion.div>

        {/* Images Grid Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {articleData.images.map((_, index) => (
              <motion.div
                key={index}
                className="aspect-[4/3] bg-white backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 1 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 10px 25px rgba(196, 161, 115, 0.2)"
                }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-[#C4A173]/15 to-[#4D361E]/15 flex items-center justify-center">
                  <div className="text-[#6f360d] text-sm font-medium opacity-50">
                    Image {index + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.5 }}
        >
          <motion.button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-[#C4A173] to-[#4D361E] text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 15px 35px rgba(196, 161, 115, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Article;