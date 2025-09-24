# Helper Functions Documentation

## Overview

The helper functions provide a clean separation of concerns by abstracting database operations away from controllers. This improves code reusability, maintainability, and makes testing easier.

## Architecture Benefits

- ✅ **Separation of Concerns**: Controllers handle HTTP logic, helpers handle database operations
- ✅ **Reusability**: Helper functions can be used across multiple controllers
- ✅ **Testability**: Database operations can be unit tested independently
- ✅ **Consistency**: Standardized query patterns across the application
- ✅ **Maintainability**: Database logic centralized in one place

## Article Helpers (`/helpers/articleHelpers.js`)

### Core Functions

#### `findAllArticles(filter = {}, options = {})`
Get articles with pagination and filtering support.

**Parameters:**
- `filter`: MongoDB filter object (additional to isActive)
- `options`: Configuration object
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `sortBy`: Sort order (default: { _id: -1 })
  - `populate`: Fields to populate
  - `lean`: Return plain objects (default: true)

**Returns:** Object with `articles` array and `pagination` info

**Example:**
```javascript
// Get articles with custom filter
const result = await articleHelpers.findAllArticles(
  { category: 'Technology' },
  { page: 2, limit: 5 }
);
```

#### `findArticleById(id, includeInactive = false)`
Get single article by ID.

**Example:**
```javascript
const article = await articleHelpers.findArticleById('64f5b2c8d9e1a2b3c4d5e6f7');
```

#### `createArticle(articleData)`
Create new article.

**Example:**
```javascript
const newArticle = await articleHelpers.createArticle({
  title: 'New Article',
  content: 'Article content here...',
  category: 'Technology'
});
```

#### `updateArticleById(id, updateData, options = {})`
Update existing article.

**Example:**
```javascript
const updated = await articleHelpers.updateArticleById(
  '64f5b2c8d9e1a2b3c4d5e6f7',
  { title: 'Updated Title' }
);
```

#### `deleteArticleById(id)`
Soft delete article (sets isActive: false).

**Example:**
```javascript
await articleHelpers.deleteArticleById('64f5b2c8d9e1a2b3c4d5e6f7');
```

### Specialized Functions

#### `searchArticles(searchTerm, options = {})`
Search articles by title and content.

**Example:**
```javascript
const results = await articleHelpers.searchArticles('technology', { limit: 5 });
```

#### `findArticlesByCategory(category, options = {})`
Get articles by specific category.

**Example:**
```javascript
const techArticles = await articleHelpers.findArticlesByCategory('Technology');
```

#### `findArticlesByAuthor(author, options = {})`
Get articles by author (case-insensitive search).

**Example:**
```javascript
const authorArticles = await articleHelpers.findArticlesByAuthor('John Doe');
```

#### `getRecentArticles(limit = 5)`
Get most recently created articles.

**Example:**
```javascript
const recent = await articleHelpers.getRecentArticles(10);
```

### Utility Functions

#### `articleExists(id)`
Check if article exists and is active.

#### `getArticleCount(filter = {})`
Get count of articles matching filter.

#### `bulkUpdateArticles(filter, updateData)`
Update multiple articles matching filter.

#### `bulkDeleteArticles(filter)`
Soft delete multiple articles matching filter.

## Impact Helpers (`/helpers/impactHelpers.js`)

### Core Functions

Similar to article helpers but for Impact model:

- `findAllImpacts(filter, options)`
- `findImpactById(id, includeInactive)`
- `createImpact(impactData)`
- `updateImpactById(id, updateData, options)`
- `deleteImpactById(id)`

### Specialized Functions

#### `searchImpacts(searchTerm, options = {})`
Search impacts by title and content.

#### `getImpactsByDateRange(startDate, endDate, options = {})`
Get impacts within date range.

**Example:**
```javascript
const impacts = await impactHelpers.getImpactsByDateRange(
  '2024-01-01',
  '2024-12-31'
);
```

#### `getImpactsWithImages(options = {})`
Get impacts that have images.

#### `getImpactStats()`
Get impact statistics (total, recent growth).

**Example:**
```javascript
const stats = await impactHelpers.getImpactStats();
// Returns: { total: 150, recent: 12, growth: "8.00" }
```

## Controller Integration Examples

### Before (Direct Database Calls)
```javascript
// Old approach - controller handles database logic
const getAllArticles = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const articles = await Article.find({ isActive: true })
    .sort({ _id: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();
    
  const total = await Article.countDocuments({ isActive: true });
  
  // ... pagination logic
};
```

### After (Using Helpers)
```javascript
// New approach - clean controller using helpers
const getAllArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const result = await articleHelpers.findAllArticles({}, { page, limit });
    
    return res.status(200).json({
      status: true,
      data: result.articles,
      pagination: result.pagination
    });
  } catch (error) {
    // Error handling
  }
};
```

## Advanced Usage Patterns

### Complex Filtering
```javascript
// Controller
const getFilteredArticles = async (req, res) => {
  const { category, author, search } = req.query;
  
  if (search) {
    // Use search helper
    result = await articleHelpers.searchArticles(search, options);
  } else if (category) {
    // Use category helper
    result = await articleHelpers.findArticlesByCategory(category, options);
  } else if (author) {
    // Use author helper
    result = await articleHelpers.findArticlesByAuthor(author, options);
  } else {
    // Use general helper
    result = await articleHelpers.findAllArticles({}, options);
  }
};
```

### Custom Queries
```javascript
// For special cases, you can still build custom filters
const getCustomArticles = async (req, res) => {
  const customFilter = {
    category: { $in: ['Technology', 'Science'] },
    createdAt: { $gte: new Date('2024-01-01') }
  };
  
  const result = await articleHelpers.findAllArticles(customFilter, {
    sortBy: { createdAt: -1 },
    populate: 'author'
  });
};
```

## Error Handling

All helper functions throw errors that should be caught in controllers:

```javascript
const getArticleById = async (req, res) => {
  try {
    const article = await articleHelpers.findArticleById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ 
        status: false, 
        message: 'Article not found' 
      });
    }
    
    res.json({ status: true, data: article });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ 
      status: false, 
      message: 'Error fetching article' 
    });
  }
};
```

## Testing Helper Functions

Helper functions can be unit tested independently:

```javascript
// test/helpers/articleHelpers.test.js
import articleHelpers from '../../helpers/articleHelpers.js';

describe('Article Helpers', () => {
  test('should create article with valid data', async () => {
    const articleData = {
      title: 'Test Article',
      content: 'Test content',
      category: 'Technology'
    };
    
    const result = await articleHelpers.createArticle(articleData);
    
    expect(result.title).toBe('Test Article');
    expect(result.isActive).toBe(true);
  });
  
  test('should find articles with pagination', async () => {
    const result = await articleHelpers.findAllArticles({}, { 
      page: 1, 
      limit: 5 
    });
    
    expect(result.articles).toHaveLength(5);
    expect(result.pagination.currentPage).toBe(1);
  });
});
```

## Best Practices

1. **Always use helpers in controllers** - Avoid direct model calls
2. **Handle errors in controllers** - Let helpers throw errors
3. **Use consistent naming** - follow `findX`, `createX`, `updateX` patterns
4. **Keep helpers focused** - One responsibility per function
5. **Add new helper methods** as needed for specific use cases
6. **Test helper functions** separately from controllers
7. **Document complex filters** and query logic

## Migration Guide

If you have existing controllers with direct database calls:

1. **Identify database operations** in controllers
2. **Replace with appropriate helper calls**
3. **Update error handling** to catch helper errors
4. **Test thoroughly** to ensure functionality remains the same
5. **Add any missing helper methods** for specific use cases

This approach ensures your codebase remains maintainable and follows separation of concerns principles!