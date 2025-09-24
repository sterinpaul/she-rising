import { motion } from 'framer-motion';

const Hero = () => {

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const scrollToImpact = () => {
    const element = document.getElementById('impact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen overflow-hidden bg-gradient-to-b from-white to-[#c4b4a7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="w-full"
        >
          <motion.h1 
            className="text-7xl sm:text-8xl lg:text-9xl xl:text-[10rem] font-bold leading-none text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <motion.div 
              className="text-[#C4A173] mb-2 tracking-wider"
              whileHover={{ 
                scale: 1.02, 
                textShadow: "0px 0px 8px rgb(196,161,115)",
                transition: { duration: 0.3 }
              }}
            >
              ELEVATE
            </motion.div>
            <motion.div 
              className="text-[#4D361E] mb-2 tracking-wider"
              whileHover={{ 
                scale: 1.02,
                textShadow: "0px 0px 8px rgb(77,54,30)",
                transition: { duration: 0.3 }
              }}
            >
              ENRICH
            </motion.div>
            <motion.div 
              className="text-[#C4A173] tracking-wider"
              whileHover={{ 
                scale: 1.02,
                textShadow: "0px 0px 8px rgb(196,161,115)",
                transition: { duration: 0.3 }
              }}
            >
              EMPOWER
            </motion.div>
          </motion.h1>
        </motion.div>
      </div>
      
      
      {/* Circular Call-to-Action Button */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-8 right-20 flex items-center gap-4"
      >
        <div className="text-[#6f360d] text-sm font-light leading-tight">Jump to Our Impact</div>
        <motion.button 
          onClick={scrollToImpact}
          className="w-32 h-32 rounded-full shadow-2xl hover:bg-[#EFEBE7] transition-colors duration-300 flex flex-col items-center justify-center border-1 border-[#bcbbba]"
          whileHover={{ 
            scale: 1.08,
            boxShadow: "0 15px 40px rgba(139, 69, 19, 0.15)",
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <motion.div 
            className="text-center mb-2 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
              <img src="/icons/arrow-down.svg" className='w-20 h-20' alt="arrow button" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
          </motion.div>
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;