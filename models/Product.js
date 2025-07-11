const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['men', 'women', 'kids'],
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  }],
  colors: [{
    type: String,
  }],
  images: [{
    type: String,
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  tags: [{
    type: String,
  }],
  brand: {
    type: String,
    default: 'Generic',
  },
}, {
  timestamps: true,
});

// Add index for better query performance
productSchema.index({ category: 1, featured: -1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);