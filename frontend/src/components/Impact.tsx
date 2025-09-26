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
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigation = useNavigate();
  const [impacts, setImpacts] = useState<ImpactWithReadMore[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    loadImpacts();
  }, []);

  const loadImpacts = async () => {
    try {
      setLoading(true);
      const response = await impactService.getPublicImpacts({ limit: 100 }); // Load more to enable pagination
      if (response.data) {
        const impactsArray = Array.isArray(response.data) ? response.data : [response.data];
        setImpacts(impactsArray);
      }
    } catch (error) {
      console.error('Failed to load impacts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(impacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedImpacts = impacts.slice(startIndex, endIndex);

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
          <p className="text-black text-lg md:text-xl text-justify leading-relaxed font-medium">
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
            displayedImpacts.map((impact) => (
              <motion.div
                key={impact._id}
                variants={cardVariants}
                className="group"
                whileHover={{ 
                  scale: 1.03,
                  y: -5,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                onClick={()=>navigation(`/impact/${'id' in impact ? impact.id : impact._id}`)}
              >
                <div className="rounded-2xl h-72 flex flex-col justify-end shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-[#C4A173]">
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
              className="px-4 py-2 bg-[#C4A173] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6B3410] transition-colors"
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
              className="px-4 py-2 bg-[#C4A173] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6B3410] transition-colors"
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            >
              Next ›
            </motion.button>
          </div>
        )}

        {/* Page Info */}
        {impacts.length > 0 && (
          <div className="text-center mt-4">
            <p className="text-[#4D361E] text-sm">
              Showing {startIndex + 1}-{Math.min(endIndex, impacts.length)} of {impacts.length} impacts
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Impact;