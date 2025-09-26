import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import type { Article } from '../../types/dashboard';
import { articleService } from '../../services/articleService';

// Custom hook for isolated search state management
const useArticleSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const debounceTimeoutRef = useRef<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search term
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    searchInputRef,
    handleSearchChange
  };
};

// Memoized Header Component - Never re-renders
const ArticlesHeader = memo<{
  onNavigate: (path: string) => void;
}>(({ onNavigate }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[#4D361E]">Articles</h1>
        <p className="text-[#6B3410] text-sm mt-1">
          Manage your blog articles and content
        </p>
      </div>
      
      <motion.button
        onClick={() => onNavigate('/dashboard/articles/new')}
        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#C4A173] to-[#4D361E] text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        New Article
      </motion.button>
    </motion.div>
  );
});

// Memoized Filters Component - Only re-renders when search term changes
const ArticlesFilters = memo<{
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}>(({ searchTerm, onSearchChange, categoryFilter, onCategoryChange, categories, searchInputRef }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C4A173] focus:border-transparent text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-[#C4A173] focus:border-transparent text-gray-900"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <FunnelIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
});

// Categories Container - Loads and manages categories
const CategoriesContainer = memo<{
  onCategoriesLoad: (categories: string[]) => void;
}>(({ onCategoriesLoad }) => {
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Load a small sample of articles to extract categories
        const response = await articleService.getAllArticles({ limit: 100 });
        if (response.data) {
          const articlesArray = Array.isArray(response.data) ? response.data : [response.data];
          const uniqueCategories = [...new Set(articlesArray.map(article => article.category).filter((cat): cat is string => Boolean(cat)))];
          onCategoriesLoad(uniqueCategories);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
        onCategoriesLoad([]);
      }
    };

    loadCategories();
  }, [onCategoriesLoad]);

  return null; // This component doesn't render anything
});

// Isolated Articles List Container - Only re-renders when search results change
const ArticlesListContainer = memo<{
  debouncedSearchTerm: string;
  categoryFilter: string;
  onNavigate: (path: string) => void;
}>(({ debouncedSearchTerm, categoryFilter, onNavigate }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });
  const itemsPerPage = 10;

  const loadArticles = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      
      // Build filter object
      const filters = {
        limit: itemsPerPage, 
        page,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...(categoryFilter !== 'all' && { category: categoryFilter })
      };
      
      console.log('🔍 ArticlesList filters:', filters);
      
      const response = await articleService.getAllArticles(filters);
      if (response.data) {
        const articlesArray = Array.isArray(response.data) ? response.data : [response.data];
        setArticles(articlesArray);
        
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, categoryFilter, itemsPerPage]);

  // Reset to page 1 and load articles when search term or category changes
  useEffect(() => {
    console.log('🔄 Filter change:', { search: debouncedSearchTerm, category: categoryFilter });
    setCurrentPage(1);
    loadArticles(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, categoryFilter]);

  // Load articles when page changes
  useEffect(() => {
    loadArticles(currentPage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await articleService.deleteArticle(id);
      await loadArticles(currentPage);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  }, [loadArticles, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = pagination.totalPages;
    
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-4" />
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {articles.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#4D361E] mb-2">No articles found</h3>
            <p className="text-[#6B3410] mb-6">
              {debouncedSearchTerm || categoryFilter !== 'all'
                ? 'Try adjusting your filters to see more articles.'
                : 'Get started by creating your first article.'}
            </p>
            {(!debouncedSearchTerm && categoryFilter === 'all') && (
              <motion.button
                onClick={() => onNavigate('/dashboard/articles/new')}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#C4A173] to-[#4D361E] text-white rounded-lg font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Article
              </motion.button>
            )}
          </div>
        ) : (
          articles.map((article) => {
            // Create excerpt from content (strip HTML, normalize whitespace, and limit to 150 chars)
            const excerpt = article.content 
              ? article.content
                  .replace(/<[^>]*>/g, '') // Remove HTML tags
                  .replace(/\s+/g, ' ') // Normalize whitespace
                  .trim() // Remove leading/trailing whitespace
                  .substring(0, 150) + (article.content.replace(/<[^>]*>/g, '').trim().length > 150 ? '...' : '')
              : 'No content available';
            
            const articleId = article._id || article.id;
            
            return (
              <motion.div
                key={articleId}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-[#4D361E] hover:text-[#391802] cursor-pointer">
                        {article.title}
                      </h3>
                    </div>
                    
                    <p className="text-[#6B3410] mb-3 line-clamp-2 leading-relaxed">
                      {excerpt}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {article.category && (
                        <span className="inline-flex items-center">
                          <span className="w-2 h-2 bg-[#C4A173] rounded-full mr-2" />
                          {article.category}
                        </span>
                      )}
                      <span className="inline-flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {format(new Date(article.createdAt), 'MMM d, yyyy')}
                      </span>
                      {article.author && (
                        <span>
                          {article.author}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <motion.button
                      onClick={() => onNavigate(`/article/${articleId}`)}
                      className="p-2 text-[#6B3410] hover:bg-[#E8DDD4] rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="View"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      onClick={() => onNavigate(`/dashboard/articles/${articleId}/edit`)}
                      className="p-2 text-[#6B3410] hover:bg-[#E8DDD4] rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setDeleteConfirm(articleId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            {/* Previous Button */}
            <motion.button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 bg-white text-[#4D361E] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E8DDD4] transition-colors border border-[#C4A173]"
              whileHover={{ scale: !pagination.hasPrev ? 1 : 1.05 }}
              whileTap={{ scale: !pagination.hasPrev ? 1 : 0.95 }}
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
              disabled={!pagination.hasNext}
              className="px-4 py-2 bg-white text-[#4D361E] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E8DDD4] transition-colors border border-[#C4A173]"
              whileHover={{ scale: !pagination.hasNext ? 1 : 1.05 }}
              whileTap={{ scale: !pagination.hasNext ? 1 : 0.95 }}
            >
              Next ›
            </motion.button>
          </div>
        )}

        {/* Page Info */}
        {articles.length > 0 && (
          <div className="text-center mt-4">
            <p className="text-[#6B3410] text-sm">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, pagination.totalItems)} of {pagination.totalItems} articles
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg font-semibold text-[#4D361E] mb-2">Delete Article</h3>
            <p className="text-[#6B3410] mb-6">
              Are you sure you want to delete this article? This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
});

// Main Articles List Component - Minimally re-renders
const ArticlesList: React.FC = () => {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  
  // Use the isolated search hook
  const { searchTerm, debouncedSearchTerm, searchInputRef, handleSearchChange } = useArticleSearch();

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryFilter(value);
  }, []);


  const handleCategoriesLoad = useCallback((loadedCategories: string[]) => {
    setCategories(loadedCategories);
  }, []);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Categories Loader - Hidden component that loads categories */}
      <CategoriesContainer onCategoriesLoad={handleCategoriesLoad} />

      {/* Header - Never re-renders */}
      <ArticlesHeader onNavigate={handleNavigation} />

      {/* Filters - Only re-renders when search term changes */}
      <ArticlesFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        categoryFilter={categoryFilter}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        searchInputRef={searchInputRef}
      />

      {/* Articles List Container - Only re-renders when search results change */}
      <ArticlesListContainer
        debouncedSearchTerm={debouncedSearchTerm}
        categoryFilter={categoryFilter}
        onNavigate={handleNavigation}
      />
    </motion.div>
  );
};

export default ArticlesList;