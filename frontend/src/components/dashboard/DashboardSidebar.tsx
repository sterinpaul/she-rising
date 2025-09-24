import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  SparklesIcon,
  ChevronLeftIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  SparklesIcon as SparklesIconSolid
} from '@heroicons/react/24/solid';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
}

const DashboardSidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navItems: NavItem[] = [
    {
      label: 'Overview',
      path: '/dashboard',
      icon: HomeIcon,
      activeIcon: HomeIconSolid
    },
    {
      label: 'Articles',
      path: '/dashboard/articles',
      icon: DocumentTextIcon,
      activeIcon: DocumentTextIconSolid
    },
    {
      label: 'Impacts',
      path: '/dashboard/impacts',
      icon: SparklesIcon,
      activeIcon: SparklesIconSolid
    }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const toggleExpanded = (itemLabel: string) => {
    setExpandedItems(prev => 
      prev.includes(itemLabel) 
        ? prev.filter(item => item !== itemLabel)
        : [...prev, itemLabel]
    );
  };

  const NavItemComponent: React.FC<{ 
    item: NavItem; 
    level?: number;
    parentPath?: string;
  }> = ({ item, level = 0 }) => {
    const active = isActive(item.path);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label.toLowerCase());
    const IconComponent = active ? item.activeIcon : item.icon;

    return (
      <div className="relative">
        <motion.button
          onClick={() => {
            if (hasChildren && !isCollapsed) {
              toggleExpanded(item.label.toLowerCase());
            } else {
              navigate(item.path);
            }
          }}
          className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
            active
              ? 'bg-gradient-to-r from-[#C4A173] to-[#4D361E] text-white shadow-md'
              : 'text-[#4D361E] hover:bg-[#E8DDD4] hover:text-[#391802]'
          } ${level > 0 ? 'ml-4 mr-2' : 'mx-2'}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Icon */}
          <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
            <IconComponent className="w-5 h-5" />
          </div>

          {/* Label */}
          {!isCollapsed && (
            <>
              <span className="ml-3 text-sm font-medium flex-1 text-left">
                {item.label}
              </span>
              
              {/* Badge */}
              {item.badge && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  active ? 'bg-white/20 text-white' : 'bg-[#C4A173] text-white'
                }`}>
                  {item.badge}
                </span>
              )}

              {/* Expand/Collapse Arrow */}
              {hasChildren && (
                <ChevronLeftIcon 
                  className={`w-4 h-4 ml-2 transition-transform ${
                    isExpanded ? '-rotate-90' : ''
                  }`}
                />
              )}
            </>
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-[#4D361E] text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {item.label}
            </div>
          )}
        </motion.button>

        {/* Children */}
        {hasChildren && !isCollapsed && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-1 space-y-1"
          >
            {item.children!.map((child) => (
              <NavItemComponent 
                key={child.path} 
                item={child} 
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bg-white border-r border-gray-200 h-screen flex flex-col z-40 transform transition-transform lg:transform-none ${
          isCollapsed 
            ? '-translate-x-full lg:translate-x-0 lg:w-16' 
            : 'translate-x-0 w-64'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/icons/logo.svg" alt="Logo" className="w-8 h-8" />
                </div>
                <div className="ml-2">
                  <h2 className="text-[#4D361E] font-bold text-lg">SHE RISING</h2>
                  <p className="text-[#6B3410] text-xs">Admin Panel</p>
                </div>
              </motion.div>
            )}

            {isCollapsed && (
              <motion.div
                className="flex items-center justify-center w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <img src="/icons/logo.svg" alt="Logo" className="w-8 h-8" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                onClick={() => navigate('/dashboard/articles/new')}
                className="flex items-center justify-center px-3 py-2 bg-gradient-to-r from-[#C4A173] to-[#4D361E] text-white rounded-lg text-sm font-medium shadow-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <PlusCircleIcon className="w-4 h-4 mr-1" />
                Article
              </motion.button>
              <motion.button
                onClick={() => navigate('/dashboard/impacts/new')}
                className="flex items-center justify-center px-3 py-2 bg-white border border-[#C4A173] text-[#C4A173] rounded-lg text-sm font-medium hover:bg-[#C4A173] hover:text-white transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <PlusCircleIcon className="w-4 h-4 mr-1" />
                Impact
              </motion.button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavItemComponent key={item.path} item={item} />
            ))}
          </div>
        </nav>

        {/* Collapse Toggle */}
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2 text-[#4D361E] hover:bg-[#E8DDD4] rounded-lg transition-colors"
          >
            <ChevronLeftIcon 
              className={`w-5 h-5 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
            {!isCollapsed && <span className="ml-2 text-sm">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;