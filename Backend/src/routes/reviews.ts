import { Router, Response } from 'express';
import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { verifyToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get product reviews
router.get('/product/:productId', async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
      code: 'FETCH_REVIEWS_ERROR',
    });
  }
});

// Create review
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      productId,
      userId: req.user?.id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this product',
        code: 'REVIEW_EXISTS',
      });
    }

    const review = new Review({
      productId,
      userId: req.user?.id,
      userName: req.body.userName,
      rating,
      title,
      comment,
    });
    await review.save();

    // Update product rating
    const reviews = await Review.find({ productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      reviewCount: reviews.length,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to create review',
      code: 'CREATE_REVIEW_ERROR',
    });
  }
});

// Update review
router.put('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
        code: 'REVIEW_NOT_FOUND',
      });
    }

    if (review.userId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to update review',
      code: 'UPDATE_REVIEW_ERROR',
    });
  }
});

// Delete review
router.delete('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
        code: 'REVIEW_NOT_FOUND',
      });
    }

    if (review.userId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete review',
      code: 'DELETE_REVIEW_ERROR',
    });
  }
});

export default router;
