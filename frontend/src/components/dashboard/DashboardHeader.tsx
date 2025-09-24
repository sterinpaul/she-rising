import { motion } from 'framer-motion';
import { 
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { authUtils } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onToggleSidebar?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle, onToggleSidebar }) => {
  const navigate = useNavigate();
  const user = authUtils.getCurrentUser();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await authUtils.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect to login on error
      navigate('/login');
    }
  };

  return (
    <motion.header 
      className="bg-white border-b border-gray-200 px-6 py-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button & Title Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          {onToggleSidebar && (
            <motion.button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-[#4D361E] hover:bg-[#E8DDD4] rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bars3Icon className="w-6 h-6" />
            </motion.button>
          )}
          
          {/* Title */}
          <div>
            <motion.h1 
              className="text-xl md:text-2xl font-bold text-[#4D361E] mb-1"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p 
                className="text-[#6B3410] text-sm hidden md:block"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* User Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-[#E8DDD4] rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-[#C4A173] to-[#4D361E] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>

              {/* User Info */}
              <div className="text-left hidden md:block">
                <p className="text-[#4D361E] text-sm font-medium">{user?.name || ''}</p>
                <p className="text-[#6B3410] text-xs">{user?.role || 'Administrator'}</p>
              </div>

              <ChevronDownIcon 
                className={`w-4 h-4 text-[#6B3410] transition-transform ${
                  showUserMenu ? 'rotate-180' : ''
                }`} 
              />
            </motion.button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-[#4D361E] text-sm font-medium">{user?.name}</p>
                  <p className="text-[#6B3410] text-xs">{user?.email}</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Click overlay to close dropdown */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </motion.header>
  );
};

export default DashboardHeader;