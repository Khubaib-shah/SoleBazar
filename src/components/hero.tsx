"use client";

import { motion } from "framer-motion";

const FloatingSVG = ({ children, className, duration = 4, delay = 0 }: { children: React.ReactNode, className: string, duration?: number, delay?: number }) => (
  <motion.div
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      opacity: [0.1, 0.3, 0.1]
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const Sparkle = ({ className }: { className: string }) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    animate={{
      scale: [1, 1.5, 1],
      rotate: [0, 90, 0],
      opacity: [0.2, 0.5, 0.2]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <path d="M12 0L14.595 9.405L24 12L14.595 14.595L12 24L9.405 14.595L0 12L9.405 9.405L12 0Z" fill="currentColor" />
  </motion.svg>
);

export default function Hero() {
  const scrollToShop = () => {
    const shopSection = document.getElementById("shop");
    shopSection?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    const shopSection = document.getElementById("contact");
    shopSection?.scrollIntoView({ behavior: "smooth" });
  };

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as any,
        delay: 0.3,
      },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh_-_clamp(60px,8vh,75px))]  flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FAFAF7] via-[#F5EBDC] to-[#FAFAF7]"
    >
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#7C8C5C] rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-[#E8DCC8] rounded-full opacity-20 blur-3xl"></div>

      {/* Animated SVGs */}
      <FloatingSVG className="absolute top-[15%] left-[5%] text-[#7C8C5C]" duration={5}>
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10" opacity="0.4" />
          <circle cx="60" cy="60" r="35" stroke="currentColor" strokeWidth="2" opacity="0.2" />
        </svg>
      </FloatingSVG>

      <FloatingSVG className="absolute bottom-[20%] right-[10%] text-[#2B2B2B]" duration={7} delay={1}>
        <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="25" width="100" height="100" stroke="currentColor" strokeWidth="1" opacity="0.1" rotate="45" />
          <rect x="40" y="40" width="70" height="70" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        </svg>
      </FloatingSVG>

      {/* Large Abstract X-Shape */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] right-[5%] text-[#E8DCC8] opacity-30 pointer-events-none"
      >
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <line x1="0" y1="0" x2="200" y2="200" stroke="currentColor" strokeWidth="1" />
          <line x1="200" y1="0" x2="0" y2="200" stroke="currentColor" strokeWidth="1" />
        </svg>
      </motion.div>

      <Sparkle className="absolute top-[25%] right-[20%] text-[#7C8C5C] w-12 h-12" />
      <Sparkle className="absolute bottom-[30%] left-[15%] text-[#E8DCC8] w-16 h-16" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#2B2B2B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#2B2B2B] mb-6 text-balance leading-tight"
            >
              Step Into Style with SoleBazar
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-[#7C8C5C] font-semibold mb-4 text-balance"
            >
              Where Every Sole Tells a Story
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-lg text-[#2B2B2B] mb-10 max-w-xl text-balance leading-relaxed"
            >
              Pakistan's modern sneaker marketplace — discover new & pre-loved
              shoes from Nike, Adidas, Puma, and more. Authentic, curated, and
              affordable.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <button
                onClick={scrollToShop}
                className="px-8 py-4 bg-[#7C8C5C] text-white font-bold rounded-lg hover:bg-[#6B7A4F] transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
              >
                Shop Collection
              </button>
              <button
                className="px-8 py-4 border-2 border-[#2B2B2B] text-[#2B2B2B] font-bold rounded-lg hover:bg-[#2B2B2B] hover:text-white transition-all duration-300 transform hover:scale-105 text-lg"
                onClick={scrollToContact}
              >
                Sell Your Sneakers
              </button>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-6"
            >
              <motion.div
                variants={badgeVariants}
                className="flex items-center gap-3 text-sm font-semibold text-[#2B2B2B]"
              >
                <div className="w-3 h-3 bg-[#7C8C5C] rounded-full"></div>
                Trusted by 1000+ sneakerheads
              </motion.div>
              <motion.div
                variants={badgeVariants}
                className="flex items-center gap-3 text-sm font-semibold text-[#2B2B2B]"
              >
                <div className="w-3 h-3 bg-[#7C8C5C] rounded-full"></div>
                Authenticity Guaranteed
              </motion.div>
              <motion.div
                variants={badgeVariants}
                className="flex items-center gap-3 text-sm font-semibold text-[#2B2B2B]"
              >
                <div className="w-3 h-3 bg-[#7C8C5C] rounded-full"></div>
                Fast Shipping in Pakistan
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right side - Hero image */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <div className="relative w-full flex items-center justify-center overflow-hidden">
              <img
                src="/hero.png"
                alt="Premium thrift sneaker collection"
                className="w-full h-full object-cover scale-125"
              />
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="absolute -top-6 -right-6 w-24 h-24 bg-[#7C8C5C] rounded-full opacity-20 blur-2xl"
            ></motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                delay: 0.5,
              }}
              className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#2B2B2B] rounded-full opacity-10 blur-3xl"
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
