import Joi from 'joi';
import articleHelpers from '../helpers/articleHelpers.js';

const articleControllers = () => {

    // Get all articles with optional filtering
    const getAllArticles = async (req, res) => {
        try {
            const { page = 1, limit = 20, category, author, search } = req.query;
            
            // Build filter object
            const filter = {};
            if (category) filter.category = category;
            if (author) filter.author = new RegExp(author, 'i');
            
            // Handle search separately using helper method
            let result;
            if (search) {
                result = await articleHelpers.searchArticles(search, { page, limit });
            } else {
                result = await articleHelpers.findAllArticles(filter, { page, limit });
            }

            return res.status(200).json({
                status: true,
                data: result.articles,
                pagination: result.pagination
            });
        } catch (error) {
            console.error('Get articles error:', error);
            return res.status(500).json({ 
                status: false, 
                message: 'Error fetching articles' 
            });
        }
    };

    // Get single article by ID
    const getArticleById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ 
                    status: false, 
                    message: 'Article ID is required' 
                });
            }

            const article = await articleHelpers.findArticleById(id);
            
            if (!article) {
                return res.status(404).json({ 
                    status: false, 
                    message: 'Article not found' 
                });
            }

            return res.status(200).json({
                status: true,
                data: article
            });
        } catch (error) {
            console.error('Get article by ID error:', error);
            return res.status(500).json({ 
                status: false, 
                message: 'Error fetching article' 
            });
        }
    };

    // Create new article
    const createArticle = async (req, res) => {
        try {
            const articleSchema = Joi.object({
                title: Joi.string().required().max(200).trim(),
                content: Joi.string().required(),
                author: Joi.string().optional(),
                category: Joi.string().valid(
                    'Education', 'Health', 'STEM', 'Community', 'Mental Health', 
                    'Technology', 'Media', 'Sustainability', 'Digital', 'Feminism', 
                    'Environment', 'Policy', 'Activism', 'Culture', 'Economics', 
                    'Academic', 'Global'
                ).optional()
            });

            const { error, value } = articleSchema.validate(req.body);
            
            if (error) {
                return res.status(400).json({ 
                    status: false, 
                    message: error.details[0].message 
                });
            }

            // Handle uploaded images
            const images = [];
            if (req.files && req.files.length > 0) {
                images.push(...req.files.map(file => file.path));
            }

            // Add images to article data
            value.images = images;

            const article = await articleHelpers.createArticle(value);

            return res.status(201).json({
                status: true,
                message: 'Article created successfully',
                data: article
            });
        } catch (error) {
            console.error('Create article error:', error);
            return res.status(500).json({ 
                status: false, 
                message: 'Error creating article' 
            });
        }
    };

    // Update article
    const updateArticle = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ 
                    status: false, 
                    message: 'Article ID is required' 
                });
            }

            const articleSchema = Joi.object({
                title: Joi.string().max(200).trim().optional(),
                content: Joi.string().optional(),
                author: Joi.string().optional(),
                category: Joi.string().valid(
                    'Education', 'Health', 'STEM', 'Community', 'Mental Health', 
                    'Technology', 'Media', 'Sustainability', 'Digital', 'Feminism', 
                    'Environment', 'Policy', 'Activism', 'Culture', 'Economics', 
                    'Academic', 'Global'
                ).optional(),
                existingImages: Joi.alternatives().try(
                    Joi.string(),
                    Joi.array().items(Joi.string())
                ).optional()
            });

            const { error, value } = articleSchema.validate(req.body);
            
            if (error) {
                return res.status(400).json({ 
                    status: false, 
                    message: error.details[0].message 
                });
            }

            // Check if article exists first
            const articleExists = await articleHelpers.articleExists(id);
            if (!articleExists) {
                return res.status(404).json({ 
                    status: false, 
                    message: 'Article not found' 
                });
            }

            // Handle new uploaded images
            const newImages = [];
            if (req.files && req.files.length > 0) {
                newImages.push(...req.files.map(file => file.path));
            }

            // Combine existing images with new ones
            // Handle case where existingImages might be a single string or an array
            let existingImages = value.existingImages || [];
            if (typeof existingImages === 'string') {
                existingImages = [existingImages];
            }
            value.images = [...existingImages, ...newImages];
            
            // Remove existingImages from the value object as it's not part of the schema
            delete value.existingImages;

            const updatedArticle = await articleHelpers.updateArticleById(id, value);

            return res.status(200).json({
                status: true,
                message: 'Article updated successfully',
                data: updatedArticle
            });
        } catch (error) {
            console.error('Update article error:', error);
            return res.status(500).json({ 
                status: false, 
                message: 'Error updating article' 
            });
        }
    };

    // Delete article
    const deleteArticle = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ 
                    status: false, 
                    message: 'Article ID is required' 
                });
            }

            // Check if article exists first
            const articleExists = await articleHelpers.articleExists(id);
            if (!articleExists) {
                return res.status(404).json({ 
                    status: false, 
                    message: 'Article not found' 
                });
            }

            // Soft delete using helper
            await articleHelpers.deleteArticleById(id);

            return res.status(200).json({
                status: true,
                message: 'Article deleted successfully'
            });
        } catch (error) {
            console.error('Delete article error:', error);
            return res.status(500).json({ 
                status: false, 
                message: 'Error deleting article' 
            });
        }
    };

    return {
        getAllArticles,
        getArticleById,
        createArticle,
        updateArticle,
        deleteArticle
    };
};

export default articleControllers;