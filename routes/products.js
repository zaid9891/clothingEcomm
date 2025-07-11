const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, page = 1, limit = 12 } = req.query;
    const query = {};

    // Build query based on filters
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get products with pagination
    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});

// Create new product (Admin only)
router.post('/', auth, adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      sizes,
      colors,
      stock,
      featured,
      tags,
      brand,
    } = req.body;

    // Process uploaded images
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // Parse arrays from form data
    const parsedSizes = sizes ? JSON.parse(sizes) : [];
    const parsedColors = colors ? JSON.parse(colors) : [];
    const parsedTags = tags ? JSON.parse(tags) : [];

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      sizes: parsedSizes,
      colors: parsedColors,
      images,
      stock: parseInt(stock),
      featured: featured === 'true',
      tags: parsedTags,
      brand,
    });

    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
});

// Update product (Admin only)
router.put('/:id', auth, adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      sizes,
      colors,
      stock,
      featured,
      tags,
      brand,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Process uploaded images
    const newImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // Parse arrays from form data
    const parsedSizes = sizes ? JSON.parse(sizes) : product.sizes;
    const parsedColors = colors ? JSON.parse(colors) : product.colors;
    const parsedTags = tags ? JSON.parse(tags) : product.tags;

    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? parseFloat(price) : product.price;
    product.category = category || product.category;
    product.sizes = parsedSizes;
    product.colors = parsedColors;
    product.stock = stock ? parseInt(stock) : product.stock;
    product.featured = featured !== undefined ? featured === 'true' : product.featured;
    product.tags = parsedTags;
    product.brand = brand || product.brand;

    // Update images if new ones were uploaded
    if (newImages.length > 0) {
      product.images = [...product.images, ...newImages];
    }

    await product.save();

    res.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
});

// Delete product (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const featuredProducts = await Product.find({ featured: true })
      .limit(8)
      .sort({ createdAt: -1 });

    res.json(featuredProducts);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Server error while fetching featured products' });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const skip = (page - 1) * limit;

    const products = await Product.find({ category })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ category });

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ message: 'Server error while fetching products by category' });
  }
});

module.exports = router;