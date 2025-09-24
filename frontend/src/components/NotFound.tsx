import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './index';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f5f1ee] to-[#c4b4a7]">
      <Navigation />
      
      <div className="flex items-center justify-center min-h-screen px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-lg w-full text-center"
        >
          {/* Animated 404 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
            className="mb-8"
          >
            <motion.h1 
              className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-[#C4A173] to-[#4D361E] bg-clip-text mb-4"
              animate={{ 
                textShadow: [
                  "0px 0px 0px rgba(196, 161, 115, 0)",
                  "0px 0px 20px rgba(196, 161, 115, 0.3)",
                  "0px 0px 0px rgba(196, 161, 115, 0)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              404
            </motion.h1>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative mb-8"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#C4A173]/20 to-[#4D361E]/20 rounded-full blur-sm"
            />
            
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -5, 0, 5, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#4D361E]/20 to-[#C4A173]/20 rounded-full blur-sm"
            />

            <h2 className="text-3xl md:text-4xl font-bold text-[#4D361E] mb-4">
              Page Not Found
            </h2>
            
            <p className="text-[#6f360d] text-lg leading-relaxed">
              The page you're looking for seems to have wandered off. 
              Let's get you back on track to continue your journey with She Rising.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            <motion.button
              onClick={handleGoHome}
              className="w-full bg-gradient-to-r from-[#C4A173] to-[#4D361E] text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 15px 35px rgba(196, 161, 115, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="flex items-center justify-center gap-2"
                whileHover={{ x: -2 }}
                transition={{ duration: 0.2 }}
              >
                <span>🏠</span>
                <span>Go Back Home</span>
              </motion.div>
            </motion.button>

            <motion.button
              onClick={handleGoBack}
              className="w-full bg-white/40 backdrop-blur-sm text-[#4D361E] font-semibold px-8 py-4 rounded-xl border border-[#C4A173]/30 hover:bg-white/60 transition-all duration-300"
              whileHover={{ 
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.6)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="flex items-center justify-center gap-2"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <span>←</span>
                <span>Go Back</span>
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Decorative Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-12 p-6 bg-white/20 backdrop-blur-sm rounded-xl border border-[#C4A173]/20"
          >
            <motion.p
              className="text-[#4D361E] italic text-sm"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              "Every path leads somewhere meaningful - let's find yours together."
            </motion.p>
            <p className="text-[#6f360d] text-xs mt-2 font-medium">
              - She Rising Community
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;