import Article from '../models/articles.js';

const articleHelpers = {
    // Get all articles with pagination and filtering
    async findAllArticles(filter = {}, options = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = { _id: -1 },
            populate = '',
            lean = true
        } = options;

        // Always include isActive filter
        const query = { isActive: true, ...filter };

        let articleQuery = Article.find(query)
            .sort(sortBy)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        if (populate) {
            articleQuery = articleQuery.populate(populate);
        }

        if (lean) {
            articleQuery = articleQuery.lean();
        }

        const articles = await articleQuery;
        const total = await Article.countDocuments(query);

        return {
            articles,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        };
    },

    // Get single article by ID
    async findArticleById(id, includeInactive = false) {
        const filter = includeInactive ? { _id: id } : { _id: id, isActive: true };
        return await Article.findOne(filter).lean();
    },

    // Create new article
    async createArticle(articleData) {
        const article = new Article(articleData);
        return await article.save();
    },

    // Update article by ID
    async updateArticleById(id, updateData, options = {}) {
        const { new: returnNew = true, runValidators = true } = options;
        
        // Ensure we only update active articles unless specified
        const filter = options.includeInactive ? { _id: id } : { _id: id, isActive: true };
        
        return await Article.findOneAndUpdate(
            filter,
            updateData,
            { new: returnNew, runValidators }
        );
    },

    // Soft delete article
    async deleteArticleById(id) {
        return await Article.findOneAndUpdate(
            { _id: id, isActive: true },
            { isActive: false },
            { new: true }
        );
    },

    // Hard delete article (use with caution)
    async hardDeleteArticleById(id) {
        return await Article.findByIdAndDelete(id);
    },

    // Check if article exists
    async articleExists(id) {
        return await Article.exists({ _id: id, isActive: true });
    },

    // Get articles by category
    async findArticlesByCategory(category, options = {}) {
        const filter = { category };
        return await this.findAllArticles(filter, options);
    },

    // Get articles by author
    async findArticlesByAuthor(author, options = {}) {
        const filter = { author: new RegExp(author, 'i') };
        return await this.findAllArticles(filter, options);
    },

    // Search articles by title and content
    async searchArticles(searchTerm, options = {}) {
        const filter = {
            $or: [
                { title: new RegExp(searchTerm, 'i') },
                { content: new RegExp(searchTerm, 'i') }
            ]
        };
        return await this.findAllArticles(filter, options);
    },

    // Get article count
    async getArticleCount(filter = {}) {
        const query = { isActive: true, ...filter };
        return await Article.countDocuments(query);
    },

    // Get articles with specific fields only
    async findArticlesWithFields(filter = {}, fields = '', options = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = { _id: -1 }
        } = options;

        const query = { isActive: true, ...filter };

        const articles = await Article.find(query, fields)
            .sort(sortBy)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        return articles;
    },

    // Bulk operations
    async bulkUpdateArticles(filter, updateData) {
        const query = { isActive: true, ...filter };
        return await Article.updateMany(query, updateData);
    },

    async bulkDeleteArticles(filter) {
        const query = { isActive: true, ...filter };
        return await Article.updateMany(query, { isActive: false });
    },

    // Get recent articles
    async getRecentArticles(limit = 5) {
        return await Article.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
    },

    // Get popular articles (you can extend this based on your metrics)
    async getPopularArticles(limit = 5) {
        return await Article.find({ isActive: true })
            .sort({ _id: -1 }) // For now, using creation order. You can add view count field later
            .limit(limit)
            .lean();
    }
};

export default articleHelpers;