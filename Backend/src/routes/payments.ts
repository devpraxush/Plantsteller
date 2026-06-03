import { Router, Response } from 'express';
import { Order } from '../models/Order.js';
import { verifyToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Create payment intent
router.post('/intent', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        code: 'ORDER_NOT_FOUND',
      });
    }

    // Authorize order
    if (order.userId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    // TODO: Integrate Stripe
    // For now, return mock response
    const clientSecret = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.json({
      success: true,
      data: {
        clientSecret,
        amount: order.total,
        orderId: order._id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create payment intent',
      code: 'PAYMENT_INTENT_ERROR',
    });
  }
});

// Confirm payment
router.post('/confirm', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, paymentId } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'completed',
        paymentId,
        status: 'processing',
      },
      { new: true }
    );

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to confirm payment',
      code: 'PAYMENT_CONFIRM_ERROR',
    });
  }
});

// Get payment status
router.get('/:orderId', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        code: 'ORDER_NOT_FOUND',
      });
    }

    if (order.userId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order._id,
        paymentStatus: order.paymentStatus,
        amount: order.total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get payment status',
      code: 'PAYMENT_STATUS_ERROR',
    });
  }
});

export default router;
