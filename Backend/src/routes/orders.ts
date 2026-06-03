import { Router, Response } from 'express';
import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { verifyToken, AuthRequest, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Get user's orders
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      code: 'FETCH_ORDERS_ERROR',
    });
  }
});

// Get order by ID
router.get('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        code: 'ORDER_NOT_FOUND',
      });
    }

    // Check authorization
    if (order.userId !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      code: 'FETCH_ORDER_ERROR',
    });
  }
});

// Create order from cart
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { shippingAddress } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user?.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty',
        code: 'EMPTY_CART',
      });
    }

    // Create order
    const order = new Order({
      userId: req.user?.id,
      items: cart.items,
      total: cart.total,
      shippingAddress,
      paymentStatus: 'pending',
    });
    await order.save();

    // Clear cart
    await Cart.deleteOne({ userId: req.user?.id });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to create order',
      code: 'CREATE_ORDER_ERROR',
    });
  }
});

// Update order status (admin only)
router.put('/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, trackingNumber },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        code: 'ORDER_NOT_FOUND',
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to update order',
      code: 'UPDATE_ORDER_ERROR',
    });
  }
});

// Cancel order
router.delete('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        code: 'ORDER_NOT_FOUND',
      });
    }

    // Check authorization
    if (order.userId !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    await Order.findByIdAndUpdate(req.params.id, { status: 'cancelled' });

    res.json({ success: true, message: 'Order cancelled' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to cancel order',
      code: 'CANCEL_ORDER_ERROR',
    });
  }
});

export default router;
