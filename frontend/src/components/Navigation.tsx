import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const navigateHandler = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }else{
      navigate(`/`,{state: { section }  });
    }
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-white to-[#f7f7f7e7] backdrop-blur-sm">
      <div className="mx-auto px-4 sm:px-6 md:px-10 lg:px-20 max-w-7xl">
        <div className="flex justify-between items-center h-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/icons/logo.svg" alt="Logo" />
            </div>
          </motion.div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={()=>navigateHandler("home")} className="cursor-pointer text-[#8B4513] hover:text-[#391802] transition-colors font-medium text-sm">Home</button>
            <button onClick={()=>navigateHandler("about")} className="cursor-pointer text-[#8B4513] hover:text-[#391802] transition-colors font-medium text-sm">About</button>
            <button onClick={()=>navigateHandler("impact")} className="cursor-pointer text-[#8B4513] hover:text-[#391802] transition-colors font-medium text-sm">Our Impact</button>
            <button onClick={()=>navigateHandler("resources")} className="cursor-pointer text-[#8B4513] hover:text-[#391802] transition-colors font-medium text-sm">Resources</button>
            <button onClick={()=>navigateHandler("contact")} className="cursor-pointer text-[#8B4513] hover:text-[#391802] transition-colors font-medium text-sm">Get Involved</button>
          </div>

          <div className="md:hidden grid place-items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#8B4513]"
            >
              {mobileMenuOpen ? <XMarkIcon className='w-6 h-6' /> : <Bars3Icon className='w-6 h-6' />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden border-t border-[#D4C4B0] bg-[#E8DDD4]"
        >
          <div className="px-4 py-4 space-y-4">
            <button onClick={()=>navigateHandler("home")} className="block text-[#8B4513] hover:text-[#6B3410] transition-colors font-medium text-sm">Home</button>
            <button onClick={()=>navigateHandler("about")} className="block text-[#8B4513] hover:text-[#6B3410] transition-colors font-medium text-sm">About</button>
            <button onClick={()=>navigateHandler("impact")} className="block text-[#8B4513] hover:text-[#6B3410] transition-colors font-medium text-sm">Our Impact</button>
            <button onClick={()=>navigateHandler("resources")} className="block text-[#8B4513] hover:text-[#6B3410] transition-colors font-medium text-sm">Resources</button>
            <button onClick={()=>navigateHandler("contact")} className="block text-[#8B4513] hover:text-[#6B3410] transition-colors font-medium text-sm">Get Involved</button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navigation;