import express from 'express';
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
    
    if (!cart) {
      return res.json({ items: [], total: 0 });
    }

    // Calculate total
    let total = 0;
    cart.items.forEach(item => {
      total += item.product.price * item.quantity;
    });

    res.json({
      items: cart.items,
      total: total.toFixed(2),
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error while fetching cart' });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => 
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
      });
    }

    await cart.save();

    // Populate product details for response
    await cart.populate('items.product');

    res.json({
      message: 'Item added to cart successfully',
      cart: {
        items: cart.items,
      },
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error while adding to cart' });
  }
});

// Update cart item quantity
router.put('/update/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Validate product stock
    const product = await Product.findById(item.product);
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    item.quantity = quantity;
    await cart.save();

    await cart.populate('items.product');

    res.json({
      message: 'Cart updated successfully',
      cart: {
        items: cart.items,
      },
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error while updating cart' });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items.id(itemId).remove();
    await cart.save();

    await cart.populate('items.product');

    res.json({
      message: 'Item removed from cart successfully',
      cart: {
        items: cart.items,
      },
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error while removing from cart' });
  }
});

// Clear entire cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({
      message: 'Cart cleared successfully',
      cart: {
        items: [],
      },
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error while clearing cart' });
  }
});

export default router;