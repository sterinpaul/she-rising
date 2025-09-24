import { motion } from "framer-motion";

const Loader = () => {
  // Animation variants for the main container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };


  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-[#f5f1ee] to-[#c4b4a7] flex items-center justify-center z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#C4A173] rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-[#4D361E] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#C4A173] rounded-full blur-2xl"></div>
      </div>

      <motion.div
        className="relative flex flex-col items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Outer Pulsing Circle */}
        <motion.div
          className="absolute w-32 h-32 rounded-full border-2 border-[#C4A173]/30"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Middle Pulsing Circle */}
        <motion.div
          className="absolute w-24 h-24 rounded-full border-2 border-[#4D361E]/40"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Inner Pulsing Circle */}
        <motion.div
          className="absolute w-16 h-16 rounded-full border-2 border-[#C4A173]/50"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

       

        {/* Floating Particles */}
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-2 h-2 bg-[#C4A173] rounded-full"
            style={{
              top: `${Math.sin((index * Math.PI) / 3) * 60 + 50}%`,
              left: `${Math.cos((index * Math.PI) / 3) * 60 + 50}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          />
        ))}

        {/* Brand Text */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <motion.p className="text-[#6f360d] text-sm font-medium mb-4">
            Empowering change, one story at a time
          </motion.p>

          {/* Loading Dots */}
          <div className="flex items-center justify-center space-x-1">
            <span className="text-[#4D361E] text-sm mr-2">Loading</span>
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                className="w-1.5 h-1.5 bg-[#C4A173] rounded-full"
                animate={{
                  y: [-10, 0, -10],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mt-8 w-48 h-1 bg-[#C4A173]/20 rounded-full overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#C4A173] to-[#4D361E] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute -top-10 -left-10 w-4 h-4 bg-[#C4A173] rounded-full opacity-60"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute -bottom-8 -right-8 w-3 h-3 bg-[#4D361E] rounded-full opacity-60"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </motion.div>
    </div>
  );
};

export default Loader;