import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

// Sample data
  const courses = [
    { 
      id: 1, 
      title: "Gender Equality Basics",
      description: "Understanding the fundamentals of gender equality and its importance in modern society.",
      duration: "15 min"
    },
    { 
      id: 2, 
      title: "Body Autonomy 101",
      description: "Exploring the concept of bodily autonomy, consent, and personal rights.",
      duration: "20 min"
    },
    { 
      id: 3, 
      title: "Menstruation Education",
      description: "Breaking taboos and providing essential knowledge about menstrual health.",
      duration: "18 min"
    },
    { 
      id: 4, 
      title: "Mental Health Awareness",
      description: "Recognizing mental health challenges and building resilience.",
      duration: "25 min"
    },
    { 
      id: 5, 
      title: "Financial Independence",
      description: "Practical strategies for achieving financial freedom and economic empowerment.",
      duration: "30 min"
    },
    { 
      id: 6, 
      title: "Self-Esteem Building",
      description: "Developing confidence and self-worth through practical exercises.",
      duration: "22 min"
    },
  ];

  const conversations = [
    { 
      id: 1, 
      title: "Intersectional Feminism Discussion",
      description: "Deep dive into how different identities intersect and shape our experiences.",
      guest: "Dr. Sarah Ahmed"
    },
    { 
      id: 2, 
      title: "Migration & Education",
      description: "Exploring how migration affects educational opportunities and challenges.",
      guest: "Prof. Maria Santos"
    },
    { 
      id: 3, 
      title: "Reproductive Justice",
      description: "Understanding reproductive justice as a human rights framework.",
      guest: "Activist Lisa Chen"
    },
    { 
      id: 4, 
      title: "Politics of Care",
      description: "Examining how care work is valued in society and gendered responsibilities.",
      guest: "Dr. Angela Davis"
    },
    { 
      id: 5, 
      title: "Community Leadership",
      description: "Stories of grassroots organizing and creating lasting change.",
      guest: "Fatima Al-Rashid"
    },
    { 
      id: 6, 
      title: "Research & Activism",
      description: "How academic research can inform and strengthen activist movements.",
      guest: "Dr. bell hooks"
    },
  ];


const Resources = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollerCourseRef = useRef<HTMLDivElement>(null);
  const scrollerConversationRef = useRef<HTMLDivElement>(null);
  const isScrollingCourse = useRef(false);
  const isScrollingConversation = useRef(false);

  // Infinite scroll logic for courses
  useEffect(() => {
    const el = scrollerCourseRef.current;
    if (!el) return;

    // Wait for DOM to render and get accurate measurements
    const initializeCarousel = () => {
      const firstCard = el.querySelector('.min-w-50');
      if (!firstCard) return;
      
      const cardRect = firstCard.getBoundingClientRect();
      const cardWidth = cardRect.width + 32; // card width + gap
      const singleSetWidth = cardWidth * courses.length;
      
      // Start in the middle of the duplicated content (second set)
      el.scrollLeft = singleSetWidth;
      
      const handleScroll = () => {
        // Don't interfere if smooth scrolling is in progress
        if (isScrollingCourse.current) return;
        
        const scrollLeft = el.scrollLeft;
        const maxScroll = el.scrollWidth - el.clientWidth;
        
        // If scrolled too far left (before first set), jump to equivalent position in second set
        if (scrollLeft <= 10) {
          el.scrollLeft = singleSetWidth + scrollLeft;
        }
        // If scrolled too far right (beyond second set), jump to equivalent position in first set
        else if (scrollLeft >= maxScroll - 10) {
          el.scrollLeft = scrollLeft - singleSetWidth;
        }
      };

      el.addEventListener('scroll', handleScroll);
      
      return () => {
        el.removeEventListener('scroll', handleScroll);
      };
    };

    // Initialize after a brief delay to ensure DOM is ready
    const timeout = setTimeout(initializeCarousel, 100);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [courses.length]);

  // Infinite scroll logic for conversations
  useEffect(() => {
    const el = scrollerConversationRef.current;
    if (!el) return;

    // Wait for DOM to render and get accurate measurements
    const initializeCarousel = () => {
      const firstCard = el.querySelector('.min-w-50');
      if (!firstCard) return;
      
      const cardRect = firstCard.getBoundingClientRect();
      const cardWidth = cardRect.width + 32; // card width + gap
      const singleSetWidth = cardWidth * conversations.length;
      
      // Start in the middle of the duplicated content (second set)
      el.scrollLeft = singleSetWidth;
      
      const handleScroll = () => {
        // Don't interfere if smooth scrolling is in progress
        if (isScrollingConversation.current) return;
        
        const scrollLeft = el.scrollLeft;
        const maxScroll = el.scrollWidth - el.clientWidth;
        
        // If scrolled too far left (before first set), jump to equivalent position in second set
        if (scrollLeft <= 10) {
          el.scrollLeft = singleSetWidth + scrollLeft;
        }
        // If scrolled too far right (beyond second set), jump to equivalent position in first set
        else if (scrollLeft >= maxScroll - 10) {
          el.scrollLeft = scrollLeft - singleSetWidth;
        }
      };

      el.addEventListener('scroll', handleScroll);
      
      return () => {
        el.removeEventListener('scroll', handleScroll);
      };
    };

    // Initialize after a brief delay to ensure DOM is ready
    const timeout = setTimeout(initializeCarousel, 100);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [conversations.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };


  const nextCourse = () => {
    const el = scrollerCourseRef.current;
    if (!el) return;
    
    // Calculate actual card width from DOM
    const firstCard = el.querySelector('.min-w-50');
    if (!firstCard) return;
    
    const cardRect = firstCard.getBoundingClientRect();
    const cardWidth = cardRect.width + 32; // card width + gap
    
    // Prevent boundary detection during smooth scroll
    isScrollingCourse.current = true;
    
    el.scrollBy({
      left: cardWidth,
      behavior: 'smooth'
    });
    
    // Re-enable boundary detection after animation completes
    setTimeout(() => {
      isScrollingCourse.current = false;
    }, 500);
  };

  const prevCourse = () => {
    const el = scrollerCourseRef.current;
    if (!el) return;
    
    // Calculate actual card width from DOM
    const firstCard = el.querySelector('.min-w-50');
    if (!firstCard) return;
    
    const cardRect = firstCard.getBoundingClientRect();
    const cardWidth = cardRect.width + 32; // card width + gap
    
    // Prevent boundary detection during smooth scroll
    isScrollingCourse.current = true;
    
    el.scrollBy({
      left: -cardWidth,
      behavior: 'smooth'
    });
    
    // Re-enable boundary detection after animation completes
    setTimeout(() => {
      isScrollingCourse.current = false;
    }, 500);
  };

  const nextConversations = () => {
    const el = scrollerConversationRef.current;
    if (!el) return;
    
    // Calculate actual card width from DOM
    const firstCard = el.querySelector('.min-w-50');
    if (!firstCard) return;
    
    const cardRect = firstCard.getBoundingClientRect();
    const cardWidth = cardRect.width + 32; // card width + gap
    
    // Prevent boundary detection during smooth scroll
    isScrollingConversation.current = true;
    
    el.scrollBy({
      left: cardWidth,
      behavior: 'smooth'
    });
    
    // Re-enable boundary detection after animation completes
    setTimeout(() => {
      isScrollingConversation.current = false;
    }, 500);
  };

  const prevConversations = () => {
    const el = scrollerConversationRef.current;
    if (!el) return;
    
    // Calculate actual card width from DOM
    const firstCard = el.querySelector('.min-w-50');
    if (!firstCard) return;
    
    const cardRect = firstCard.getBoundingClientRect();
    const cardWidth = cardRect.width + 32; // card width + gap
    
    // Prevent boundary detection during smooth scroll
    isScrollingConversation.current = true;
    
    el.scrollBy({
      left: -cardWidth,
      behavior: 'smooth'
    });
    
    // Re-enable boundary detection after animation completes
    setTimeout(() => {
      isScrollingConversation.current = false;
    }, 500);
  };

  return (
    <section ref={ref} id="resources" className="bg-[#C4A173] py-24 top-shadow">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Main Title */}
        <div className="text-center mb-20">
          <motion.h1
            variants={titleVariants}
            className="text-6xl font-bold text-[#4D361E] mb-8 tracking-wide"
            whileHover={{
              scale: 1.02,
              textShadow: "0px 0px 20px rgba(139, 69, 19, 0.3)",
              transition: { duration: 0.3 },
            }}
          >
            RESOURCES
          </motion.h1>
        </div>

        {/* Course Modules Section */}
        <motion.div variants={sectionVariants} className="mb-20">
          <div className="mb-12">
            <motion.h2
              variants={titleVariants}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              COURSE MODULES
            </motion.h2>
            <motion.p
              variants={titleVariants}
              className="text-lg md:text-xl text-white font-medium mb-2"
            >
              EXPLORE OUR FREE LEARNING SERIES ON YOUTUBE
            </motion.p>
            <motion.p
              variants={titleVariants}
              className="text-black text-base md:text-lg leading-relaxed max-w-7xl"
            >
              Dive into our curated video modules covering gender equality, body
              autonomy, menstruation, mental health, and more. These educational
              videos, developed by our team and informed by lived experiences
              and academic research, make complex ideas simple, accessible, and
              actionable.
            </motion.p>
          </div>

          <div className="relative h-full w-full">
            <div className="absolute left-0 flex items-center w-1/3 h-full bg-[linear-gradient(to_right,_#C4A173_0%,_rgba(196,161,115,0.8)_25%,_rgba(196,161,115,0.5)_50%,_rgba(196,161,115,0.2)_75%,_rgba(196,161,115,0)_100%)]">
              <motion.button
                onClick={prevCourse}
                className="w-12 h-12 bg-[#C4A173] rounded-full flex items-center justify-center shadow-lg hover:bg-[#6B3410] cursor-pointer transition-colors z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <img src="/icons/arrow.svg" alt="Arrow Left" />
              </motion.button>
            </div>
            <div className="absolute right-0 flex items-center justify-end w-1/3 h-full bg-[linear-gradient(to_left,_#C4A173_0%,_rgba(196,161,115,0.8)_25%,_rgba(196,161,115,0.5)_50%,_rgba(196,161,115,0.2)_75%,_rgba(196,161,115,0)_100%)]">
              <motion.button
                onClick={nextCourse}
                className="w-12 h-12 bg-[#C4A173] rounded-full flex items-center justify-center shadow-lg hover:bg-[#6B3410] cursor-pointer transition-colors z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <img src="/icons/arrow.svg" className="rotate-180" alt="Arrow Right" />
              </motion.button>
            </div>

            <div
              ref={scrollerCourseRef}
              className="w-full grid grid-flow-col auto-cols-min gap-8 overflow-x-auto hide-scrollbar"
            >
              {[...courses,...courses].map((course, index) => (
                <motion.div
                  key={`course-${course.id}-${index}`}
                  className="min-w-50 min-h-40 rounded-2xl flex flex-col justify-between bg-white px-6 py-8"
                >
                  {/* Content Text */}
                  <div className="grow py-2">
                    <p className="text-[#4D361E] text-sm leading-relaxed italic">
                      {course.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Conversations Section */}
        <motion.div variants={sectionVariants}>
          <div className="mb-12">
            <motion.h2
              variants={titleVariants}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              CONVERSATIONS THAT SPARK CHANGE
            </motion.h2>
            <motion.p
              variants={titleVariants}
              className="text-lg md:text-xl text-white font-medium mb-2"
            >
              EXPLORE OUR FREE PODCAST SERIES ON YOUTUBE
            </motion.p>
            <motion.p
              variants={titleVariants}
              className="text-black text-base md:text-lg leading-relaxed max-w-7xl"
            >
              Tune in to real, raw, and reflective conversations on our YouTube
              channel, where every episode is built on rigorous research,
              fact-checked information, and lived experience. Hosted by members
              of She Rising, our podcasts bring together students, scholars,
              activists, and community leaders to explore topics like
              intersectional feminism, migration, education, reproductive
              justice, and the politics of care. Each episode is crafted to
              inform, challenge, and inspire, offering personal stories
              alongside critical insights and actionable steps for change.
            </motion.p>
          </div>

          {/* Conversations Carousel */}
          <div className="relative">
            <div className="relative h-full w-full">
            <div className="absolute left-0 flex items-center w-1/3 h-full bg-[linear-gradient(to_right,_#C4A173_0%,_rgba(196,161,115,0.8)_25%,_rgba(196,161,115,0.5)_50%,_rgba(196,161,115,0.2)_75%,_rgba(196,161,115,0)_100%)]">
              <motion.button
                onClick={prevConversations}
                className="w-12 h-12 bg-[#C4A173] rounded-full flex items-center justify-center shadow-lg hover:bg-[#6B3410] cursor-pointer transition-colors z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <img src="/icons/arrow.svg" alt="Arrow Left" />
              </motion.button>
            </div>
            <div className="absolute right-0 flex items-center justify-end w-1/3 h-full bg-[linear-gradient(to_left,_#C4A173_0%,_rgba(196,161,115,0.8)_25%,_rgba(196,161,115,0.5)_50%,_rgba(196,161,115,0.2)_75%,_rgba(196,161,115,0)_100%)]">
              <motion.button
                onClick={nextConversations}
                className="w-12 h-12 bg-[#C4A173] rounded-full flex items-center justify-center shadow-lg hover:bg-[#6B3410] cursor-pointer transition-colors z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <img src="/icons/arrow.svg" className="rotate-180" alt="Arrow Right" />
              </motion.button>
            </div>

            <div
              ref={scrollerConversationRef}
              className="w-full grid grid-flow-col auto-cols-min gap-8 overflow-x-auto hide-scrollbar"
            >
              {[...conversations,...conversations].map((conversation, index) => (
                <motion.div
                  key={`conversation-${conversation.id}-${index}`}
                  className="min-w-50 min-h-40 rounded-2xl flex flex-col justify-between bg-white px-6 py-8"
                >
                  {/* Content Text */}
                  <div className="grow py-2">
                    <p className="text-[#4D361E] text-sm leading-relaxed italic">
                      {conversation.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Resources;