import Impact from '../models/impacts.js';

const impactHelpers = {
    // Get all impacts with pagination and filtering
    async findAllImpacts(filter = {}, options = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = { createdAt: -1 },
            populate = '',
            lean = true
        } = options;

        // Always include isActive filter
        const query = { isActive: true, ...filter };

        let impactQuery = Impact.find(query)
            .sort(sortBy)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        if (populate) {
            impactQuery = impactQuery.populate(populate);
        }

        if (lean) {
            impactQuery = impactQuery.lean();
        }

        const impacts = await impactQuery;
        const total = await Impact.countDocuments(query);

        return {
            impacts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        };
    },

    // Get single impact by ID
    async findImpactById(id, includeInactive = false) {
        const filter = includeInactive ? { _id: id } : { _id: id, isActive: true };
        return await Impact.findOne(filter).lean();
    },

    // Create new impact
    async createImpact(impactData) {
        const impact = new Impact(impactData);
        return await impact.save();
    },

    // Update impact by ID
    async updateImpactById(id, updateData, options = {}) {
        const { new: returnNew = true, runValidators = true } = options;
        
        // Ensure we only update active impacts unless specified
        const filter = options.includeInactive ? { _id: id } : { _id: id, isActive: true };
        
        return await Impact.findOneAndUpdate(
            filter,
            updateData,
            { new: returnNew, runValidators }
        );
    },

    // Soft delete impact
    async deleteImpactById(id) {
        return await Impact.findOneAndUpdate(
            { _id: id, isActive: true },
            { isActive: false },
            { new: true }
        );
    },

    // Hard delete impact (use with caution)
    async hardDeleteImpactById(id) {
        return await Impact.findByIdAndDelete(id);
    },

    // Check if impact exists
    async impactExists(id) {
        return await Impact.exists({ _id: id, isActive: true });
    },

    // Search impacts by title and content
    async searchImpacts(searchTerm, options = {}) {
        const filter = {
            $or: [
                { title: new RegExp(searchTerm, 'i') },
                { content: new RegExp(searchTerm, 'i') }
            ]
        };
        return await this.findAllImpacts(filter, options);
    },

    // Get impact count
    async getImpactCount(filter = {}) {
        const query = { isActive: true, ...filter };
        return await Impact.countDocuments(query);
    },

    // Get impacts with specific fields only
    async findImpactsWithFields(filter = {}, fields = '', options = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = { createdAt: -1 }
        } = options;

        const query = { isActive: true, ...filter };

        const impacts = await Impact.find(query, fields)
            .sort(sortBy)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        return impacts;
    },

    // Bulk operations
    async bulkUpdateImpacts(filter, updateData) {
        const query = { isActive: true, ...filter };
        return await Impact.updateMany(query, updateData);
    },

    async bulkDeleteImpacts(filter) {
        const query = { isActive: true, ...filter };
        return await Impact.updateMany(query, { isActive: false });
    },

    // Get recent impacts
    async getRecentImpacts(limit = 5) {
        return await Impact.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
    },

    // Get impacts by date range
    async getImpactsByDateRange(startDate, endDate, options = {}) {
        const filter = {
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };
        return await this.findAllImpacts(filter, options);
    },

    // Get impacts with images
    async getImpactsWithImages(options = {}) {
        const filter = {
            images: { $exists: true, $not: { $size: 0 } }
        };
        return await this.findAllImpacts(filter, options);
    },

    // Get impact statistics
    async getImpactStats() {
        const totalImpacts = await this.getImpactCount();
        const recentImpacts = await this.getImpactCount({
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        });
        
        return {
            total: totalImpacts,
            recent: recentImpacts,
            growth: totalImpacts > 0 ? ((recentImpacts / totalImpacts) * 100).toFixed(2) : 0
        };
    }
};

export default impactHelpers;