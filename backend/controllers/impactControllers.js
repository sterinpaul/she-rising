import Joi from 'joi';
import impactHelpers from '../helpers/impactHelpers.js';
import { processImpactImages } from '../utils/cloudinaryUtils.js';

const impactControllers = () => {

    // Get all impacts with optional filtering
    const getAllImpacts = async (req, res) => {
        try {
            const { page = 1, limit = 20, search } = req.query;
            
            // Handle search separately using helper method
            let result;
            if (search) {
                result = await impactHelpers.searchImpacts(search, { page, limit });
            } else {
                result = await impactHelpers.findAllImpacts({}, { page, limit });
            }

            // Process image URLs for display
            const processedImpacts = result.impacts.map(impact => processImpactImages(impact));

            return res.status(200).json({
                status: true,
                data: processedImpacts,
                pagination: result.pagination
            });
        } catch (error) {
            console.error('Get impacts error:', error);
            return res.status(500).json({ 
                status: false, 
                message: 'Error fetching impacts' 
            });
        }
    };

    // Get single impact by ID
    const getImpactById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ 
                    status: false, 
                    message: 'Impact ID is required' 
                });
            }

            const impact = await impactHelpers.findImpactById(id);
            
            if (!impact) {
                return res.status(404).json({ 
                    status: false, 
                    message: 'Impact not found' 
                });
            }

            return res.status(200).json({
                status: true,
                data: processImpactImages(impact)
            });
        } catch (error) {
            console.error('Get impact by ID error:', error);
            return res.status(500).json({ 
                status: false, 
                message: 'Error fetching impact' 
            });
        }
    };

    // Create new impact
    const createImpact = async (req, res) => {
        try {
            const impactSchema = Joi.object({
                title: Joi.string().required().max(200).trim(),
                content: Joi.string().required(),
                date: Joi.alternatives().try(
                    Joi.date(),
                    Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/)
                ).required()
            });

            const { error, value } = impactSchema.validate(req.body);
            
            if (error) {
                return res.status(400).json({ 
                    status: false, 
                    message: error.details[0].message 
                });
            }

            // Handle uploaded images
            const images = [];
            if (req.files && req.files.length > 0) {
                images.push(...req.files.map(file => {
                    return file.path;
                }));
            }

            // Add images to impact data
            value.images = images;

            // Convert date string to Date object if provided
            if (value.date) {
                value.date = new Date(value.date);
            }

            const impact = await impactHelpers.createImpact(value);
            return res.status(201).json({
                status: true,
                message: 'Impact created successfully',
                data: processImpactImages(impact)
            });
        } catch (error) {
            console.error('Create impact error:', error);
            return res.status(500).json({ 
                status: false, 
                message: 'Error creating impact',
                error: error.message 
            });
        }
    };

    // Update impact
    const updateImpact = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ 
                    status: false, 
                    message: 'Impact ID is required' 
                });
            }

            const impactSchema = Joi.object({
                _id: Joi.string().optional(), // Allow _id field for frontend compatibility
                id: Joi.string().optional(), // Allow id field for frontend compatibility
                title: Joi.string().max(200).trim().optional(),
                content: Joi.string().optional(),
                date: Joi.alternatives().try(
                    Joi.date(),
                    Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/)
                ).optional(),
                existingImages: Joi.alternatives().try(
                    Joi.string(),
                    Joi.array().items(Joi.string())
                ).optional(),
                createdAt: Joi.string().optional(), // Allow timestamp fields
                updatedAt: Joi.string().optional(), // Allow timestamp fields
                images: Joi.array().items(Joi.string()).optional() // Allow images array from frontend
            });

            const { error, value } = impactSchema.validate(req.body);
            
            if (error) {
                return res.status(400).json({ 
                    status: false, 
                    message: error.details[0].message 
                });
            }

            // Check if impact exists first
            const impactExists = await impactHelpers.impactExists(id);
            if (!impactExists) {
                return res.status(404).json({ 
                    status: false, 
                    message: 'Impact not found' 
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
            
            // Remove fields that shouldn't be updated in the database
            delete value.existingImages;
            delete value._id;
            delete value.id;
            delete value.createdAt;
            delete value.updatedAt;

            // Convert date string to Date object if provided
            if (value.date) {
                value.date = new Date(value.date);
            }

            const updatedImpact = await impactHelpers.updateImpactById(id, value);

            return res.status(200).json({
                status: true,
                message: 'Impact updated successfully',
                data: processImpactImages(updatedImpact)
            });
        } catch (error) {
            console.error('Update impact error:', error);
            return res.status(500).json({ 
                status: false, 
                message: 'Error updating impact' 
            });
        }
    };

    // Delete impact (soft delete)
    const deleteImpact = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ 
                    status: false, 
                    message: 'Impact ID is required' 
                });
            }

            // Check if impact exists first
            const impactExists = await impactHelpers.impactExists(id);
            if (!impactExists) {
                return res.status(404).json({ 
                    status: false, 
                    message: 'Impact not found' 
                });
            }

            // Soft delete using helper
            await impactHelpers.deleteImpactById(id);

            return res.status(200).json({
                status: true,
                message: 'Impact deleted successfully'
            });
        } catch (error) {
            console.error('Delete impact error:', error);
            return res.status(500).json({ 
                status: false, 
                message: 'Error deleting impact' 
            });
        }
    };

    return {
        getAllImpacts,
        getImpactById,
        createImpact,
        updateImpact,
        deleteImpact
    };
};

export default impactControllers;