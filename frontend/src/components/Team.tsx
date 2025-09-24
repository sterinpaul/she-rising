import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const Team = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  const teamMembers = [
    {
      name: "Adeline Chacko",
      role: "Founder, Executive Director"
    },
    {
      name: "Eren Eberling", 
      role: "Co-Executive Director"
    },
    {
      name: "Niranjana Das",
      role: "Co-ordinator"
    }
  ];

  return (
    <section ref={ref} id="team" className="bg-white py-20">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Title */}
        <div className="text-center mb-16">
          <motion.div
            variants={titleVariants}
            className="md:w-1/2 mx-auto"
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <div className="bg-[#C4A173] text-white px-8 py-4 rounded-2xl text-lg md:text-xl font-medium inner-shadow">
              Meet Our Team
            </div>
          </motion.div>
        </div>

        {/* Team Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group"
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <div className="bg-[#C4A173] rounded-2xl p-8 h-64 flex flex-col justify-end shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Placeholder for team member image */}
                <div className="flex-grow mb-6 bg-[#B8956A] rounded-lg opacity-30"></div>
                
                {/* Team member info */}
                <div className="text-center">
                  <h3 className="text-black font-bold text-lg mb-1">
                    {member.name}
                  </h3>
                  <p className="text-black text-sm font-medium opacity-80">
                    {member.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Team;