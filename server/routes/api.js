const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dbHelper = require('../dbHelper');

const JWT_SECRET = process.env.JWT_SECRET || 'vigneshwara_traders_super_secret_jwt_key_2026';

// Middleware to authenticate Admin JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'Access Token Required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or Expired Token' });
    req.user = user;
    next();
  });
}

// 1. Auth Route
router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const isValid = await dbHelper.authenticateAdmin(username, password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 2. Products Routes
router.get('/products', async (req, res) => {
  try {
    const products = await dbHelper.getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving products' });
  }
});

router.post('/products', authenticateToken, async (req, res) => {
  const { name, category, brand, price, unit, specs, image, quantity } = req.body;
  if (!name || !category || !brand || !price || !unit) {
    return res.status(400).json({ message: 'Missing required product fields' });
  }

  try {
    let imgUrl = '';
    if (image) {
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1].split('/')[1] || 'png';
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `product_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
        const fs = require('fs');
        const path = require('path');
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        fs.writeFileSync(path.join(uploadsDir, filename), buffer);
        imgUrl = `/uploads/${filename}`;
      } else {
        imgUrl = image;
      }
    } else {
      const fallbacks = {
        cement: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop',
        steel: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop',
        bricks: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop',
        aggregates: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=600&auto=format&fit=crop'
      };
      imgUrl = fallbacks[category] || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop';
    }

    const newProduct = await dbHelper.addProduct({
      name,
      category,
      brand,
      price: parseFloat(price),
      unit,
      specs: specs || {},
      img: imgUrl,
      quantity: parseFloat(quantity) || 0
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: 'Error adding product' });
  }
});

router.delete('/products/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await dbHelper.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', deleted });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

router.put('/products/:id', authenticateToken, async (req, res) => {
  const { name, category, brand, price, unit, specs, image, quantity, change, changeAmount } = req.body;
  try {
    const products = await dbHelper.getProducts();
    const existingProduct = products.find(p => p.id === req.params.id);
    
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (brand !== undefined) updateData.brand = brand;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (unit !== undefined) updateData.unit = unit;
    if (specs !== undefined) updateData.specs = specs;
    if (quantity !== undefined) updateData.quantity = parseFloat(quantity);

    // Compute change and changeAmount if price changed and not explicitly provided
    let calculatedChange = change;
    let calculatedChangeAmount = changeAmount;
    if (price !== undefined && parseFloat(price) !== existingProduct.price) {
      const diff = parseFloat(price) - existingProduct.price;
      if (calculatedChange === undefined) {
        calculatedChange = diff > 0 ? 'up' : 'down';
      }
      if (calculatedChangeAmount === undefined) {
        calculatedChangeAmount = Math.abs(diff);
      }
    } else if (price !== undefined && parseFloat(price) === existingProduct.price) {
      if (calculatedChange === undefined) {
        calculatedChange = 'stable';
      }
      if (calculatedChangeAmount === undefined) {
        calculatedChangeAmount = 0;
      }
    }

    if (calculatedChange !== undefined) updateData.change = calculatedChange;
    if (calculatedChangeAmount !== undefined) updateData.changeAmount = parseFloat(calculatedChangeAmount);

    if (image) {
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1].split('/')[1] || 'png';
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `product_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
        const fs = require('fs');
        const path = require('path');
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        fs.writeFileSync(path.join(uploadsDir, filename), buffer);
        updateData.img = `/uploads/${filename}`;
      } else {
        updateData.img = image;
      }
    }

    const updated = await dbHelper.updateProduct(req.params.id, updateData);

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // SIMULATED ALERT TRIGGER:
    // If a product price drops/rises, trigger alert notifications to subscribers in the console.
    const subscribers = await dbHelper.getSubscribers();
    if (subscribers.length > 0 && updated.change !== 'stable') {
      console.log(`\n================== [ALERT BROADCASTER] ==================`);
      console.log(`Price shift detected for "${updated.name}" to ₹${updated.price} (${updated.change} by ₹${updated.changeAmount})!`);
      console.log(`Broadcasting to ${subscribers.length} registered price alert subscribers:`);
      subscribers.forEach(sub => {
        if (sub.email) {
          console.log(`   --> [EMAIL SENT] To: ${sub.email} | Subject: Daily Rate Alert - ${updated.name} has shifted to ₹${updated.price}/${updated.unit}. Order on Vigneshwara Traders now!`);
        }
        if (sub.phone) {
          console.log(`   --> [SMS SENT] To: ${sub.phone} | Content: VT Alert: ${updated.name} price changed to Rs.${updated.price}/${updated.unit}. Check rates at vigneshwara-traders.in`);
        }
      });
      console.log(`=========================================================\n`);
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Error updating product' });
  }
});

router.post('/products/:id/send-alert', authenticateToken, async (req, res) => {
  try {
    const products = await dbHelper.getProducts();
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { price, change, changeAmount } = req.body;
    const finalPrice = price !== undefined ? parseFloat(price) : product.price;
    const finalChange = change !== undefined ? change : product.change;
    const finalChangeAmount = changeAmount !== undefined ? parseFloat(changeAmount) : product.changeAmount;

    const subscribers = await dbHelper.getSubscribers();
    if (subscribers.length > 0) {
      console.log(`\n================== [MANUAL ALERT BROADCAST] ==================`);
      console.log(`Admin triggered manual price alert broadcast for "${product.name}" at ₹${finalPrice}/${product.unit}!`);
      console.log(`Broadcasting to ${subscribers.length} price alert subscribers:`);
      subscribers.forEach(sub => {
        if (sub.email) {
          console.log(`   --> [EMAIL SENT] To: ${sub.email} | Subject: Price Alert: ${product.name} rate is ₹${finalPrice}/${product.unit}. Book now at Vigneshwara Traders!`);
        }
        if (sub.phone) {
          console.log(`   --> [SMS SENT] To: ${sub.phone} | VT Alert: ${product.name} index price is Rs.${finalPrice}/${product.unit}. Click to check live rates.`);
        }
      });
      console.log(`==============================================================\n`);
    }

    res.json({ message: `Price alerts logged successfully for ${subscribers.length} subscribers!`, count: subscribers.length });
  } catch (err) {
    console.error('Error sending alerts:', err);
    res.status(500).json({ message: 'Error triggering subscriber alerts' });
  }
});

router.post('/products/send-broadcast-alert', authenticateToken, async (req, res) => {
  try {
    const subscribers = await dbHelper.getSubscribers();
    if (subscribers.length > 0) {
      console.log(`\n================== [MANUAL BULK BROADCAST] ==================`);
      console.log(`Admin triggered manual consolidated daily price alert broadcast for all products!`);
      console.log(`Broadcasting to ${subscribers.length} price alert subscribers:`);
      subscribers.forEach(sub => {
        if (sub.email) {
          console.log(`   --> [EMAIL SENT] To: ${sub.email} | Subject: Daily Rate Alert - Vigneshwara Traders daily rates have been updated!`);
        }
        if (sub.phone) {
          console.log(`   --> [SMS SENT] To: ${sub.phone} | VT Alert: All building materials daily rates updated.`);
        }
      });
      console.log(`==============================================================\n`);
    }
    res.json({ message: `Consolidated daily rates broadcast logged successfully for ${subscribers.length} subscribers!`, count: subscribers.length });
  } catch (err) {
    console.error('Error logging broadcast alerts:', err);
    res.status(500).json({ message: 'Error triggering broadcast alerts' });
  }
});

// 3. Inquiries Routes
router.get('/inquiries', authenticateToken, async (req, res) => {
  try {
    const inquiries = await dbHelper.getInquiries();
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving inquiries' });
  }
});

router.post('/inquiries', async (req, res) => {
  const { name, phone, message, items, subtotal, deliveryCharge, discount, totalEstimate } = req.body;
  if (!name || !phone || !items || items.length === 0) {
    return res.status(400).json({ message: 'Incomplete inquiry details. Name, phone, and items are required.' });
  }

  try {
    const newInquiry = await dbHelper.addInquiry({
      name,
      phone,
      message,
      items,
      subtotal: parseFloat(subtotal),
      deliveryCharge: parseFloat(deliveryCharge || 0),
      discount: parseFloat(discount || 0),
      totalEstimate: parseFloat(totalEstimate || (parseFloat(subtotal) - parseFloat(discount || 0) + parseFloat(deliveryCharge || 0)))
    });
    res.status(201).json(newInquiry);
  } catch (err) {
    res.status(500).json({ message: 'Error submitting inquiry' });
  }
});

router.put('/inquiries/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'processed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const updated = await dbHelper.updateInquiryStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating inquiry status' });
  }
});

// 4. Subscribers Routes
router.get('/subscribers', authenticateToken, async (req, res) => {
  try {
    const subscribers = await dbHelper.getSubscribers();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving subscribers' });
  }
});

router.post('/subscribers', async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }
  if (!email && !phone) {
    return res.status(400).json({ message: 'Email or phone number is required' });
  }

  try {
    const result = await dbHelper.addSubscriber({ name, email, phone });
    if (result.message === 'Already subscribed') {
      return res.status(409).json({ message: 'You have already subscribed with this email/phone!' });
    }
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error adding subscription' });
  }
});

// 5. Shop Hours / Live Status Info
router.get('/store-status', async (req, res) => {
  try {
    const hours = await dbHelper.getStoreHours();
    res.json(hours);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving store schedule' });
  }
});

// 6. Government Price Index Integration Endpoints
const fs = require('fs');
const path = require('path');
const govtFile = path.join(__dirname, '../govt_prices.json');

// Initialize govt_prices.json if not present
if (!fs.existsSync(govtFile)) {
  const defaultGovt = [
    { id: 'cement-ultratech', price: 430 },
    { id: 'cement-acc', price: 415 },
    { id: 'steel-tata-12', price: 68000 },
    { id: 'steel-jsw-10', price: 66500 },
    { id: 'bricks-red', price: 8.5 },
    { id: 'sand-river', price: 5200 },
    { id: 'aggregate-20mm', price: 4800 }
  ];
  try {
    fs.writeFileSync(govtFile, JSON.stringify(defaultGovt, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to initialize govt_prices.json:', e.message);
  }
}

router.get('/govt-price-index', (req, res) => {
  try {
    if (!fs.existsSync(govtFile)) {
      const defaultGovt = [
        { id: 'cement-ultratech', price: 430 },
        { id: 'cement-acc', price: 415 },
        { id: 'steel-tata-12', price: 68000 },
        { id: 'steel-jsw-10', price: 66500 },
        { id: 'bricks-red', price: 8.5 },
        { id: 'sand-river', price: 5200 },
        { id: 'aggregate-20mm', price: 4800 }
      ];
      fs.writeFileSync(govtFile, JSON.stringify(defaultGovt, null, 2), 'utf-8');
    }
    const raw = fs.readFileSync(govtFile, 'utf-8');
    res.json(JSON.parse(raw));
  } catch (err) {
    res.status(500).json({ message: 'Error reading government price index' });
  }
});

router.post('/govt-price-index', (req, res) => {
  const { prices } = req.body;
  if (!prices || !Array.isArray(prices)) {
    return res.status(400).json({ message: 'Invalid government prices payload' });
  }
  try {
    fs.writeFileSync(govtFile, JSON.stringify(prices, null, 2), 'utf-8');
    res.json({ message: 'Government price index updated successfully', prices });
  } catch (err) {
    res.status(500).json({ message: 'Error writing government price index' });
  }
});

module.exports = router;
