import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SPEED_PX_PER_MS = 0.06;

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return; // respect user preference

    let rafId: number;
    let lastTs: number | null = null;

    const loop = (ts: number) => {
      if (lastTs == null) lastTs = ts;
      const delta = ts - lastTs;
      lastTs = ts;

      if (!pause) {
        // Calculate the width of one set of items (half of total width since we duplicated)
        const singleSetWidth = el.scrollWidth / 2;
        el.scrollLeft += delta * SPEED_PX_PER_MS;

        // When we reach the end of the first set, jump back to the beginning
        if (el.scrollLeft >= singleSetWidth) {
          el.scrollLeft = el.scrollLeft - singleSetWidth;
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [pause]);

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

  const subtitleVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const sdgSectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: { opacity: 1, scale: 1, rotate: 0 },
  };

  return (
    <section ref={ref} id="about" className="bg-[#f7f7f7e7] pt-24">
      {/* Main About Section */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="text-center mb-16">
          <motion.h2
            variants={titleVariants}
            className="text-6xl font-bold text-[#4D361E] mb-8 tracking-wide"
            whileHover={{
              scale: 1.02,
              textShadow: "0px 0px 20px rgba(139, 69, 19, 0.3)",
              transition: { duration: 0.3 },
            }}
          >
            ABOUT US
          </motion.h2>

          <motion.div variants={subtitleVariants} className="md:w-1/2 mx-auto">
            <div className="bg-[#C4A173] text-white px-8 py-4 rounded-2xl text-lg md:text-xl font-medium inner-shadow">
              Our Story, Our Vision, Our Why
            </div>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8 text-black">
          <motion.p
            variants={paragraphVariants}
            className="text-lg md:text-xl leading-relaxed font-bold"
          >
            From a small online classroom in Kerala to a growing global
            community, She Rising began with one simple belief: education has
            the power to change lives not just through textbooks, but through
            connection, courage, and care.
          </motion.p>

          <motion.p
            variants={paragraphVariants}
            className="text-lg md:text-xl leading-relaxed font-medium"
          >
            At 18, our founder began tutoring young girls in her neighborhood,
            blending academic support with open conversations about body image,
            menstruation, and gender roles, topics that were often left
            unaddressed. What began as small gatherings soon grew into a
            movement: a space where education became a tool for empowerment, not
            just achievement.
          </motion.p>

          <motion.p
            variants={paragraphVariants}
            className="text-lg md:text-xl leading-relaxed font-medium"
          >
            Today, She Rising is rooted in both grassroots action and academic
            thought. From workshops and podcasts to public events and accessible
            resources, we bridge the gap between higher education and everyday
            people. Our mission is to create spaces where knowledge is not a
            privilege, but a shared power where girls, students, and communities
            rise together.
          </motion.p>
        </div>
      </motion.div>

      <div className="relative h-full max-w-7xl mx-auto">
        <div className="absolute left-0 w-1/3 h-full bg-[linear-gradient(to_right,#f7f7f7e7_0%,rgba(247,247,247,0.8)_35%,rgba(247,247,247,0.5)_50%,rgba(247,247,247,0.2)_75%,rgba(247,247,247,0)_100%)]"></div>
        <div className="absolute right-0 w-1/3 h-full bg-[linear-gradient(to_left,#f7f7f7e7_0%,rgba(247,247,247,0.8)_35%,rgba(247,247,247,0.5)_50%,rgba(247,247,247,0.2)_75%,rgba(247,247,247,0)_100%)]"></div>

        <div
          ref={scrollerRef}
          onMouseEnter={() => setPause(true)}
          onMouseLeave={() => setPause(false)}
          className="w-full grid grid-flow-col auto-cols-min gap-6 overflow-x-auto hide-scrollbar"
        >
          {/* First set of items */}
          {new Array(20).fill("").map((_, idx) => (
            <div
              key={`first-${idx}`}
              className="min-w-35 min-h-40 flex flex-col bg-[#efe7dd] shadow-lg px-6 py-10"
            >
              {/* GROWING TEXT BLOCK */}
              <div className="grow py-2">
                
              </div>
            </div>
          ))}
          {/* Duplicate set for infinite scroll */}
          {new Array(20).fill("").map((_, idx) => (
            <div
              key={`second-${idx}`}
              className="min-w-35 min-h-40 flex flex-col bg-black/30 shadow-2xl px-6 py-10"
            >
              {/* GROWING TEXT BLOCK */}
              <div className="grow py-2">
                <p className="text-black text-sm leading-relaxed italic">
                  Card {idx + 1}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UN SDG Section */}
      <motion.div
        className="bg-[#C4A173] py-16 mt-20 inner-shadow"
        variants={sdgSectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-around">
            <motion.div
              className="text-center lg:text-left mb-12 lg:mb-0"
              variants={titleVariants}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                UNITED NATION'S
                <br />
                SUSTAINABLE DEVELOPMENT GOALS
              </h3>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-8 lg:gap-12">
              <motion.div
                className="text-center"
                variants={iconVariants}
                whileHover={{
                  scale: 1.1,
                  y: -10,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 bg-[#8B4513] rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <img
                    src="/icons/quality-education.svg"
                    alt="Quality Education"
                  />
                </div>
                <p className="text-[#8B4513] font-semibold text-sm md:text-base">
                  QUALITY EDUCATION
                </p>
              </motion.div>

              <motion.div
                className="text-center"
                variants={iconVariants}
                whileHover={{
                  scale: 1.1,
                  y: -10,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 bg-[#E74C3C] rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <img src="/icons/gender-equality.svg" alt="Gender Equality" />
                </div>
                <p className="text-[#8B4513] font-semibold text-sm md:text-base">
                  GENDER EQUALITY
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
