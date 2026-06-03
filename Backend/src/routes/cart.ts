import { Router, Response } from 'express';
import { Cart } from '../models/Cart.js';
import { verifyToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get cart
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    let cart = await Cart.findOne({ userId: req.user?.id });
    if (!cart) {
      cart = new Cart({ userId: req.user?.id, items: [], total: 0 });
      await cart.save();
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart',
      code: 'FETCH_CART_ERROR',
    });
  }
});

// Add item to cart
router.post('/items', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity, price } = req.body;

    let cart = await Cart.findOne({ userId: req.user?.id });
    if (!cart) {
      cart = new Cart({ userId: req.user?.id, items: [], total: 0 });
    }

    const existingItem = cart.items.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price });
    }

    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await cart.save();

    res.status(201).json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to add item',
      code: 'ADD_ITEM_ERROR',
    });
  }
});

// Update cart item
router.put('/items/:itemId', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user?.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found',
        code: 'CART_NOT_FOUND',
      });
    }

    const item = cart.items.find((i) => i.productId === req.params.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        code: 'ITEM_NOT_FOUND',
      });
    }

    item.quantity = quantity;
    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await cart.save();

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to update item',
      code: 'UPDATE_ITEM_ERROR',
    });
  }
});

// Remove item from cart
router.delete('/items/:itemId', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ userId: req.user?.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found',
        code: 'CART_NOT_FOUND',
      });
    }

    cart.items = cart.items.filter((item) => item.productId !== req.params.itemId);
    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await cart.save();

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to remove item',
      code: 'REMOVE_ITEM_ERROR',
    });
  }
});

// Clear cart
router.delete('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    await Cart.deleteOne({ userId: req.user?.id });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to clear cart',
      code: 'CLEAR_CART_ERROR',
    });
  }
});

export default router;
