import { Router, Response } from 'express';
import { Product } from '../models/Product.js';
import { verifyToken, AuthRequest, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Get all products with filters
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { category, careLevel, minPrice, maxPrice, search, page = 1, limit = 20 } = req.query;

    const filters: any = {};
    if (category) filters.category = category;
    if (careLevel) filters.careLevel = careLevel;
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { scientificName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filters).skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(filters);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      code: 'FETCH_PRODUCTS_ERROR',
    });
  }
});

// Get product by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND',
      });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      code: 'FETCH_PRODUCT_ERROR',
    });
  }
});

// Create product (admin only)
router.post('/', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to create product',
      code: 'CREATE_PRODUCT_ERROR',
    });
  }
});

// Update product (admin only)
router.put('/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND',
      });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to update product',
      code: 'UPDATE_PRODUCT_ERROR',
    });
  }
});

// Delete product (admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND',
      });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
      code: 'DELETE_PRODUCT_ERROR',
    });
  }
});

export default router;
