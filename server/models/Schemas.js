const mongoose = require('mongoose');

// Product Schema
const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true }, // cement, steel, bricks, aggregates
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true }, // bag, ton, piece, brass
  change: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
  changeAmount: { type: Number, default: 0 },
  specs: { type: Map, of: String },
  img: { type: String },
  quantity: { type: Number, default: 0 }
}, { timestamps: true });

// Inquiry Schema
const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String },
  items: [{
    product: {
      id: String,
      name: String,
      price: Number,
      unit: String,
      brand: String
    },
    quantity: Number
  }],
  subtotal: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalEstimate: { type: Number },
  status: { type: String, enum: ['pending', 'processed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

// Subscriber Schema
const SubscriberSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Customer' },
  email: { type: String },
  phone: { type: String }
}, { timestamps: true });

// Admin Schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema, 'products');
const Inquiry = mongoose.model('Inquiry', InquirySchema);
const Subscriber = mongoose.model('Subscriber', SubscriberSchema);
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = { Product, Inquiry, Subscriber, Admin };
