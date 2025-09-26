import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CheckIcon,
  EyeIcon,
  PhotoIcon,
  XMarkIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import RichTextEditor from './RichTextEditor';
import PreviewModal from './PreviewModal';
import type { Impact } from '../../types/dashboard';
import { impactService } from '../../services/impactService';

const ImpactEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = id && id !== 'new';
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [impact, setImpact] = useState<Partial<Impact>>({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0], // Default to today's date
    images: []
  });
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadImpact();
    }
  }, [id, isEditing]);

  const loadImpact = async () => {
    if (!id || id === 'new') return;
    
    try {
      setLoading(true);
      const response = await impactService.getImpactById(id);
      if (response.data) {
        const impactData = Array.isArray(response.data) ? response.data[0] : response.data;
        
        // Convert date to YYYY-MM-DD format for HTML date input
        if (impactData.date) {
          impactData.date = new Date(impactData.date).toISOString().split('T')[0];
        } else {
          // If no date exists (for legacy impacts), default to today's date
          impactData.date = new Date().toISOString().split('T')[0];
        }
        
        setImpact(impactData);
      } else {
        console.error('No impact data found');
        navigate('/dashboard/impacts');
      }
    } catch (error) {
      console.error('Failed to load impact:', error);
      navigate('/dashboard/impacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Add validation logging
      console.log('Save attempt - Impact data:', {
        title: impact.title,
        content: impact.content,
        date: impact.date
      });
      
      // Validate required fields
      if (!impact.title?.trim()) {
        alert('Title is required');
        return;
      }
      
      if (!impact.content?.trim()) {
        alert('Content is required');
        return;
      }
      
      if (!impact.date?.trim()) {
        alert('Date is required');
        return;
      }
      
      const impactData = {
        title: impact.title?.trim(),
        content: impact.content?.trim(),
        date: impact.date?.trim(),
        images: impact.images // This will be used for existingImages in the service
      };

      console.log('Attempting to save with data:', impactData);

      if (isEditing && id) {
        console.log('Updating impact with ID:', id);
        await impactService.updateImpact(id, impactData, newImageFiles);
      } else {
        console.log('Creating new impact');
        await impactService.createImpact(impactData as Omit<Impact, 'id' | 'createdAt'>, newImageFiles);
      }

      console.log('Save successful, navigating to impacts list');
      navigate('/dashboard/impacts');
    } catch (error: any) {
      console.error('Failed to save impact:', error);
      alert(`Failed to save impact: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      
      // Limit to 10 images total
      const currentImageCount = (impact.images?.length || 0) + newImageFiles.length;
      const remainingSlots = 10 - currentImageCount;
      const filesToAdd = fileArray.slice(0, remainingSlots);
      
      if (filesToAdd.length < fileArray.length) {
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
      setImpact(prev => ({
        ...prev,
        images: prev.images?.filter((_, index) => index !== indexToRemove) || []
      }));
    } else {
      // Remove from new image files
      const newIndex = indexToRemove - (impact.images?.length || 0);
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
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
            onClick={() => navigate('/dashboard/impacts')}
            className="p-2 text-[#4D361E] hover:bg-[#E8DDD4] rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </motion.button>
          
          <div>
            <h1 className="text-2xl font-bold text-[#4D361E]">
              {isEditing ? 'Edit Impact' : 'New Impact'}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            onClick={() => setShowPreview(true)}
            disabled={!impact.title || !impact.content}
            className="inline-flex items-center px-4 py-2 border border-[#C4A173] text-[#C4A173] rounded-lg hover:bg-[#C4A173] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: (!impact.title || !impact.content) ? 1 : 1.02 }}
            whileTap={{ scale: (!impact.title || !impact.content) ? 1 : 0.98 }}
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            Preview
          </motion.button>
          
          <motion.button
            onClick={handleSave}
            disabled={saving || !impact.title?.trim() || !impact.content?.trim() || !impact.date?.trim()}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#C4A173] to-[#4D361E] text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
            whileHover={{ scale: (saving || !impact.title?.trim() || !impact.content?.trim() || !impact.date?.trim()) ? 1 : 1.02 }}
            whileTap={{ scale: (saving || !impact.title?.trim() || !impact.content?.trim() || !impact.date?.trim()) ? 1 : 0.98 }}
            title={
              saving ? 'Saving...' : 
              !impact.title?.trim() ? 'Title is required' :
              !impact.content?.trim() ? 'Content is required' :
              !impact.date?.trim() ? 'Date is required' :
              'Save impact'
            }
          >
            <CheckIcon className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Impact'}
          </motion.button>
        </div>
      </div>


      {/* Editor Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#4D361E] mb-2">
            Impact Title *
          </label>
          <input
            type="text"
            id="title"
            value={impact.title || ''}
            onChange={(e) => setImpact(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter your impact title..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-xl font-semibold text-[#4D361E] bg-white focus:ring-2 focus:ring-[#C4A173] focus:border-transparent placeholder-gray-400"
          />
        </div>

        {/* Impact Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-[#4D361E] mb-2">
            Impact Date *
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              id="date"
              value={impact.date || ''}
              onChange={(e) => setImpact(prev => ({ ...prev, date: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-[#4D361E] bg-white focus:ring-2 focus:ring-[#C4A173] focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Select the date when this impact occurred
          </p>
        </div>

        {/* Images Upload */}
        <div>
          <label className="block text-sm font-medium text-[#4D361E] mb-2">
            Impact Images
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
              Current: {(impact.images?.length || 0) + newImageFiles.length}/10 images
            </p>
          </div>

          {/* Image Preview Grid */}
          {((impact.images && impact.images.length > 0) || imagePreview.length > 0) && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Existing images */}
              {impact.images?.map((image, index) => (
                <motion.div
                  key={`existing-${index}`}
                  className="relative group bg-gray-100 rounded-lg overflow-hidden shadow-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <img
                    src={image}
                    alt={`Impact image ${index + 1}`}
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
                  transition={{ duration: 0.3, delay: (impact.images?.length || 0 + index) * 0.1 }}
                >
                  <img
                    src={image}
                    alt={`New image ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <motion.button
                    onClick={() => removeImage((impact.images?.length || 0) + index, false)}
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
            content={impact.content || ''}
            onChange={(content) => setImpact(prev => ({ ...prev, content }))}
            placeholder="Start writing about your impact..."
            className="min-h-[400px]"
          />
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={{
          ...impact,
          images: [
            ...(impact.images || []),
            ...imagePreview
          ]
        }}
        type="impact"
      />
    </motion.div>
  );
};

export default ImpactEditor;