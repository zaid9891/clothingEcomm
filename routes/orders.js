const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Place new order
router.post('/', auth, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'cash_on_delivery' } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for ${item.product.name}` 
        });
      }
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = cart.items.map(item => {
      totalAmount += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.product.price,
      };
    });

    // Create order
    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    await order.save();

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    // Populate order details for response
    await order.populate('items.product');

    res.status(201).json({
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Server error while placing order' });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// Get single order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
});

// Get all orders (Admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// Update order status (Admin only)
router.put('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    await order.populate('items.product');

    res.json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
});

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow cancellation if order is pending or processing
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    order.status = 'cancelled';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    await order.populate('items.product');

    res.json({
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error while cancelling order' });
  }
});

module.exports = router;