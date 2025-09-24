import Article from '../models/articles.js';
import Impact from '../models/impacts.js';

const dashboardControllers = () => {
    
    // Get dashboard overview data (counts + recent items)
    const getDashboardOverview = async (req, res) => {
        try {
            // Get total counts
            const [totalArticles, totalImpacts] = await Promise.all([
                Article.countDocuments({ isActive: true }),
                Impact.countDocuments({ isActive: true })
            ]);

            // Get recent articles (5 most recent)
            const recentArticles = await Article.find({ isActive: true })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title content author category createdAt updatedAt')
                .lean();

            // Get recent impacts (5 most recent)
            const recentImpacts = await Impact.find({ isActive: true })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title content createdAt updatedAt')
                .lean();

            return res.status(200).json({
                status: true,
                message: "Dashboard data retrieved successfully",
                data: {
                    overview: {
                        totalArticles,
                        totalImpacts
                    },
                    recentArticles,
                    recentImpacts
                }
            });

        } catch (error) {
            console.error('Dashboard overview error:', error);
            return res.status(500).json({
                status: false,
                message: "Error retrieving dashboard data"
            });
        }
    };

    // Get dashboard statistics only
    const getDashboardStats = async (req, res) => {
        try {
            const [totalArticles, totalImpacts] = await Promise.all([
                Article.countDocuments({ isActive: true }),
                Impact.countDocuments({ isActive: true })
            ]);

            return res.status(200).json({
                status: true,
                message: "Dashboard statistics retrieved successfully",
                data: {
                    totalArticles,
                    totalImpacts
                }
            });

        } catch (error) {
            console.error('Dashboard stats error:', error);
            return res.status(500).json({
                status: false,
                message: "Error retrieving dashboard statistics"
            });
        }
    };

    // Get recent articles only
    const getRecentArticles = async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 5;
            
            const recentArticles = await Article.find({ isActive: true })
                .sort({ createdAt: -1 })
                .limit(limit)
                .select('title content author category createdAt updatedAt')
                .lean();

            return res.status(200).json({
                status: true,
                message: "Recent articles retrieved successfully",
                data: recentArticles
            });

        } catch (error) {
            console.error('Recent articles error:', error);
            return res.status(500).json({
                status: false,
                message: "Error retrieving recent articles"
            });
        }
    };

    // Get recent impacts only
    const getRecentImpacts = async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 5;
            
            const recentImpacts = await Impact.find({ isActive: true })
                .sort({ createdAt: -1 })
                .limit(limit)
                .select('title content createdAt updatedAt')
                .lean();

            return res.status(200).json({
                status: true,
                message: "Recent impacts retrieved successfully",
                data: recentImpacts
            });

        } catch (error) {
            console.error('Recent impacts error:', error);
            return res.status(500).json({
                status: false,
                message: "Error retrieving recent impacts"
            });
        }
    };

    return {
        getDashboardOverview,
        getDashboardStats,
        getRecentArticles,
        getRecentImpacts
    };
};

export default dashboardControllers;