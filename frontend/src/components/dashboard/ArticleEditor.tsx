import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CheckIcon,
  EyeIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import RichTextEditor from './RichTextEditor';
import PreviewModal from './PreviewModal';
import type { Article } from '../../types/dashboard';
import { articleService } from '../../services/articleService';
import { authUtils } from '../../utils/auth';

const ArticleEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = id && id !== 'new';
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState<Partial<Article>>(() => {
    const currentUser = authUtils.getCurrentUser();
    return {
      title: '',
      content: '',
      images: [],
      author: currentUser?.name || '',
      category: ''
    };
  });
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const categories = ['Education', 'Health', 'STEM', 'Community', 'Mental Health', 'Technology', 'Media', 'Sustainability', 'Digital', 'Feminism', 'Environment', 'Policy', 'Activism', 'Culture', 'Economics', 'Academic', 'Global'];

  useEffect(() => {
    if (isEditing) {
      loadArticle();
    }
  }, [id, isEditing]);

  const loadArticle = async () => {
    if (!id || id === 'new') return;
    
    try {
      setLoading(true);
      const response = await articleService.getArticleById(id);
      if (response.data) {
        const articleData = Array.isArray(response.data) ? response.data[0] : response.data;
        setArticle(articleData);
      } else {
        console.error('No article data found');
        navigate('/dashboard/articles');
      }
    } catch (error) {
      console.error('Failed to load article:', error);
      navigate('/dashboard/articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      if (!article.title?.trim()) {
        alert('Title is required');
        setSaving(false);
        return;
      }
      
      if (!article.content?.trim()) {
        alert('Content is required');
        setSaving(false);
        return;
      }
      
      const articleData = {
        title: article.title?.trim() || '',
        content: article.content?.trim() || '',
        author: article.author?.trim() || '',
        category: article.category?.trim() || '',
        images: article.images || [] // This will be used for existingImages in the service
      };
      
     
      if (isEditing && id) {
        await articleService.updateArticle(id, articleData, newImageFiles);
      } else {
        await articleService.createArticle(articleData as Omit<Article, 'id'>, newImageFiles);
      }
      navigate('/dashboard/articles');
    } catch (error: any) {
      console.error('Failed to save article:', error);
      console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        }
      });
      
      let errorMessage = 'Unknown error occurred';
      
      if (error.response?.status === 500) {
        errorMessage = `Server Error (500): The backend server encountered an internal error. Please check if the server is running properly and check the server logs for more details.`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.statusText) {
        errorMessage = `${error.response.status} ${error.response.statusText}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Failed to save article: ${errorMessage}\n\nCheck console for detailed error information.`);
    } finally {
      setSaving(false);
    }
  };


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      
      // Validate file types and sizes
      const validFiles = [];
      const maxSize = 10 * 1024 * 1024; // 10MB per file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      
      for (const file of fileArray) {
        // Check file type
        if (!allowedTypes.includes(file.type.toLowerCase())) {
          alert(`File "${file.name}" is not a supported image type. Supported types: JPEG, PNG, GIF, WebP, SVG`);
          continue;
        }
        
        // Check file size
        if (file.size > maxSize) {
          alert(`File "${file.name}" is too large. Maximum size is 10MB per file.`);
          continue;
        }
        
        // Check if file name has any problematic characters
        if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
          alert(`File "${file.name}" has invalid characters. Please use only letters, numbers, dots, hyphens, and underscores.`);
          continue;
        }
        
        validFiles.push(file);
      }
      
      if (validFiles.length === 0) {
        return; // No valid files to process
      }
      
      // Limit to 10 images total
      const currentImageCount = (article.images?.length || 0) + newImageFiles.length;
      const remainingSlots = 10 - currentImageCount;
      const filesToAdd = validFiles.slice(0, remainingSlots);
      
      if (filesToAdd.length < validFiles.length) {
        alert(`Maximum 10 images allowed. Only ${filesToAdd.length} images will be added.`);
      }
      
      // Add new files
      setNewImageFiles(prev => [...prev, ...filesToAdd]);
      
      // Create preview URLs
      filesToAdd.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          if (imageUrl) {
            setImagePreview(prev => [...prev, imageUrl]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (indexToRemove: number, isExisting: boolean = true) => {
    if (isExisting) {
      // Remove from existing images
      setArticle(prev => ({
        ...prev,
        images: prev.images?.filter((_, index) => index !== indexToRemove) || []
      }));
    } else {
      // Remove from new image files
      const newIndex = indexToRemove - (article.images?.length || 0);
      setNewImageFiles(prev => prev.filter((_, index) => index !== newIndex));
      setImagePreview(prev => prev.filter((_, index) => index !== newIndex));
    }
  };


  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-4">
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => navigate('/dashboard/articles')}
            className="p-2 text-[#4D361E] hover:bg-[#E8DDD4] rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </motion.button>
          
          <div>
            <h1 className="text-2xl font-bold text-[#4D361E]">
              {isEditing ? 'Edit Article' : 'New Article'}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            onClick={() => setShowPreview(true)}
            disabled={!article.title || !article.content}
            className="inline-flex items-center px-4 py-2 border border-[#C4A173] text-[#C4A173] rounded-lg hover:bg-[#C4A173] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: (!article.title || !article.content) ? 1 : 1.02 }}
            whileTap={{ scale: (!article.title || !article.content) ? 1 : 0.98 }}
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            Preview
          </motion.button>
          
          <motion.button
            onClick={handleSave}
            disabled={saving || !article.title?.trim() || !article.content?.trim()}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#C4A173] to-[#4D361E] text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
            whileHover={{ scale: (saving || !article.title?.trim() || !article.content?.trim()) ? 1 : 1.02 }}
            whileTap={{ scale: (saving || !article.title?.trim() || !article.content?.trim()) ? 1 : 0.98 }}
            title={
              saving ? 'Saving...' : 
              !article.title?.trim() ? 'Title is required' :
              !article.content?.trim() ? 'Content is required' :
              'Save article'
            }
          >
            <CheckIcon className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Article'}
          </motion.button>
        </div>
      </div>

      {/* Editor Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#4D361E] mb-2">
            Article Title *
          </label>
          <input
            type="text"
            id="title"
            value={article.title || ''}
            onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter your article title..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-xl font-semibold text-[#4D361E] bg-white focus:ring-2 focus:ring-[#C4A173] focus:border-transparent placeholder-gray-400"
          />
        </div>

        {/* Category and Author */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[#4D361E] mb-2">
              Category
            </label>
            <select
              id="category"
              value={article.category || ''}
              onChange={(e) => setArticle(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#4D361E] bg-white focus:ring-2 focus:ring-[#C4A173] focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-[#4D361E] mb-2">
              Author
            </label>
            <input
              type="text"
              id="author"
              value={article.author || ''}
              onChange={(e) => setArticle(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Enter author name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[#4D361E] bg-white focus:ring-2 focus:ring-[#C4A173] focus:border-transparent placeholder-gray-400"
            />
          </div>
        </div>


        {/* Images Upload */}
        <div>
          <label className="block text-sm font-medium text-[#4D361E] mb-2">
            Article Images
          </label>
          
          {/* Image Upload Button */}
          <div className="mb-4">
            <input
              type="file"
              id="imageUpload"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <motion.label
              htmlFor="imageUpload"
              className="inline-flex items-center px-4 py-2 border-2 border-dashed border-[#C4A173] rounded-lg cursor-pointer hover:border-[#4D361E] hover:bg-[#E8DDD4] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PhotoIcon className="w-5 h-5 mr-2 text-[#C4A173]" />
              <span className="text-[#4D361E] font-medium">Upload Images</span>
            </motion.label>
            <p className="text-xs text-gray-500 mt-1">
              You can upload up to 10 images total. Supported formats: JPG, PNG, GIF, WebP
            </p>
            <p className="text-xs text-gray-400">
              Current: {(article.images?.length || 0) + newImageFiles.length}/10 images
            </p>
          </div>

          {/* Image Preview Grid */}
          {((article.images && article.images.length > 0) || imagePreview.length > 0) && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Existing images */}
              {article.images?.map((image, index) => (
                <motion.div
                  key={`existing-${index}`}
                  className="relative group bg-gray-100 rounded-lg overflow-hidden shadow-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <img
                    src={image}
                    alt={`Article image ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <motion.button
                    onClick={() => removeImage(index, true)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </motion.button>
                  <div className="absolute bottom-1 left-1 px-1 py-0.5 bg-blue-500 text-white text-xs rounded">
                    Saved
                  </div>
                </motion.div>
              ))}
              
              {/* New image previews */}
              {imagePreview.map((image, index) => (
                <motion.div
                  key={`new-${index}`}
                  className="relative group bg-gray-100 rounded-lg overflow-hidden shadow-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: (article.images?.length || 0 + index) * 0.1 }}
                >
                  <img
                    src={image}
                    alt={`New image ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <motion.button
                    onClick={() => removeImage((article.images?.length || 0) + index, false)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </motion.button>
                  <div className="absolute bottom-1 left-1 px-1 py-0.5 bg-green-500 text-white text-xs rounded">
                    New
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-[#4D361E] mb-2">
            Content *
          </label>
          <RichTextEditor
            content={article.content || ''}
            onChange={(content) => setArticle(prev => ({ ...prev, content }))}
            placeholder="Start writing your article..."
            className="min-h-[400px]"
          />
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={{
          ...article,
          images: [
            ...(article.images || []),
            ...imagePreview
          ]
        }}
        type="article"
      />
    </motion.div>
  );
};

export default ArticleEditor;