
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation } from '../components';

// Interface for impact data
interface ImpactData {
  id: string;
  title: string;
  createdAt: string;
  content: string;
  images: string[];
}

const Impact = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [impactData, setImpactData] = useState<ImpactData | null>(null);
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

  // Load impact details from server
  useEffect(() => {
    const fetchImpactDetails = async () => {
      if (!id) {
        setError('No impact ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Simulate API call - replace with actual server endpoint
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data based on the reference image
        const mockData: ImpactData = {
          id,
          title: "Menstruation 101: Kerala Outreach",
          createdAt: "August 5, 2024",
          content: `Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. In Augue Tellus, Aliquam Vitae Ligula Eu, Laoreet Ultricies Arcu. Aliquam Convallis, 
Turpis Eu Maximus Dictum, Dui Metus Vehicula Libero, Ac Convallis Est Ligula At Eros. Nulla Convallis Lacus Eget Magna Accumsan, 
Suscipit Placerat Sapien Scelerisque. Pellentesque In Risus Luctus, Aliquam Porttitor, Sit Dignissim Tincidunt Urna. Morbi At 
Sapien Blandit, Luctus Magna Dolor Sodales. Nulla A Lobortis Feestae, Eros Eget Gravida Mi Ex, Et Placerat Nisl. Nunc Pretium 
Mauris Egestas, Tempor Tolutpat Phasellus Nisl Ut Imperdiet A Ipsum Vitae, Aliquam Faucibus Elit. Quisque Bibendum Auctor 
Lacuslis Dolor Id Venenatis. Praesent Ullamcorper Tempor Gravida Et, Ut Hendrerit Mauris Lobortis Pretium. Sed Placerat Ipsum Arcu 
Volutpate. Nec Iaculis Nisl Volutpat. At Lacinia Ante, Vel Semper Ex. Donec Venenatis Vel Mi Et Accumsan. Suspendisse Ut Nunc Porta, Tincidunt Metus Quis, Pretium 
Nulla. Nullam Viverra Sem A Mi Condimentum Accumsan. Praesent Pharetra Tempor Erat Nec Vehicula. Cras Sit Amet Nisl Felis. Nulla 
Aliquam Eros Vitae Nisl Vehicula, Sit Amet Fermentum Nunc Pretium. Vivamus Blandit Volutpat Velit, Eu Faucibus Nisl Porta Ut. 
Maecenas Vitae Massa Velit. Donec Est Purus, Imperdiet Nec Purus Id, Pharetra Sagittis Enim. Nam Pellentesque Molestie Justo. Quisque 
Sed Quam Vitae Elit Rhoncus Rhoncus.`,
          images: Array(8).fill('/api/placeholder/300/200') // Placeholder images
        };

        setImpactData(mockData);
      } catch (err) {
        setError('Failed to load impact details');
        console.error('Error fetching impact details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImpactDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f5f1ee] to-[#c4b4a7] flex items-center justify-center">
        <div className="text-[#4D361E] text-lg">Loading impact details...</div>
      </div>
    );
  }

  if (error || !impactData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f5f1ee] to-[#c4b4a7] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error || 'Impact not found'}</div>
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
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f5f1ee] to-[#c4b4a7]">
      <Navigation />
      
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#4D361E] mb-4 leading-tight"
            whileHover={{
              scale: 1.02,
              textShadow: "0px 0px 20px rgba(77, 54, 30, 0.3)",
              transition: { duration: 0.3 },
            }}
          >
            {impactData.title}
          </motion.h1>
          <motion.p 
            className="text-xl text-[#6f360d] font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            {impactData.createdAt}
          </motion.p>
        </motion.div>

        {/* Content Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
        >
          <div className="backdrop-blur-sm p-8 md:p-12">
            <motion.p 
              className="text-[#4D361E] text-base md:text-lg leading-relaxed whitespace-pre-line"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
            >
              {impactData.content}
            </motion.p>
          </div>
        </motion.div>

        {/* Images Grid Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {impactData.images.map((_, index) => (
              <motion.div
                key={index}
                className="aspect-square bg-white/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 1.2 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 15px 35px rgba(196, 161, 115, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-[#C4A173]/20 to-[#4D361E]/20 flex items-center justify-center">
                  <div className="text-[#6f360d] text-sm font-medium opacity-60">
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
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.8 }}
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

export default Impact;