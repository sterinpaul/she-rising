import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const Involve = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <section ref={ref} id="contact" className="bg-[#C4A173] py-24">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Main Title */}
        <div className="text-center mb-10">
          <motion.h1 
            variants={titleVariants}
            className="text-left text-5xl font-bold text-white mb-8 tracking-wide"
            whileHover={{ 
              scale: 1.02,
              textShadow: "0px 0px 20px rgba(255, 255, 255, 0.3)",
              transition: { duration: 0.3 }
            }}
          >
            GET INVOLVED
          </motion.h1>
        </div>

        {/* Collaborate With Us Section */}
        <motion.div 
          variants={sectionVariants}
          className="mb-16"
        >
          <motion.h2 
            variants={titleVariants}
            className="text-2xl md:text-3xl font-bold text-amber-50 mb-4"
          >
            COLLABORATE WITH US
          </motion.h2>
          <motion.p 
            variants={titleVariants}
            className="text-black text-base md:text-lg leading-relaxed max-w-7xl mb-8"
          >
            Are you an educator, researcher, organization, or youth-led initiative passionate about gender equity, education, or social justice? Let's 
            build something powerful together. She Rising collaborates with individuals and institutions to create events, workshops, educational 
            content, and research-based projects that center community voices and lived experiences.
          </motion.p>
        </motion.div>

        {/* Volunteer With Us Section */}
        <motion.div 
          variants={sectionVariants}
          className="mb-16"
        >
          <motion.h2 
            variants={titleVariants}
            className="text-2xl md:text-3xl font-bold text-amber-50 mb-4"
          >
            VOLUNTEER WITH US
          </motion.h2>
          <motion.p 
            variants={titleVariants}
            className="text-black text-base md:text-lg leading-relaxed max-w-7xl mb-8"
          >
            Want to be part of something meaningful? Whether you're skilled in writing, design, content creation, research, or simply have a heart for 
            justice, there is space for you at She Rising. Our volunteer program is flexible, collaborative, and impact driven. From behind-the-scenes 
            roles to public-facing initiatives, your time and talent can help amplify change.
          </motion.p>
        </motion.div>

        {/* Join Our Community Section */}
        <motion.div 
          variants={sectionVariants}
          className="mb-20"
        >
          <motion.h2 
            variants={titleVariants}
            className="text-2xl md:text-3xl font-bold text-amber-50 mb-4"
          >
            JOIN OUR COMMUNITY
          </motion.h2>
          <motion.p 
            variants={titleVariants}
            className="text-black text-base md:text-lg leading-relaxed max-w-7xl mb-8"
          >
            She Rising is more than a platform. It is a growing global community of young people committed to building a more just, inclusive, and 
            educated world. When you join us, you gain access to workshops, resources, support circles, conversations, and calls for action that 
            matter.
          </motion.p>
        </motion.div>

        {/* Contact Cards */}
        <motion.div 
          variants={containerVariants}
          className="flex flex-col sm:flex-row gap-8 justify-center items-center"
        >
          {/* Gmail Card */}
          <motion.div
            variants={cardVariants}
            className="group"
            whileHover={{ 
              scale: 1.05,
              y: -5,
              transition: { duration: 0.3 }
            }}
          >
            <a 
              href="mailto:thesherising@gmail.com"
              className="bg-[#E8DDD4] rounded-2xl p-8 w-64 h-40 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Gmail Icon */}
              <div className="w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                <img src="/icons/gmail.svg" alt="Gmail Icon" />
              </div>
              <p className="text-black font-bold text-sm text-center">
                thesherising@gmail.com
              </p>
            </a>
          </motion.div>

          {/* Instagram Card */}
          <motion.div
            variants={cardVariants}
            className="group"
            whileHover={{ 
              scale: 1.05,
              y: -5,
              transition: { duration: 0.3 }
            }}
          >
            <a 
              href="https://instagram.com/sherisingofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#E8DDD4] rounded-2xl p-8 w-64 h-40 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Instagram Icon */}
              <div className="w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <img src="/icons/instagram.svg" alt="Instagram Icon" />
              </div>
              <p className="text-black font-bold text-sm text-center">
                @sherisingofficial
              </p>
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Involve;