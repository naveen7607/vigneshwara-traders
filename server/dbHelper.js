const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Product, Inquiry, Subscriber, Admin } = require('./models/Schemas');

const FALLBACK_FILE = path.join(__dirname, 'db_fallback.json');

// Default products to populate when database is empty
const DEFAULT_PRODUCTS = [
  {
    id: 'cement-ultratech',
    name: 'UltraTech Cement',
    category: 'cement',
    brand: 'UltraTech',
    price: 430,
    unit: 'bag',
    change: 'up',
    changeAmount: 10,
    specs: { 'Type': 'OPC 53 Grade', 'Strength': 'High', 'Setting Time': 'Quick' },
    img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop',
    quantity: 250
  },
  {
    id: 'cement-acc',
    name: 'ACC Gold Cement',
    category: 'cement',
    brand: 'ACC',
    price: 415,
    unit: 'bag',
    change: 'down',
    changeAmount: 5,
    specs: { 'Type': 'PPC Grade', 'Strength': 'Premium', 'Setting Time': 'Standard' },
    img: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=600&auto=format&fit=crop',
    quantity: 180
  },
  {
    id: 'steel-tata-12',
    name: 'TATA Tiscon 12mm TMT Rods',
    category: 'steel',
    brand: 'TATA Tiscon',
    price: 68000,
    unit: 'ton',
    change: 'stable',
    changeAmount: 0,
    specs: { 'Grade': 'Fe 550D', 'Diameter': '12 mm', 'Length': '12 meters' },
    img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop',
    quantity: 15
  },
  {
    id: 'steel-jsw-10',
    name: 'JSW NeoSteel 10mm Rods',
    category: 'steel',
    brand: 'JSW Steel',
    price: 66500,
    unit: 'ton',
    change: 'up',
    changeAmount: 750,
    specs: { 'Grade': 'Fe 550D', 'Diameter': '10 mm', 'Length': '12 meters' },
    img: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?q=80&w=600&auto=format&fit=crop',
    quantity: 12
  },
  {
    id: 'bricks-red',
    name: 'Premium Red Clay Bricks',
    category: 'bricks',
    brand: 'Local Premium',
    price: 8.5,
    unit: 'piece',
    change: 'stable',
    changeAmount: 0,
    specs: { 'Size': '9" x 4" x 3"', 'Weight': '3.2 kg', 'Compressive Strength': 'High' },
    img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop',
    quantity: 5000
  },
  {
    id: 'sand-river',
    name: 'Fine River Sand',
    category: 'aggregates',
    brand: 'Natural',
    price: 5200,
    unit: 'brass',
    change: 'down',
    changeAmount: 150,
    specs: { 'Source': 'River Basin', 'Granulometry': 'Medium-Fine', 'Silt Content': '< 3%' },
    img: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=600&auto=format&fit=crop',
    quantity: 8
  },
  {
    id: 'aggregate-20mm',
    name: 'Blue Metal Aggregates 20mm',
    category: 'aggregates',
    brand: 'Quarry Fine',
    price: 4800,
    unit: 'brass',
    change: 'up',
    changeAmount: 100,
    specs: { 'Size': '20 mm Crushed', 'Material': 'Granite/Basalt', 'Usage': 'Concreting' },
    img: 'https://images.unsplash.com/photo-1574621125745-a2453c7b6e12?q=80&w=600&auto=format&fit=crop',
    quantity: 10
  }
];

// Helper to determine if we should fallback to JSON file
function isFallback() {
  return process.env.USE_FALLBACK === 'true';
}

// Read JSON fallback database
function readFallback() {
  try {
    if (!fs.existsSync(FALLBACK_FILE)) {
      const defaultData = {
        products: DEFAULT_PRODUCTS,
        inquiries: [],
        subscribers: [],
        admins: [{
          username: process.env.ADMIN_USERNAME || 'admin',
          passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'vigneshwara123', 10)
        }],
        storeHours: {
          openHour: 9,
          openMinute: 0,
          closeHour: 18,
          closeMinute: 30,
          workDays: [1, 2, 3, 4, 5, 6] // Mon - Sat
        }
      };
      fs.writeFileSync(FALLBACK_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const raw = fs.readFileSync(FALLBACK_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading fallback file DB:', err);
    return { products: DEFAULT_PRODUCTS, inquiries: [], subscribers: [], admins: [] };
  }
}

// Write JSON fallback database
function writeFallback(data) {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing fallback file DB:', err);
  }
}

// Database Operations
module.exports = {
  // Initialize Database default records
  async initializeDefaults() {
    if (isFallback()) {
      readFallback(); // Creates fallback file if not existing
      console.log('Fallback File Database Initialized at:', FALLBACK_FILE);
      return;
    }

    try {
      // Seed default products
      const count = await Product.countDocuments();
      if (count === 0) {
        await Product.insertMany(DEFAULT_PRODUCTS);
        console.log('Default products seeded in MongoDB.');
      }

      // Seed admin user
      const username = process.env.ADMIN_USERNAME || 'admin';
      const rawPassword = process.env.ADMIN_PASSWORD || 'vigneshwara123';
      const passwordHash = await bcrypt.hash(rawPassword, 10);

      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        await Admin.create({ username, password: passwordHash });
        console.log(`Default admin user seeded in MongoDB (Username: ${username}).`);
      } else {
        // Synchronize admin password with current configuration
        await Admin.findOneAndUpdate({ username }, { password: passwordHash });
        console.log(`Default admin user password synchronized in MongoDB.`);
      }
    } catch (err) {
      console.error('Error seeding defaults in MongoDB:', err);
    }
  },

  // 1. Products operations
  async getProducts() {
    if (isFallback()) {
      return readFallback().products;
    }
    return await Product.find({});
  },

  async addProduct(productData) {
    if (isFallback()) {
      const db = readFallback();
      let baseId = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!baseId) baseId = 'product';
      let id = baseId;
      let counter = 1;
      while (db.products.some(p => p.id === id)) {
        id = `${baseId}-${counter}`;
        counter++;
      }
      const newProduct = {
        id,
        change: 'stable',
        changeAmount: 0,
        ...productData
      };
      db.products.push(newProduct);
      writeFallback(db);
      return newProduct;
    }

    // Mongo mode
    let baseId = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!baseId) baseId = 'product';
    let id = baseId;
    let counter = 1;
    while (await Product.findOne({ id })) {
      id = `${baseId}-${counter}`;
      counter++;
    }
    return await Product.create({
      id,
      change: 'stable',
      changeAmount: 0,
      ...productData
    });
  },

  async updateProduct(id, updateData) {
    if (isFallback()) {
      const db = readFallback();
      const idx = db.products.findIndex(p => p.id === id);
      if (idx !== -1) {
        db.products[idx] = { ...db.products[idx], ...updateData };
        writeFallback(db);
        return db.products[idx];
      }
      return null;
    }
    return await Product.findOneAndUpdate({ id }, updateData, { new: true });
  },

  async deleteProduct(id) {
    if (isFallback()) {
      const db = readFallback();
      const idx = db.products.findIndex(p => p.id === id);
      if (idx !== -1) {
        const removed = db.products.splice(idx, 1)[0];
        writeFallback(db);
        return removed;
      }
      return null;
    }
    return await Product.findOneAndDelete({ id });
  },

  // 2. Inquiries operations
  async getInquiries() {
    if (isFallback()) {
      // Return sorted by date descending
      const db = readFallback();
      return [...db.inquiries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return await Inquiry.find({}).sort({ createdAt: -1 });
  },

  async addInquiry(inquiryData) {
    if (isFallback()) {
      const db = readFallback();
      const newInquiry = {
        _id: 'inq_' + Math.random().toString(36).substring(2, 9),
        ...inquiryData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      db.inquiries.push(newInquiry);
      writeFallback(db);
      return newInquiry;
    }
    return await Inquiry.create(inquiryData);
  },

  async updateInquiryStatus(id, status) {
    if (isFallback()) {
      const db = readFallback();
      const idx = db.inquiries.findIndex(i => i._id === id);
      if (idx !== -1) {
        db.inquiries[idx].status = status;
        writeFallback(db);
        return db.inquiries[idx];
      }
      return null;
    }
    return await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
  },

  // 3. Price Alert Subscribers operations
  async getSubscribers() {
    if (isFallback()) {
      return readFallback().subscribers;
    }
    return await Subscriber.find({});
  },

  async addSubscriber(subData) {
    if (isFallback()) {
      const db = readFallback();
      
      // Prevent duplicates
      const exists = db.subscribers.some(s => 
        (subData.email && s.email === subData.email) || 
        (subData.phone && s.phone === subData.phone)
      );

      if (exists) {
        return { message: 'Already subscribed' };
      }

      const newSub = {
        _id: 'sub_' + Math.random().toString(36).substring(2, 9),
        ...subData,
        createdAt: new Date().toISOString()
      };
      db.subscribers.push(newSub);
      writeFallback(db);
      return newSub;
    }
    
    // In Mongo
    const exists = await Subscriber.findOne({
      $or: [
        ...(subData.email ? [{ email: subData.email }] : []),
        ...(subData.phone ? [{ phone: subData.phone }] : [])
      ]
    });

    if (exists) {
      return { message: 'Already subscribed' };
    }

    return await Subscriber.create(subData);
  },

  // 4. Authenticate admin user
  async authenticateAdmin(username, password) {
    if (isFallback()) {
      const db = readFallback();
      const admin = db.admins.find(a => a.username === username);
      if (!admin) return false;
      return bcrypt.compareSync(password, admin.passwordHash);
    }
    const admin = await Admin.findOne({ username });
    if (!admin) return false;
    return await bcrypt.compare(password, admin.password);
  },

  // 5. Store operational hours configuration
  async getStoreHours() {
    if (isFallback()) {
      return readFallback().storeHours;
    }
    // Return standard configurations from environment or defaults
    return {
      openHour: 9,
      openMinute: 0,
      closeHour: 18,
      closeMinute: 30,
      workDays: [1, 2, 3, 4, 5, 6]
    };
  }
};
