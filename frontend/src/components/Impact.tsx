import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { impactService } from '../services/impactService';
import type { Impact as ImpactType } from '../types/dashboard';

type ImpactWithReadMore = ImpactType | {
  _id: string;
  title: string;
  isReadMore: boolean;
};

const Impact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigation = useNavigate();
  const [impacts, setImpacts] = useState<ImpactWithReadMore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImpacts();
  }, []);

  const loadImpacts = async () => {
    try {
      setLoading(true);
      const response = await impactService.getPublicImpacts({ limit: 20 });
      if (response.data) {
        const impactsArray = Array.isArray(response.data) ? response.data : [response.data];
        // Add a "Read More" card at the end
        const impactsWithReadMore = [...impactsArray, {
          _id: 'read-more',
          title: 'Read More',
          isReadMore: true
        }];
        setImpacts(impactsWithReadMore);
      }
    } catch (error) {
      console.error('Failed to load impacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  return (
    <section ref={ref} id="impact" className="bg-gradient-to-b from-white to-[#c4b4a7] py-24">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Title */}
        <div className="text-center mb-12">
          <motion.h2 
            variants={titleVariants}
            className="text-6xl font-bold text-[#4D361E] mb-8 tracking-wide"
            whileHover={{ 
              scale: 1.02,
              textShadow: "0px 0px 20px rgba(139, 69, 19, 0.3)",
              transition: { duration: 0.3 }
            }}
          >
            OUR IMPACT
          </motion.h2>
        </div>

        {/* Description Text */}
        <motion.div
          variants={textVariants}
          className="max-w-6xl mx-auto mb-16"
        >
          <p className="text-black text-lg md:text-xl leading-relaxed font-medium">
            From 2021 To 2023, She Rising Offered Free Academic Tutoring And Life Skills Mentoring For Young Girls In Chalakudy, Kerala. These 
            Sessions Were More Than Just Homework Help, They Became Transformative Spaces Where Girls Explored Topics Often Excluded From 
            Traditional Education. In Addition To Core Subjects Like Science And Math, We Facilitated Discussions On Gender Equality, Menstruation 
            Stigma, Body Image, Self-Esteem, And Financial Independence. These Holistic Learning Experiences Helped Girls Build Confidence, Ask 
            Bold Questions, And Develop Skills To Thrive Both Inside And Outside The Classroom.
          </p>
        </motion.div>

        {/* Impact Events Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {loading ? (
            // Loading skeleton
            [...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                className="bg-gray-200 rounded-2xl h-48 animate-pulse"
                variants={cardVariants}
              />
            ))
          ) : (
            impacts.map((impact) => (
              <motion.div
                key={impact._id}
                variants={cardVariants}
                className="group"
                whileHover={{ 
                  scale: 1.03,
                  y: -5,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                onClick={()=>navigation('isReadMore' in impact && impact.isReadMore ? '/' : `/impact/${'id' in impact ? impact.id : impact._id}`)}
              >
                <div className={`rounded-2xl h-72 flex flex-col justify-end shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden ${
                  'isReadMore' in impact && impact.isReadMore ? 'items-center justify-center bg-gradient-to-b from-[#C4A173] to-white' : 'bg-[#C4A173]'
                }`}>
                  {'isReadMore' in impact && impact.isReadMore ? (
                    <div className="text-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="text-black font-bold text-xl cursor-pointer"
                      >
                        {impact.title} →
                      </motion.div>
                    </div>
                  ) : (
                    <>
                      {/* Impact image or placeholder */}
                      <div className="flex-grow mb-4 overflow-hidden">
                        {'images' in impact && impact.images && impact.images.length > 0 ? (
                          <img 
                            src={impact.images[0]} 
                            alt={impact.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#B8956A] opacity-30"></div>
                        )}
                      </div>
                      
                      {/* Impact info */}
                      <div className='px-4 pb-4'>
                        <h3 className="text-black font-bold text-sm mb-2 leading-tight">
                          {impact.title}
                        </h3>
                        <p className="text-black text-xs font-medium opacity-80">
                          {'date' in impact && impact.date ? new Date(impact.date).toLocaleDateString() : 'createdAt' in impact ? new Date(impact.createdAt).toLocaleDateString() : ''}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Impact;