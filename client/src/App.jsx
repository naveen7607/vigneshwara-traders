import React, { useState, useEffect } from 'react';
import {
  Sparkles, Calculator, ShoppingCart, MapPin, Phone, Mail,
  TrendingUp, TrendingDown, Minus, Trash2, Clock, Globe,
  Lock, Plus, X, ChevronRight, ShieldCheck, FileText,
  CheckCircle2, Truck, Calendar, DollarSign, LineChart, LogOut, Users, Info,
  Edit, Edit2, Bell
} from 'lucide-react';
import { translations, productTranslations, commonTranslations } from './translations';

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

// Product approximate unit weights for shipping metrics (in kg)
const PRODUCT_WEIGHTS = {
  'cement-ultratech': 50,      // 50kg bag
  'cement-acc': 50,            // 50kg bag
  'steel-tata-12': 1000,       // 1 ton (1000kg)
  'steel-jsw-10': 1000,        // 1 ton (1000kg)
  'bricks-red': 3.2,           // 3.2kg brick
  'sand-river': 4200,          // 1 brass (approx 4.2 tons or 4200kg)
  'aggregate-20mm': 4500       // 1 brass (approx 4.5 tons or 4500kg)
};

export default function App() {
  // Navigation & Core state
  const [currentPage, setCurrentPage] = useState('landing');
  const [lang, setLang] = useState(localStorage.getItem('vt_lang') || 'en');
  const userPlaceholder = {
    en: "Username (default: admin)",
    te: "యూజర్ నేమ్ (డిఫాల్ట్: admin)",
    hi: "उपयोगकर्ता नाम (डिफ़ॉल्ट: admin)"
  };
  const passPlaceholder = {
    en: "Password",
    te: "పాస్వర్డ్",
    hi: "पासवर्ड"
  };
  const companyNames = {
    en: "VIGNESHWARA Traders",
    te: "విగ్నేశ్వరా ట్రేడర్స్",
    hi: "विग्नेश्वरा ट्रेडर्स"
  };
  const invoiceTitles = {
    en: "Rate Quotation",
    te: "ధరల కొటేషన్",
    hi: "दर कोटेशन"
  };
  const dateLabels = {
    en: "Date",
    te: "తేదీ",
    hi: "दिनांक"
  };
  const brandLabelsInvoice = {
    en: "Brand",
    te: "బ్రాండ్",
    hi: "ब्रांड"
  };
  const calcDetailsLabels = {
    en: "Calculation",
    te: "గణన (వివరాలు)",
    hi: "गणना (विवरण)"
  };
  const subtotalLabels = {
    en: "Subtotal",
    te: "ఉపమొత్తం",
    hi: "उप-योग"
  };
  const deliveryLabelsInvoice = {
    en: "Delivery Charge",
    te: "రవాణా ఛార్జీ",
    hi: "वितरण शुल्क"
  };
  const grandTotalLabels = {
    en: "Grand Total",
    te: "మొత్తం అంచనా",
    hi: "कुल अनुमान"
  };
  const noteLabels = {
    en: "Note: Prices are estimates based on today's market rates and exclude loading labor. Rates fluctuate daily.",
    te: "గమనిక: ధరలు ఈరోజు మార్కెట్ రేట్లపై ఆధారపడి అంచనా వేయబడినవి, లోడింగ్ కూలీ ఖర్చులు చేర్చబడలేదు. రోజువారీ ధరలు మారవచ్చు.",
    hi: "नोट: कीमतें आज की बाजार दरों पर आधारित अनुमान हैं, लोडिंग मजदूरी शामिल नहीं है। दैनिक दरें बदल सकती हैं।"
  };
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem('vt_cart')) || []);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [govtPrices, setGovtPrices] = useState([]);
  const [shopOpen, setShopOpen] = useState(true);
  const [nextShopSchedule, setNextShopSchedule] = useState('');
  const [toasts, setToasts] = useState([]);

  // Price Alert Subscription Form
  const [subName, setSubName] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subPhone, setSubPhone] = useState('');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastData, setBroadcastData] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);

  // Direct Inquiry Form
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  // Material Calculator Form
  const [calcArea, setCalcArea] = useState(1200);
  const [calcFloors, setCalcFloors] = useState(1);
  const [calcQuality, setCalcQuality] = useState('premium');
  const [estimates, setEstimates] = useState({ cement: 0, steel: 0, sand: 0, aggregate: 0, bricks: 0 });

  // Shipping / Distance Calculator
  const [shippingDistance, setShippingDistance] = useState(5);
  const [shippingCost, setShippingCost] = useState(0);

  // Admin states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem('vt_admin_token'));
  const [adminToken, setAdminToken] = useState(localStorage.getItem('vt_admin_token') || '');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminActiveTab, setAdminActiveTab] = useState('prices');
  const [adminInquiries, setAdminInquiries] = useState([]);
  const [adminSubscribers, setAdminSubscribers] = useState([]);

  // Admin add product states
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('cement');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('bag');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdImagePreview, setNewProdImagePreview] = useState('');
  const [newProdSpecs, setNewProdSpecs] = useState([
    { key: 'Type', value: '' },
    { key: 'Strength', value: '' },
    { key: 'Setting Time', value: '' }
  ]);
  const [newProdQty, setNewProdQty] = useState('250');

  // Admin edit product states
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdBrand, setEditProdBrand] = useState('');
  const [editProdCategory, setEditProdCategory] = useState('cement');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdUnit, setEditProdUnit] = useState('bag');
  const [editProdImage, setEditProdImage] = useState('');
  const [editProdImagePreview, setEditProdImagePreview] = useState('');
  const [editProdSpecs, setEditProdSpecs] = useState([]);
  const [editProdQty, setEditProdQty] = useState('0');

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditProdName(product.name || '');
    setEditProdBrand(product.brand || '');
    setEditProdCategory(product.category || 'cement');
    setEditProdPrice(product.price !== undefined ? product.price.toString() : '');
    setEditProdUnit(product.unit || 'bag');
    setEditProdQty(product.quantity !== undefined ? product.quantity.toString() : '0');
    setEditProdImage('');
    setEditProdImagePreview(product.img || '');

    const specsArray = [];
    if (product.specs) {
      Object.entries(product.specs).forEach(([key, value]) => {
        specsArray.push({ key, value });
      });
    }
    if (specsArray.length === 0) {
      if (product.category === 'cement') {
        specsArray.push({ key: 'Type', value: '' }, { key: 'Strength', value: '' }, { key: 'Setting Time', value: '' });
      } else if (product.category === 'steel') {
        specsArray.push({ key: 'Grade', value: '' }, { key: 'Diameter', value: '' }, { key: 'Length', value: '' });
      } else if (product.category === 'bricks') {
        specsArray.push({ key: 'Size', value: '' }, { key: 'Weight', value: '' }, { key: 'Compressive Strength', value: '' });
      } else if (product.category === 'aggregates') {
        specsArray.push({ key: 'Source', value: '' }, { key: 'Granulometry', value: '' }, { key: 'Silt Content', value: '' });
      }
    }
    setEditProdSpecs(specsArray);
    setIsEditProductModalOpen(true);
  };

  const handleEditCategoryChange = (category) => {
    setEditProdCategory(category);
    let defaultUnit = 'bag';
    let defaultSpecs = [];
    if (category === 'cement') {
      defaultUnit = 'bag';
      defaultSpecs = [
        { key: 'Type', value: '' },
        { key: 'Strength', value: '' },
        { key: 'Setting Time', value: '' }
      ];
    } else if (category === 'steel') {
      defaultUnit = 'ton';
      defaultSpecs = [
        { key: 'Grade', value: '' },
        { key: 'Diameter', value: '' },
        { key: 'Length', value: '' }
      ];
    } else if (category === 'bricks') {
      defaultUnit = 'piece';
      defaultSpecs = [
        { key: 'Size', value: '' },
        { key: 'Weight', value: '' },
        { key: 'Compressive Strength', value: '' }
      ];
    } else if (category === 'aggregates') {
      defaultUnit = 'brass';
      defaultSpecs = [
        { key: 'Source', value: '' },
        { key: 'Granulometry', value: '' },
        { key: 'Silt Content', value: '' }
      ];
    }
    setEditProdUnit(defaultUnit);
    setEditProdSpecs(defaultSpecs);
  };

  const handleEditSpecKeyChange = (index, key) => {
    setEditProdSpecs(prev => prev.map((s, i) => i === index ? { ...s, key } : s));
  };

  const handleEditSpecValueChange = (index, value) => {
    setEditProdSpecs(prev => prev.map((s, i) => i === index ? { ...s, value } : s));
  };

  const handleEditAddSpec = () => {
    setEditProdSpecs(prev => [...prev, { key: '', value: '' }]);
  };

  const handleEditRemoveSpec = (index) => {
    setEditProdSpecs(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProdImage(reader.result);
        setEditProdImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (category) => {
    setNewProdCategory(category);

    // Auto-update units, initial quantity, and specs keys
    let defaultUnit = 'bag';
    let defaultQty = '250';
    let defaultSpecs = [];
    if (category === 'cement') {
      defaultUnit = 'bag';
      defaultQty = '250';
      defaultSpecs = [
        { key: 'Type', value: '' },
        { key: 'Strength', value: '' },
        { key: 'Setting Time', value: '' }
      ];
    } else if (category === 'steel') {
      defaultUnit = 'ton';
      defaultQty = '15';
      defaultSpecs = [
        { key: 'Grade', value: '' },
        { key: 'Diameter', value: '' },
        { key: 'Length', value: '' }
      ];
    } else if (category === 'bricks') {
      defaultUnit = 'piece';
      defaultQty = '5000';
      defaultSpecs = [
        { key: 'Size', value: '' },
        { key: 'Weight', value: '' },
        { key: 'Compressive Strength', value: '' }
      ];
    } else if (category === 'aggregates') {
      defaultUnit = 'brass';
      defaultQty = '10';
      defaultSpecs = [
        { key: 'Source', value: '' },
        { key: 'Granulometry', value: '' },
        { key: 'Silt Content', value: '' }
      ];
    }
    setNewProdUnit(defaultUnit);
    setNewProdQty(defaultQty);
    setNewProdSpecs(defaultSpecs);
  };

  const handleSpecKeyChange = (index, key) => {
    setNewProdSpecs(prev => prev.map((s, i) => i === index ? { ...s, key } : s));
  };

  const handleSpecValueChange = (index, value) => {
    setNewProdSpecs(prev => prev.map((s, i) => i === index ? { ...s, value } : s));
  };

  const handleAddSpec = () => {
    setNewProdSpecs(prev => [...prev, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index) => {
    setNewProdSpecs(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProdImage(reader.result); // Base64 string
        setNewProdImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProdName || !newProdBrand || !newProdPrice || !newProdUnit) {
      showToast('All basic fields are required', 'danger');
      return;
    }

    const specsMap = {};
    newProdSpecs.forEach(spec => {
      if (spec.key.trim()) {
        specsMap[spec.key.trim()] = spec.value.trim();
      }
    });

    const payload = {
      name: newProdName,
      brand: newProdBrand,
      category: newProdCategory,
      price: parseFloat(newProdPrice),
      unit: newProdUnit,
      specs: specsMap,
      image: newProdImage || null,
      quantity: parseFloat(newProdQty) || 0
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401 || res.status === 403) {
        handleAdminLogout();
        showToast('Admin session expired. Please log in again.', 'warning');
        return;
      }

      if (res.ok) {
        showToast('Product successfully added!');
        setIsAddProductModalOpen(false);
        setNewProdName('');
        setNewProdBrand('');
        setNewProdPrice('');
        setNewProdCategory('cement');
        setNewProdUnit('bag');
        setNewProdQty('250');
        setNewProdImage('');
        setNewProdImagePreview('');
        setNewProdSpecs([
          { key: 'Type', value: '' },
          { key: 'Strength', value: '' },
          { key: 'Setting Time', value: '' }
        ]);

        fetchProducts();
      } else {
        const errorData = await res.json();
        showToast(errorData.message || 'Failed to add product', 'danger');
      }
    } catch (err) {
      const mockId = newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newMockProduct = {
        id: mockId,
        name: newProdName,
        brand: newProdBrand,
        category: newProdCategory,
        price: parseFloat(newProdPrice),
        unit: newProdUnit,
        specs: specsMap,
        img: newProdImagePreview || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop',
        change: 'stable',
        changeAmount: 0,
        quantity: parseFloat(newProdQty) || 0
      };
      setProducts(prev => [...prev, newMockProduct]);
      showToast('Offline Mode: Added product to local runtime memory.');
      setIsAddProductModalOpen(false);
      setNewProdName('');
      setNewProdBrand('');
      setNewProdPrice('');
      setNewProdCategory('cement');
      setNewProdUnit('bag');
      setNewProdQty('250');
      setNewProdImage('');
      setNewProdImagePreview('');
      setNewProdSpecs([
        { key: 'Type', value: '' },
        { key: 'Strength', value: '' },
        { key: 'Setting Time', value: '' }
      ]);
    }
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editProdName || !editProdBrand || !editProdPrice || !editProdUnit) {
      showToast('All basic fields are required', 'danger');
      return;
    }

    const specsMap = {};
    editProdSpecs.forEach(spec => {
      if (spec.key.trim()) {
        specsMap[spec.key.trim()] = spec.value.trim();
      }
    });

    const payload = {
      name: editProdName,
      brand: editProdBrand,
      category: editProdCategory,
      price: parseFloat(editProdPrice),
      unit: editProdUnit,
      specs: specsMap,
      image: editProdImage || null,
      quantity: parseFloat(editProdQty) || 0
    };

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401 || res.status === 403) {
        handleAdminLogout();
        showToast('Admin session expired. Please log in again.', 'warning');
        return;
      }

      if (res.ok) {
        showToast('Product successfully updated!');
        setIsEditProductModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        const errorData = await res.json();
        showToast(errorData.message || 'Failed to update product', 'danger');
      }
    } catch (err) {
      setProducts(prev => prev.map(p =>
        p.id === editingProduct.id
          ? {
            ...p,
            name: editProdName,
            brand: editProdBrand,
            category: editProdCategory,
            price: parseFloat(editProdPrice),
            unit: editProdUnit,
            specs: specsMap,
            img: editProdImagePreview || p.img,
            quantity: parseFloat(editProdQty) || 0
          }
          : p
      ));
      showToast('Offline Mode: Updated product in local runtime memory.');
      setIsEditProductModalOpen(false);
      setEditingProduct(null);
    }
  };

  // Toast Notification Generator
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data || []);
      }
    } catch (err) {
      console.warn('Backend server disconnected.', err);
    } finally {
      setTimeout(() => {
        setProductsLoading(false);
      }, 800);
    }
  };

  const fetchGovtPrices = async () => {
    try {
      const res = await fetch('/api/govt-price-index');
      if (res.ok) {
        const data = await res.json();
        setGovtPrices(data || []);
      }
    } catch (err) {
      console.warn('Backend server disconnected for government rates.', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchGovtPrices();
    checkStoreStatus();
    const interval = setInterval(checkStoreStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Compute operating status
  const checkStoreStatus = () => {
    const now = new Date();
    const day = now.getDay(); // Sunday=0, Monday=1...
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const openHour = 9;
    const closeHour = 18;
    const closeMinute = 30;

    const isWorkDay = [1, 2, 3, 4, 5, 6].includes(day); // Mon-Sat
    let isOpen = false;

    if (isWorkDay) {
      const currentMinutes = hours * 60 + minutes;
      const startMinutes = openHour * 60;
      const endMinutes = closeHour * 60 + closeMinute;
      if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
        isOpen = true;
      }
    }

    setShopOpen(isOpen);

    // Formulate schedule highlights
    let msg = '';
    if (lang === 'te') {
      if (day === 0) msg = 'సోమవారం ఉదయం 9:00 గంటలకు తెరువబడును';
      else if (hours < openHour && isWorkDay) msg = 'ఈరోజు ఉదయం 9:00 గంటలకు తెరువబడును';
      else if (day === 6) msg = 'సోమవారం ఉదయం 9:00 గంటలకు తెరువబడును';
      else msg = 'రేపు ఉదయం 9:00 గంటలకు తెరువబడును';
    } else if (lang === 'hi') {
      if (day === 0) msg = 'सोमवार सुबह 9:00 बजे खुलेगा';
      else if (hours < openHour && isWorkDay) msg = 'आज सुबह 9:00 बजे खुलेगा';
      else if (day === 6) msg = 'सोमवार सुबह 9:00 बजे खुलेगा';
      else msg = 'कल सुबह 9:00 बजे खुलेगा';
    } else {
      if (day === 0) msg = 'Opens Monday 9:00 AM';
      else if (hours < openHour && isWorkDay) msg = 'Opens Today 9:00 AM';
      else if (day === 6) msg = 'Opens Monday 9:00 AM';
      else msg = 'Opens Tomorrow 9:00 AM';
    }
    setNextShopSchedule(msg);
  };

  // Re-run status checker when language switches
  useEffect(() => {
    checkStoreStatus();
  }, [lang]);

  // Language Swapping
  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('vt_lang', newLang);
  };

  // 2. Shopping Cart Operations
  const addToCart = (productId, qty = 1) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      let newCart;
      if (existing) {
        newCart = prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        newCart = [...prev, { product: prod, quantity: qty }];
      }
      sessionStorage.setItem('vt_cart', JSON.stringify(newCart));
      return newCart;
    });

    const localizedName = getLocalizedProductName(prod);
    const msg = {
      en: `Added ${localizedName} to your quote cart.`,
      te: `${localizedName} కోట్ కార్ట్‌లో జోడించబడింది.`,
      hi: `${localizedName} कार्ट में जोड़ा गया।`
    };
    showToast(msg[lang] || msg['en']);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.product.id !== productId);
      sessionStorage.setItem('vt_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateCartQty = (productId, delta) => {
    setCart(prev => {
      const newCart = prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
      sessionStorage.setItem('vt_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  // Calculate totals and physical weight
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const cartTotalWeightKg = cart.reduce((sum, item) => {
    let unitWeight = PRODUCT_WEIGHTS[item.product.id];
    if (unitWeight === undefined) {
      const u = item.product.unit.toLowerCase();
      if (u.includes('bag')) unitWeight = 50;
      else if (u.includes('ton')) unitWeight = 1000;
      else if (u.includes('brass')) unitWeight = 4200;
      else if (u.includes('piece')) unitWeight = 3.2;
      else unitWeight = 1;
    }
    return sum + (unitWeight * item.quantity);
  }, 0);

  // Delivery Cost Calculation Logic
  // Heavy materials (sand/aggregates/steel) require truck delivery.
  // standard charge = Rs 200 base + Rs 50/km. If weight > 2000kg (2 Tons), charge is doubled.
  // Free delivery rules: orders over Rs 50,000 and within 5km.
  useEffect(() => {
    if (cart.length === 0) {
      setShippingCost(0);
      return;
    }

    if (cartSubtotal > 50000 && shippingDistance <= 5) {
      setShippingCost(0);
      return;
    }

    let baseRate = 250;
    let ratePerKm = 60;
    if (cartTotalWeightKg > 2000) {
      baseRate = 600;
      ratePerKm = 120; // larger/heavier truck
    }

    const cost = baseRate + (ratePerKm * shippingDistance);
    setShippingCost(Math.round(cost));
  }, [cart, cartSubtotal, shippingDistance, cartTotalWeightKg]);

  const getCartDiscount = () => {
    let totalDiscount = 0;
    cart.forEach(item => {
      const cat = item.product.category;
      const qty = item.quantity;
      const itemTotal = item.product.price * qty;
      if (cat === 'cement' && qty >= 100) {
        totalDiscount += itemTotal * 0.03;
      } else if (cat === 'steel' && qty >= 5) {
        totalDiscount += itemTotal * 0.05;
      } else if (cat === 'bricks' && qty >= 10000) {
        totalDiscount += itemTotal * 0.04;
      } else if (cat === 'aggregates' && qty >= 10) {
        totalDiscount += itemTotal * 0.03;
      }
    });
    return Math.round(totalDiscount);
  };

  const cartDiscount = getCartDiscount();
  const cartTotal = cartSubtotal - cartDiscount + shippingCost;

  // Translation helpers
  const t = (key) => translations[lang][key] || key;

  const getLocalizedProductName = (prod) => {
    return productTranslations[lang]?.[prod.id]?.name || commonTranslations[lang]?.[prod.name] || prod.name;
  };

  const getLocalizedProductBrand = (prod) => {
    return productTranslations[lang]?.[prod.id]?.brand || commonTranslations[lang]?.[prod.brand] || prod.brand;
  };

  const getLocalizedCategory = (category) => {
    return commonTranslations[lang]?.[category] || category;
  };

  const getLocalizedProductSpecs = (prod) => {
    const defaultSpecs = productTranslations[lang]?.[prod.id]?.specs;
    if (defaultSpecs) return defaultSpecs;

    const localized = {};
    if (prod.specs) {
      Object.entries(prod.specs).forEach(([k, v]) => {
        const localizedKey = commonTranslations[lang]?.[k] || k;
        const localizedVal = commonTranslations[lang]?.[v] || v;
        localized[localizedKey] = localizedVal;
      });
    }
    return localized;
  };

  const getLocalizedProductUnit = (unit) => {
    const units = {
      'en': { 'bag': 'bag', 'ton': 'ton', 'piece': 'piece', 'brass': 'brass' },
      'te': { 'bag': 'బస్తా', 'ton': 'టన్ను', 'piece': 'ముక్క', 'brass': 'బ్రాస్' },
      'hi': { 'bag': 'बोरी', 'ton': 'टन', 'piece': 'पीस', 'brass': 'ब्रास' }
    };
    return units[lang]?.[unit] || unit;
  };

  // 3. Civil Material Quantity Estimator Logic
  useEffect(() => {
    let qualityFactor = 1.0;
    if (calcQuality === 'premium') qualityFactor = 1.15;
    if (calcQuality === 'luxury') qualityFactor = 1.35;

    const totalBuildArea = calcArea * calcFloors;

    // Standard structural constants:
    // Cement: 0.4 bags per sq ft
    // Steel: 4.2 kg per sq ft
    // Sand: 1.8 cft per sq ft
    // Aggregate: 1.3 cft per sq ft
    // Bricks: 22 pieces per sq ft
    setEstimates({
      cement: Math.round(totalBuildArea * 0.4 * qualityFactor),
      steel: parseFloat((totalBuildArea * 4.2 * qualityFactor / 1000).toFixed(2)), // in Tons
      sand: parseFloat((totalBuildArea * 1.8 * qualityFactor / 100).toFixed(1)),   // in Brass (100 cft)
      aggregate: parseFloat((totalBuildArea * 1.3 * qualityFactor / 100).toFixed(1)), // in Brass
      bricks: Math.round(totalBuildArea * 22 * qualityFactor)
    });
  }, [calcArea, calcFloors, calcQuality]);

  const addEstimatesToCart = () => {
    let added = 0;
    const ultraTech = products.find(p => p.id === 'cement-ultratech');
    const tataSteel = products.find(p => p.id === 'steel-tata-12');
    const redBricks = products.find(p => p.id === 'bricks-red');
    const sand = products.find(p => p.id === 'sand-river');
    const aggregate = products.find(p => p.id === 'aggregate-20mm');

    if (ultraTech && estimates.cement > 0) {
      addToCart(ultraTech.id, estimates.cement);
      added++;
    }
    if (tataSteel && estimates.steel > 0) {
      addToCart(tataSteel.id, Math.ceil(estimates.steel));
      added++;
    }
    if (redBricks && estimates.bricks > 0) {
      addToCart(redBricks.id, estimates.bricks);
      added++;
    }
    if (sand && estimates.sand > 0) {
      addToCart(sand.id, Math.ceil(estimates.sand));
      added++;
    }
    if (aggregate && estimates.aggregate > 0) {
      addToCart(aggregate.id, Math.ceil(estimates.aggregate));
      added++;
    }

    if (added > 0) {
      const msg = {
        en: 'Estimated civil materials added to quote cart.',
        te: 'లెక్కించబడిన నిర్మాణ మెటీరియల్స్ కోట్ కార్ట్‌లో చేరాయి.',
        hi: 'अनुमानित निर्माण सामग्री कार्ट में जोड़ दी गई है।'
      };
      showToast(msg[lang] || msg['en']);
    }
  };

  // 4. Submit Inquiry Form Pipeline
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) {
      showToast(lang === 'te' ? 'దయచేసి మీ పేరు మరియు ఫోన్ నంబర్ నమోదు చేయండి.' : 'Name and Phone are required.', 'danger');
      return;
    }

    // Submit inquiry through API
    const inquiryPayload = {
      name: inquiryName,
      phone: inquiryPhone,
      message: inquiryMessage || 'Direct inquiry submitted from contact form.',
      items: cart.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          unit: item.product.unit,
          brand: item.product.brand
        },
        quantity: item.quantity
      })),
      subtotal: cartSubtotal,
      deliveryCharge: shippingCost,
      discount: cartDiscount,
      totalEstimate: cartTotal
    };

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryPayload)
      });
      if (res.ok) {
        showToast(lang === 'te' ? 'విచారణ విజయవంతంగా నమోదైంది!' : 'Inquiry recorded in database!');
      }
    } catch (err) {
      console.warn('API Server unavailable. Proceeding directly to WhatsApp channel.', err);
    }

    // Format WhatsApp message
    let redirectText = `*Vigneshwara Traders - Material Booking Request*\n`;
    redirectText += `--------------------------------------\n`;
    redirectText += `*Name:* ${inquiryName}\n`;
    redirectText += `*Phone:* ${inquiryPhone}\n`;
    if (inquiryMessage) redirectText += `*Customer Note:* ${inquiryMessage}\n`;
    redirectText += `--------------------------------------\n`;

    if (cart.length > 0) {
      redirectText += `*Requested Materials:*\n`;
      cart.forEach((item, index) => {
        const itemCost = item.product.price * item.quantity;
        redirectText += `${index + 1}. *${getLocalizedProductName(item.product)}* - Qty: ${item.quantity} ${getLocalizedProductUnit(item.product.unit)} @ ₹${item.product.price}\n`;
      });
      redirectText += `--------------------------------------\n`;
      redirectText += `*Material Subtotal:* ₹${cartSubtotal.toLocaleString('en-IN')}\n`;
      if (cartDiscount > 0) {
        redirectText += `*Bulk Discount:* -₹${cartDiscount.toLocaleString('en-IN')}\n`;
      }
      redirectText += `*Estimated Shipping (${shippingDistance} km):* ₹${shippingCost.toLocaleString('en-IN')}\n`;
      redirectText += `*Estimated Total Booking:* ₹${cartTotal.toLocaleString('en-IN')}\n`;
    } else {
      redirectText += `*Request:* Custom materials availability & pricing details check.`;
    }

    const encodedUrl = `https://wa.me/918639048484?text=${encodeURIComponent(redirectText)}`;
    window.open(encodedUrl, '_blank');

    // Clear Form & Cart
    setInquiryName('');
    setInquiryPhone('');
    setInquiryMessage('');
    setCart([]);
    sessionStorage.removeItem('vt_cart');
    setIsCartOpen(false);
  };

  // WhatsApp cart checkout
  const sendWhatsAppQuote = () => {
    if (cart.length === 0) {
      showToast('Add items to generate booking request!', 'danger');
      return;
    }
    // Simulate inquiry submissions
    setInquiryName('Customer Request');
    setInquiryPhone('Not Specified');
    setInquiryMessage('Instant WhatsApp Checkout');

    let redirectText = `*Vigneshwara Traders - Inquire Order*\n`;
    redirectText += `--------------------------------------\n`;
    cart.forEach((item, index) => {
      const itemCost = item.product.price * item.quantity;
      redirectText += `${index + 1}. *${getLocalizedProductName(item.product)}*\n   Qty: ${item.quantity} ${getLocalizedProductUnit(item.product.unit)} @ ₹${item.product.price}\n   Cost: ₹${itemCost.toLocaleString('en-IN')}\n\n`;
    });
    redirectText += `--------------------------------------\n`;
    redirectText += `*Material Subtotal:* ₹${cartSubtotal.toLocaleString('en-IN')}\n`;
    const cartDiscount = getCartDiscount();
    if (cartDiscount > 0) {
      redirectText += `*Bulk Discount:* -₹${cartDiscount.toLocaleString('en-IN')}\n`;
    }
    redirectText += `*Estimated Delivery Charge (${shippingDistance} km):* ₹${shippingCost.toLocaleString('en-IN')}\n`;
    redirectText += `*Estimated Subtotal:* ₹${(cartSubtotal - cartDiscount + shippingCost).toLocaleString('en-IN')}\n`;
    redirectText += `*(Note: Prices fluctuate daily. Please verify standard delivery charges)*\n\n`;
    redirectText += `Hello Mallesh, I'd like to check material availability and lock this rate quote. Please contact me back.`;

    const encodedUrl = `https://wa.me/918639048484?text=${encodeURIComponent(redirectText)}`;
    window.open(encodedUrl, '_blank');
  };

  // 5. Price Alert Subscription Pipeline
  const handleAlertSubscribe = async (e) => {
    e.preventDefault();
    if (!subName) {
      showToast(lang === 'te' ? 'దయచేసి మీ పేరు నమోదు చేయండి.' : 'Please enter your name.', 'danger');
      return;
    }
    if (!subEmail && !subPhone) {
      showToast(lang === 'te' ? 'ఈమెయిల్ లేదా ఫోన్ నంబర్ నమోదు చేయండి.' : 'Please enter Email or Phone.', 'danger');
      return;
    }

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: subName, email: subEmail, phone: subPhone })
      });
      if (res.ok) {
        showToast(t('prices_alert_btn') + ' ' + (lang === 'te' ? 'విజయవంతమైంది!' : 'Successful!'));
      } else if (res.status === 409) {
        showToast(lang === 'te' ? 'ఈ కాంటాక్ట్ ఇప్పటికే నమోదైంది.' : 'This contact is already subscribed.', 'danger');
      }
    } catch (err) {
      showToast('Offline mode: Alert subscription saved locally!');
    }

    setSubName('');
    setSubEmail('');
    setSubPhone('');
    setIsAlertModalOpen(false);
  };

  // 6. Admin Panel API Integrations
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: adminPassword })
      });
      if (res.ok) {
        const data = await res.json();
        setAdminToken(data.token);
        setIsAdminLoggedIn(true);
        localStorage.setItem('vt_admin_token', data.token);
        showToast('Successfully authenticated admin console.');
        fetchAdminDashboardData(data.token);
      } else {
        showToast('Invalid admin username or password!', 'danger');
      }
    } catch (err) {
      // Offline fallback login for demonstration
      if (adminUsername === 'admin' && adminPassword === 'vigneshwara123') {
        setIsAdminLoggedIn(true);
        setAdminToken('mock-jwt-token');
        localStorage.setItem('vt_admin_token', 'mock-jwt-token');
        showToast('Offline Mode: Authenticated with default credentials.');
      } else {
        showToast('Login failed. Check backend server connection.', 'danger');
      }
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminToken('');
    localStorage.removeItem('vt_admin_token');
    showToast('Logged out of Admin Dashboard.');
  };

  const fetchAdminDashboardData = async (token = adminToken) => {
    if (!token) return;
    try {
      const [inqRes, subRes] = await Promise.all([
        fetch('/api/inquiries', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/subscribers', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (inqRes.status === 401 || inqRes.status === 403 || subRes.status === 401 || subRes.status === 403) {
        handleAdminLogout();
        showToast('Admin session expired. Please log in again.', 'warning');
        return;
      }

      if (inqRes.ok) {
        const inqData = await inqRes.json();
        setAdminInquiries(inqData);
      }
      if (subRes.ok) {
        const subData = await subRes.json();
        setAdminSubscribers(subData);
      }
    } catch (err) {
      console.warn('Unable to pull administration data reports from database.', err);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn && adminToken) {
      fetchAdminDashboardData(adminToken);
    }
  }, [isAdminLoggedIn, adminToken]);

  const handleUpdateGovtPrices = async () => {
    try {
      const res = await fetch('/api/govt-price-index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prices: govtPrices })
      });
      if (res.ok) {
        showToast('Government Price Index updated successfully!');
      } else {
        showToast('Failed to update Government Rates', 'danger');
      }
    } catch (err) {
      showToast('Offline Mode: Updated rates in local memory only.', 'danger');
    }
  };

  const getPastPrice = (product) => {
    const price = parseFloat(product.price) || 0;
    const changeAmount = parseFloat(product.changeAmount) || 0;
    if (product.change === 'up') {
      return price - changeAmount;
    } else if (product.change === 'down') {
      return price + changeAmount;
    }
    return price;
  };

  const handleSendProductAlert = () => {
    setBroadcastData({ type: 'bulk' });
    setIsBroadcastModalOpen(true);
  };

  const getBroadcastMessage = (subscriberName = '') => {
    const nameToUse = subscriberName || (lang === 'te' ? 'కస్టమర్' : lang === 'hi' ? 'ग्राहक' : 'Customer');
    
    let headerText = '';
    let footerText = '';
    
    if (lang === 'te') {
      headerText = `*విగ్నేశ్వరా ట్రేడర్స్ - రోజువారీ ధరల అలర్ట్*\n\nప్రియమైన ${nameToUse},\nమా నిర్మాణ మెటీరియల్స్ యొక్క రోజువారీ ధరల వివరాలు:\n\n`;
      footerText = `\n\nలైవ్ ధరలను ఇక్కడ ట్రాక్ చేయండి: vigneshwaratraders.in\n\nఆర్డర్ కొరకు సంప్రదించండి:\nవిగ్నేశ్వరా ట్రేడర్స్ - 8639048484`;
    } else if (lang === 'hi') {
      headerText = `*विग्नेश्वरा ट्रेडर्स - दैनिक मूल्य अलर्ट*\n\nप्रिय ${nameToUse},\nहमारे निर्माण सामग्री की दैनिक मूल्य सूची:\n\n`;
      footerText = `\n\nलाइव दरें यहाँ देखें: vigneshwaratraders.in\n\nऑर्डर के लिए संपर्क करें:\nविग्नेश्वरा ट्रेडर्स - 8639048484`;
    } else {
      headerText = `*Vigneshwara Traders - Daily Rate Alert*\n\nDear ${nameToUse},\nHere are the daily price updates for our construction materials:\n\n`;
      footerText = `\n\nTrack live rates at: vigneshwaratraders.in\n\nFor inquiries and orders, call us at 8639048484 or reply to this message.`;
    }

    const itemsText = products.map((prod, index) => {
      const localizedName = getLocalizedProductName(prod);
      const localizedUnit = getLocalizedProductUnit(prod.unit);
      const pastPrice = getPastPrice(prod);
      const currentPrice = prod.price;
      
      let trendText = '';
      let wasText = '';
      if (prod.change === 'up') {
        const trendWord = lang === 'te' ? 'పెరుగుదల' : lang === 'hi' ? 'बढ़ोतरी' : 'increase';
        trendText = `📈 ${trendWord} of ₹${prod.changeAmount}`;
        wasText = `~₹${pastPrice}~ ➔ `;
      } else if (prod.change === 'down') {
        const trendWord = lang === 'te' ? 'తగ్గుదల' : lang === 'hi' ? 'कमी' : 'decrease';
        trendText = `📉 ${trendWord} of ₹${prod.changeAmount}`;
        wasText = `~₹${pastPrice}~ ➔ `;
      } else {
        trendText = lang === 'te' ? `➖ స్థిరంగా ఉంది` : lang === 'hi' ? `➖ स्थिर है` : `➖ stable`;
        wasText = '';
      }

      return `${index + 1}. *${localizedName}* (${getLocalizedProductBrand(prod)}): ${wasText}₹${currentPrice}/${localizedUnit} | ${trendText}`;
    }).join('\n');

    return headerText + itemsText + footerText;
  };

  const renderBroadcastPreview = () => {
    const nameToUse = lang === 'te' ? '[సభ్యుని పేరు]' : lang === 'hi' ? '[ग्राहक का नाम]' : '[Subscriber Name]';
    
    let headerText = '';
    let footerText = '';
    
    if (lang === 'te') {
      headerText = `*విగ్నేశ్వరా ట్రేడర్స్ - రోజువారీ ధరల అలర్ట్*\n\nప్రియమైన ${nameToUse},\nమా నిర్మాణ మెటీరియల్స్ యొక్క రోజువారీ ధరల వివరాలు:\n\n`;
      footerText = `\n\nలైవ్ ధరలను ఇక్కడ ట్రాక్ చేయండి: vigneshwaratraders.in\n\nఆర్డర్ కొరకు సంప్రదించండి:\nవిగ్నేశ్వరా ట్రేడర్స్ - 8639048484`;
    } else if (lang === 'hi') {
      headerText = `*विग्नेश्वरा ट्रेडर्स - दैनिक मूल्य अलर्ट*\n\nप्रिय ${nameToUse},\nहमारे निर्माण सामग्री की दैनिक मूल्य सूची:\n\n`;
      footerText = `\n\nलाइव दरें यहाँ देखें: vigneshwaratraders.in\n\nऑर्डर के लिए संपर्क करें:\nविग्नेश्वरा ट्रेडर्स - 8639048484`;
    } else {
      headerText = `*Vigneshwara Traders - Daily Rate Alert*\n\nDear ${nameToUse},\nHere are the daily price updates for our construction materials:\n\n`;
      footerText = `\n\nTrack live rates at: vigneshwaratraders.in\n\nFor inquiries and orders, call us at 8639048484 or reply to this message.`;
    }

    return (
      <div style={{ fontFamily: 'sans-serif', whiteSpace: 'pre-wrap', lineHeight: 1.5, textAlign: 'left' }}>
        <div>{headerText.replace(/\*/g, '')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '12px 0' }}>
          {products.map((prod, index) => {
            const localizedName = getLocalizedProductName(prod);
            const localizedUnit = getLocalizedProductUnit(prod.unit);
            const pastPrice = getPastPrice(prod);
            const currentPrice = prod.price;
            
            let graphIcon = null;
            let trendLabel = '';
            
            if (prod.change === 'up') {
              const trendWord = lang === 'te' ? 'పెరుగుదల' : lang === 'hi' ? 'बढ़ोतरी' : 'increase';
              trendLabel = `${trendWord} of ₹${prod.changeAmount}`;
              graphIcon = <TrendingUp size={16} style={{ color: '#ef4444', display: 'inline', marginLeft: '6px', marginRight: '4px', verticalAlign: 'middle' }} />;
            } else if (prod.change === 'down') {
              const trendWord = lang === 'te' ? 'తగ్గుదల' : lang === 'hi' ? 'कमी' : 'decrease';
              trendLabel = `${trendWord} of ₹${prod.changeAmount}`;
              graphIcon = <TrendingDown size={16} style={{ color: '#10b981', display: 'inline', marginLeft: '6px', marginRight: '4px', verticalAlign: 'middle' }} />;
            } else {
              trendLabel = lang === 'te' ? 'స్థిరంగా ఉంది' : lang === 'hi' ? 'స్థిరంగా ఉంది' : 'stable';
              graphIcon = <Minus size={16} style={{ color: '#3b82f6', display: 'inline', marginLeft: '6px', marginRight: '4px', verticalAlign: 'middle' }} />;
            }

            return (
              <div key={prod.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>{index + 1}.</span>
                <strong style={{ color: 'white' }}>{localizedName}</strong>{' '}
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({getLocalizedProductBrand(prod)})</span>:{' '}
                {prod.change !== 'stable' && prod.changeAmount > 0 && (
                  <>
                    <span style={{ textDecoration: 'line-through', color: 'rgba(255, 255, 255, 0.4)', marginRight: '4px' }}>
                      ₹{pastPrice}
                    </span>
                    <span style={{ color: 'var(--text-muted)', marginRight: '4px' }}>➔</span>
                  </>
                )}
                <strong style={{ color: 'var(--success)' }}>₹{currentPrice}</strong>
                <span style={{ color: 'var(--text-muted)' }}>/{localizedUnit}</span>
                <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>|</span>
                {graphIcon}
                <span style={{
                  color: prod.change === 'up' ? '#ef4444' : prod.change === 'down' ? '#10b981' : '#3b82f6',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}>
                  {trendLabel}
                </span>
              </div>
            );
          })}
        </div>
        <div>{footerText.replace(/\*/g, '')}</div>
      </div>
    );
  };

  const triggerBackendAlert = async () => {
    try {
      const res = await fetch(`/api/products/send-broadcast-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (res.status === 401 || res.status === 403) {
        handleAdminLogout();
        showToast('Admin session expired. Please log in again.', 'warning');
        return;
      }

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || 'Alert broadcast logged successfully on server.');
      }
    } catch (err) {
      console.warn('Backend alert log failed:', err);
    }
  };

  const handleWhatsAppBroadcast = () => {
    if (!broadcastData) return;
    const subscribersWithPhone = adminSubscribers.filter(s => s.phone);
    if (subscribersWithPhone.length === 0) {
      showToast('No subscriber phone numbers available.', 'danger');
      return;
    }
    showToast('Opening WhatsApp broadcast tabs... Please allow pop-ups if blocked.');
    subscribersWithPhone.forEach(sub => {
      let phone = sub.phone.replace(/[^0-9]/g, '');
      if (phone.length === 10) phone = '91' + phone;
      const personalMsg = getBroadcastMessage(sub.name);
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(personalMsg)}`;
      window.open(waUrl, '_blank');
    });
    triggerBackendAlert();
    setIsBroadcastModalOpen(false);
    setBroadcastData(null);
  };

  const handleWhatsAppIndividual = (phone, body) => {
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(body)}`;
    window.open(waUrl, '_blank');
  };

  const handleEmailBroadcast = () => {
    if (!broadcastData) return;
    const emails = adminSubscribers.map(s => s.email).filter(Boolean).join(',');
    if (!emails) {
      showToast('No subscriber email addresses available.', 'danger');
      return;
    }
    const subject = `Vigneshwara Traders Daily Rate Updates`;
    const body = getBroadcastMessage();
    const mailtoUrl = `mailto:?bcc=${encodeURIComponent(emails)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    triggerBackendAlert();
    setIsBroadcastModalOpen(false);
    setBroadcastData(null);
  };

  const handleUpdateProductPrice = async (prodId, updatedPrice, trend, trendAmt) => {
    try {
      const res = await fetch(`/api/products/${prodId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          price: parseFloat(updatedPrice),
          change: trend,
          changeAmount: parseFloat(trendAmt)
        })
      });

      if (res.status === 401 || res.status === 403) {
        handleAdminLogout();
        showToast('Admin session expired. Please log in again.', 'warning');
        return;
      }

      if (res.ok) {
        showToast('Product Daily Price updated on server.');
        fetchProducts(); // Refresh rates on UI
      }
    } catch (err) {
      // Local state modification fallback
      setProducts(prev => prev.map(p =>
        p.id === prodId
          ? { ...p, price: parseFloat(updatedPrice), change: trend, changeAmount: parseFloat(trendAmt) }
          : p
      ));
      showToast('Offline Mode: Saved rates to local runtime state.');
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm(t('admin_confirm_delete'))) return;

    try {
      const res = await fetch(`/api/products/${prodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (res.status === 401 || res.status === 403) {
        handleAdminLogout();
        showToast('Admin session expired. Please log in again.', 'warning');
        return;
      }

      if (res.ok) {
        showToast('Product deleted from server database.');
        fetchProducts();
      } else {
        const errorData = await res.json();
        showToast(errorData.message || 'Failed to delete product', 'danger');
      }
    } catch (err) {
      setProducts(prev => prev.filter(p => p.id !== prodId));
      showToast('Offline Mode: Deleted product from local runtime state.');
    }
  };

  // Update Customer Inquiry status (pending/processed/cancelled)
  const handleUpdateInquiryStatus = async (inqId, statusValue) => {
    try {
      const res = await fetch(`/api/inquiries/${inqId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: statusValue })
      });

      if (res.status === 401 || res.status === 403) {
        handleAdminLogout();
        showToast('Admin session expired. Please log in again.', 'warning');
        return;
      }

      if (res.ok) {
        showToast(`Order status updated to: ${statusValue}`);
        fetchAdminDashboardData();
      }
    } catch (err) {
      // Update locally
      setAdminInquiries(prev => prev.map(inq =>
        inq._id === inqId ? { ...inq, status: statusValue } : inq
      ));
      showToast('Offline Mode: Updated order status locally.');
    }
  };

  // Router dispatcher targeting specific section anchors
  const navigateToPage = (pageId, scrollTarget = null) => {
    setCurrentPage(pageId);
    if (scrollTarget) {
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  };

  // Filter Catalog logic
  const filteredProducts = products.filter(p => {
    if (catalogFilter !== 'all' && p.category !== catalogFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name && p.name.toLowerCase().includes(q);
      const matchBrand = p.brand && p.brand.toLowerCase().includes(q);
      const matchCategory = p.category && p.category.toLowerCase().includes(q);
      let matchSpecs = false;
      if (p.specs) {
        matchSpecs = Object.entries(p.specs).some(([k, v]) =>
          k.toLowerCase().includes(q) || v.toLowerCase().includes(q)
        );
      }
      return matchName || matchBrand || matchCategory || matchSpecs;
    }
    return true;
  });

  // Dynamic status details
  const activeDayIndex = new Date().getDay();

  return (
    <div>
      {/* Toast Alert Popups container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-item ${toast.type === 'danger' ? 'danger' : ''}`}>
            {toast.message}
          </div>
        ))}
      </div>

      {/* Sticky Premium Navigation Header */}
      <header className="header">
        <div className="container nav-container">
          <div className="logo-group" onClick={() => navigateToPage('landing')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">VT</div>
            <span className="logo-text">VIGNESHWARA <span className="serif-italic">Traders</span></span>
          </div>

          <nav aria-label="Main Navigation">
            <ul className="nav-menu">
              <li><span className={`nav-link ${currentPage === 'landing' ? 'active' : ''}`} onClick={() => navigateToPage('landing')}>{t('nav_home')}</span></li>
              <li><span className={`nav-link ${currentPage === 'prices' ? 'active' : ''}`} onClick={() => navigateToPage('prices')}>{t('nav_prices')}</span></li>
              <li><span className={`nav-link ${currentPage === 'calculator' ? 'active' : ''}`} onClick={() => navigateToPage('calculator')}>{t('nav_calculator')}</span></li>
              <li><span className={`nav-link ${currentPage === 'products' ? 'active' : ''}`} onClick={() => navigateToPage('products')}>{t('nav_products')}</span></li>
              <li><span className={`nav-link`} onClick={() => navigateToPage('landing', 'contact')}>{t('nav_details')}</span></li>
              <li><span className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`} onClick={() => navigateToPage('admin')}>{t('nav_admin')}</span></li>
            </ul>
          </nav>

          <div className="nav-right">
            <select
              id="langSelect"
              value={lang}
              onChange={(e) => changeLanguage(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="en">🌐 English</option>
              <option value="te">🌐 తెలుగు (Telugu)</option>
              <option value="hi">🌐 हिन्दी (Hindi)</option>
            </select>

            <div
              className="status-badge"
              style={{ borderColor: shopOpen ? 'var(--success)' : 'var(--danger)', color: shopOpen ? 'var(--success)' : 'var(--danger)' }}
            >
              <span className={`status-dot ${shopOpen ? 'open' : 'closed'}`}></span>
              {shopOpen ? (
                <span>{lang === 'te' ? 'స్టోర్ తెరిచి ఉంది' : (lang === 'hi' ? 'स्टोर खुला है' : 'Open Now (Closes at 6:30 PM)')}</span>
              ) : (
                <span>{lang === 'te' ? 'స్టోర్ మూసివేయబడింది' : (lang === 'hi' ? 'स्टोर बंद है' : 'Closed Now')} ({nextShopSchedule})</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Single Page Application Wrapper */}
      <main style={{ minHeight: '80vh', paddingTop: '80px' }}>

        {/* SPA PAGE 1: LANDING PAGE */}
        {currentPage === 'landing' && (
          <div className="reveal active">

            {/* Hero Banner Grid */}
            <section className="hero">
              <div className="container hero-grid">
                <div className="hero-content">
                  <div className="hero-tag">
                    <Sparkles size={14} style={{ marginRight: '6px' }} />
                    {t('hero_tag')}
                  </div>
                  <h1 className="hero-title">
                    {lang === 'te' ? (
                      <span>ఉత్తమమైన <span className="serif-italic">మెటీరియల్స్</span> తో మీ కలల ఇల్లు కట్టండి.</span>
                    ) : lang === 'hi' ? (
                      <span>प्रीमियम <span className="serif-italic">सामग्री</span> के साथ अपने सपनों का घर बनाएं।</span>
                    ) : (
                      <span>Building Your <span className="serif-italic">Dreams</span> With <span>Premium Materials</span>.</span>
                    )}
                  </h1>
                  <p className="hero-desc">{t('hero_desc')}</p>

                  <div className="hero-buttons">
                    <button className="btn btn-primary" onClick={() => navigateToPage('prices')}>
                      {t('hero_btn_prices')}
                      <ChevronRight size={18} />
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigateToPage('calculator')}>
                      {t('hero_btn_calc')}
                    </button>
                  </div>
                </div>

                <div className="hero-visual">
                  <div className="visual-backdrop"></div>
                  {productsLoading || !products || products.length === 0 ? (
                    <div className="visual-card-skeleton">
                      <div className="visual-top" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ width: '60%' }}>
                          <span className="skeleton-bar skeleton-shimmer" style={{ width: '80px', height: '14px', marginBottom: '8px' }}></span>
                          <span className="skeleton-bar skeleton-shimmer" style={{ width: '100%', height: '28px' }}></span>
                        </div>
                        <span className="skeleton-bar skeleton-shimmer" style={{ width: '60px', height: '24px', borderRadius: '6px' }}></span>
                      </div>

                      <div className="visual-middle" style={{ margin: '24px 0' }}>
                        <div className="visual-stat" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span className="skeleton-bar skeleton-shimmer" style={{ width: '120px', height: '48px' }}></span>
                          <span className="skeleton-bar skeleton-shimmer" style={{ width: '40px', height: '16px' }}></span>
                        </div>
                        <span className="skeleton-bar skeleton-shimmer" style={{ width: '110px', height: '24px', marginTop: '12px', borderRadius: '20px' }}></span>
                      </div>

                      <div className="visual-bottom" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="visual-user" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="skeleton-bar skeleton-shimmer" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
                          <div className="user-info">
                            <span className="skeleton-bar skeleton-shimmer" style={{ width: '100px', height: '14px', marginBottom: '4px' }}></span>
                            <span className="skeleton-bar skeleton-shimmer" style={{ width: '120px', height: '10px' }}></span>
                          </div>
                        </div>
                        <span className="skeleton-bar skeleton-shimmer" style={{ width: '100px', height: '36px', borderRadius: '8px' }}></span>
                      </div>
                    </div>
                  ) : (
                    <div className="visual-card">
                      <div className="visual-top">
                        <div>
                          <span className="visual-label">{t('visual_featured')}</span>
                          <h2 className="visual-title">{getLocalizedProductName(products[0])}</h2>
                        </div>
                        <span className="brand-badge">{products[0].brand}</span>
                      </div>

                      <div className="visual-middle">
                        <div className="visual-stat">
                          <span className="visual-value">₹{products[0].price}</span>
                          <span className="visual-unit">/ {getLocalizedProductUnit(products[0].unit)}</span>
                        </div>
                        <span className="visual-badge">
                          <TrendingDown size={14} style={{ marginRight: '4px' }} />
                          {t('visual_price_drop')}
                        </span>
                      </div>

                      <div className="visual-bottom">
                        <div className="visual-user">
                          <div className="user-avatar" style={{ background: 'linear-gradient(to right, var(--primary), var(--accent))', color: 'white' }}>VT</div>
                          <div className="user-info">
                            <h5>Vigneshwara Traders</h5>
                            <p>Premium Authorized Dealer</p>
                          </div>
                        </div>
                        <button className="btn-add-quote" onClick={() => addToCart(products[0].id)}>
                          {t('visual_btn_quote')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Platform Feature Solutions section */}
            <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="container">
                <div className="section-header">
                  <span className="section-tagline">{t('feature_tagline')}</span>
                  <h2 className="section-title">{t('feature_title')}</h2>
                  <p className="section-desc">{t('feature_desc')}</p>
                </div>

                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <LineChart size={24} />
                    </div>
                    <h3 className="feature-title">{t('feat1_title')}</h3>
                    <p className="feature-desc">{t('feat1_desc')}</p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <Calculator size={24} />
                    </div>
                    <h3 className="feature-title">{t('feat2_title')}</h3>
                    <p className="feature-desc">{t('feat2_desc')}</p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <ShoppingCart size={24} />
                    </div>
                    <h3 className="feature-title">{t('feat3_title')}</h3>
                    <p className="feature-desc">{t('feat3_desc')}</p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <ShieldCheck size={24} />
                    </div>
                    <h3 className="feature-title">{t('feat4_title')}</h3>
                    <p className="feature-desc">{t('feat4_desc')}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="section-padding">
              <div className="container">
                <div className="section-header">
                  <span className="section-tagline">{t('testimonials_tagline')}</span>
                  <h2 className="section-title">{t('testimonials_title')}</h2>
                  <p className="section-desc">{t('testimonials_desc')}</p>
                </div>

                <div className="testimonials-grid">
                  <div className="testimonial-card">
                    <div>
                      <div className="testimonial-rating">★★★★★</div>
                      <p className="testimonial-text">{t('test1_text')}</p>
                    </div>
                    <div className="visual-user" style={{ marginTop: '24px' }}>
                      <div className="user-avatar" style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}>RD</div>
                      <div className="user-info">
                        <h5>{t('test1_author')}</h5>
                        <p>{t('test1_role')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="testimonial-card">
                    <div>
                      <div className="testimonial-rating">★★★★★</div>
                      <p className="testimonial-text">{t('test2_text')}</p>
                    </div>
                    <div className="visual-user" style={{ marginTop: '24px' }}>
                      <div className="user-avatar" style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>KP</div>
                      <div className="user-info">
                        <h5>{t('test2_author')}</h5>
                        <p>{t('test2_role')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Warehouse Map & Custom Contact Form */}
            <section className="section-padding" id="contact" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="container contact-grid">
                <div className="contact-info-panel">
                  <div>
                    <span className="section-tagline">{t('contact_tagline')}</span>
                    <h2 className="section-title" style={{ marginTop: '8px' }}>{t('contact_title')}</h2>
                    <p className="section-desc">{t('contact_desc')}</p>
                  </div>

                  <div>
                    <h3 style={{ color: 'white', marginBottom: '12px' }}>{t('hours_title')}</h3>
                    <table className="schedule-table">
                      <tbody>
                        <tr className={activeDayIndex === 1 ? 'today' : ''}><td>{t('day_mon')}</td><td>9:00 AM - 6:30 PM</td></tr>
                        <tr className={activeDayIndex === 2 ? 'today' : ''}><td>{t('day_tue')}</td><td>9:00 AM - 6:30 PM</td></tr>
                        <tr className={activeDayIndex === 3 ? 'today' : ''}><td>{t('day_wed')}</td><td>9:00 AM - 6:30 PM</td></tr>
                        <tr className={activeDayIndex === 4 ? 'today' : ''}><td>{t('day_thu')}</td><td>9:00 AM - 6:30 PM</td></tr>
                        <tr className={activeDayIndex === 5 ? 'today' : ''}><td>{t('day_fri')}</td><td>9:00 AM - 6:30 PM</td></tr>
                        <tr className={activeDayIndex === 6 ? 'today' : ''}><td>{t('day_sat')}</td><td>9:00 AM - 6:30 PM</td></tr>
                        <tr className={activeDayIndex === 0 ? 'today' : ''}><td>{t('day_sun')}</td><td style={{ color: 'var(--danger)' }}>{t('status_closed')}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="contact-card-item">
                    <div className="contact-icon-box">
                      <MapPin size={20} />
                    </div>
                    <div className="contact-card-text">
                      <h4>{t('address_title')}</h4>
                      <p>MFFX+74M VIGNESHWARA TRADERS, Hyderabad Rd, Kalwakurthy, Telangana 509324</p>
                      <a href="https://www.google.com/maps/search/?api=1&query=VIGNESHWARA+TRADERS+Hyderabad+Rd+Kalwakurthy+Telangana+509324" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', marginTop: '10px', display: 'inline-flex', gap: '6px' }}>
                        {t('map_btn_visit')}
                      </a>
                    </div>
                  </div>

                  <div className="contact-card-item">
                    <div className="contact-icon-box">
                      <Phone size={20} />
                    </div>
                    <div className="contact-card-text">
                      <h4>{t('support_title')}</h4>
                      <p>
                        <a href="tel:+918639048484" style={{ color: 'var(--primary)', fontWeight: 600 }}>📞 Call: +91 86390 48484</a><br />
                        <a href="https://wa.me/918639048484" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '0.9rem' }}>💬 WhatsApp: +91 86390 48484</a><br />
                        <a href="mailto:mallesh.dln@gmail.com" style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '0.9rem' }}>✉️ Email: mallesh.dln@gmail.com</a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="contact-form-box">
                  <h3 style={{ color: 'white', marginBottom: '8px' }}>{t('inquiry_title')}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>{t('inquiry_desc')}</p>

                  <form onSubmit={handleInquirySubmit}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="contactName">{t('inquiry_label_name')}</label>
                        <input type="text" className="form-input" id="contactName" placeholder="e.g. Rajesh Kumar" value={inquiryName} onChange={(e) => setInquiryName(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="contactPhone">{t('inquiry_label_phone')}</label>
                        <input type="tel" className="form-input" id="contactPhone" placeholder="e.g. 8639048484" value={inquiryPhone} onChange={(e) => setInquiryPhone(e.target.value)} required />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                      <label htmlFor="contactMessage">{t('inquiry_label_message')}</label>
                      <textarea className="form-textarea" id="contactMessage" placeholder="Specify items (e.g. 100 bags ACC Cement, 2 tons TATA Steel 12mm)" value={inquiryMessage} onChange={(e) => setInquiryMessage(e.target.value)} required></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      {t('inquiry_btn_submit')}
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* SPA PAGE 2: LIVE PRICES DASHBOARD */}
        {currentPage === 'prices' && (
          <section className="section-padding">
            <div className="container">
              <div className="section-header">
                <span className="section-tagline">{t('prices_tagline')}</span>
                <h2 className="section-title">{t('prices_title')}</h2>
                <p className="section-desc">{t('prices_desc')}</p>
              </div>

              <div className="price-container">
                <div className="prices-grid">
                  {productsLoading || !products || products.length === 0 ? (
                    Array(6).fill(0).map((_, idx) => (
                      <div className="price-card-skeleton" key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ width: '60%' }}>
                            <span className="skeleton-bar skeleton-shimmer" style={{ width: '80%', height: '18px', marginBottom: '6px' }}></span>
                            <span className="skeleton-bar skeleton-shimmer" style={{ width: '40%', height: '12px' }}></span>
                          </div>
                          <span className="skeleton-bar skeleton-shimmer" style={{ width: '50px', height: '20px', borderRadius: '4px' }}></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '12px' }}>
                          <span className="skeleton-bar skeleton-shimmer" style={{ width: '80px', height: '36px' }}></span>
                          <span className="skeleton-bar skeleton-shimmer" style={{ width: '30px', height: '14px' }}></span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                          <span className="skeleton-bar skeleton-shimmer" style={{ width: '70px', height: '14px' }}></span>
                          <span className="skeleton-bar skeleton-shimmer" style={{ width: '40px', height: '12px' }}></span>
                        </div>
                      </div>
                    ))
                  ) : (
                    products.map(prod => (
                      <div className={`price-card ${prod.change}-trend`} key={prod.id}>
                        <div className="price-card-header">
                          <div className="product-info">
                            <h3>{getLocalizedProductName(prod)}</h3>
                            <span>{getLocalizedProductBrand(prod)}</span>
                          </div>
                          <span className="brand-badge">{prod.category.toUpperCase()}</span>
                        </div>
                        <div className="price-main">
                          <span className="price-currency">₹</span>
                          <span className="price-amount">{prod.price}</span>
                          <span className="price-unit">/ {getLocalizedProductUnit(prod.unit)}</span>
                        </div>
                        <div className="price-change-row">
                          {prod.change === 'up' && (
                            <span className="price-change up" style={{ color: 'var(--danger)' }}>
                              <TrendingUp size={14} /> +₹{prod.changeAmount} ({lang === 'te' ? 'పెరిగింది' : (lang === 'hi' ? 'बढ़ी' : 'up')})
                            </span>
                          )}
                          {prod.change === 'down' && (
                            <span className="price-change down" style={{ color: 'var(--success)' }}>
                              <TrendingDown size={14} /> -₹{prod.changeAmount} ({lang === 'te' ? 'తగ్గింది' : (lang === 'hi' ? 'घटी' : 'down')})
                            </span>
                          )}
                          {prod.change === 'stable' && (
                            <span className="price-change stable" style={{ color: 'var(--text-muted)' }}>
                              ➖ {lang === 'te' ? 'స్థిరంగా ఉంది' : (lang === 'hi' ? 'स्थिर' : 'Stable')}
                            </span>
                          )}
                          <span className="price-timestamp">{lang === 'te' ? 'ఈరోజు' : (lang === 'hi' ? 'आज' : 'Today')}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="price-alert-box">
                  <div>
                    <div className="alert-icon">
                      <Clock size={24} />
                    </div>
                    <h3>{t('prices_alert_title')}</h3>
                    <p>{t('prices_alert_desc')}</p>
                  </div>

                  <button className="btn btn-accent" onClick={() => setIsAlertModalOpen(true)}>
                    {t('prices_alert_btn')}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SPA PAGE 3: CIVIL MATERIAL QUANTITY CALCULATOR */}
        {currentPage === 'calculator' && (
          <section className="section-padding">
            <div className="container">
              <div className="section-header">
                <span className="section-tagline">{t('calc_tagline')}</span>
                <h2 className="section-title">{t('calc_title')}</h2>
                <p className="section-desc">{t('calc_desc')}</p>
              </div>

              <div className="calc-container">
                <div className="calc-form">
                  <div className="calc-group">
                    <label htmlFor="calcArea">
                      {t('calc_label_area')} <span>({calcArea} Sq Ft)</span>
                    </label>
                    <div className="calc-range-container">
                      <input type="range" className="calc-range" min="100" max="10000" step="50" value={calcArea} onChange={(e) => setCalcArea(parseInt(e.target.value))} />
                      <input type="number" className="calc-number-input" min="100" max="10000" value={calcArea} onChange={(e) => setCalcArea(parseInt(e.target.value) || 0)} />
                    </div>
                  </div>

                  <div className="calc-group">
                    <label htmlFor="calcFloors">{t('calc_label_floors')}</label>
                    <select className="calc-select" id="calcFloors" value={calcFloors} onChange={(e) => setCalcFloors(parseInt(e.target.value))}>
                      <option value="1">Ground Floor Only (G)</option>
                      <option value="2">G + 1 Floor</option>
                      <option value="3">G + 2 Floors</option>
                      <option value="4">G + 3 Floors</option>
                    </select>
                  </div>

                  <div className="calc-group">
                    <label htmlFor="calcQuality">{t('calc_label_quality')}</label>
                    <select className="calc-select" id="calcQuality" value={calcQuality} onChange={(e) => setCalcQuality(e.target.value)}>
                      <option value="standard">Standard Structure (Fe 500 Steel + ACC PPC)</option>
                      <option value="premium">Premium Quality (Fe 550D Steel + UltraTech OPC)</option>
                      <option value="luxury">Heavy High-Strength (Fe 550D + UltraTech Premium + 25% safety)</option>
                    </select>
                  </div>
                </div>

                <div className="calc-results">
                  <div>
                    <div className="calc-results-header">
                      <h3 style={{ color: 'white' }}>{t('calc_res_title')}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>{t('calc_res_desc')}</p>
                    </div>

                    <div className="calc-results-grid">
                      <div className="result-card">
                        <div className="result-icon">🧱</div>
                        <div className="result-info">
                          <h4>{t('calc_res_cement')}</h4>
                          <p>{estimates.cement} <span>{getLocalizedProductUnit('bag')}</span></p>
                        </div>
                      </div>

                      <div className="result-card">
                        <div className="result-icon">🔩</div>
                        <div className="result-info">
                          <h4>{t('calc_res_steel')}</h4>
                          <p>{estimates.steel} <span>{getLocalizedProductUnit('ton')}</span></p>
                        </div>
                      </div>

                      <div className="result-card">
                        <div className="result-icon">🏜️</div>
                        <div className="result-info">
                          <h4>{t('calc_res_sand')}</h4>
                          <p>{estimates.sand} <span>{getLocalizedProductUnit('brass')}</span></p>
                        </div>
                      </div>

                      <div className="result-card">
                        <div className="result-icon">🪨</div>
                        <div className="result-info">
                          <h4>{t('calc_res_aggregate')}</h4>
                          <p>{estimates.aggregate} <span>{getLocalizedProductUnit('brass')}</span></p>
                        </div>
                      </div>

                      <div className="result-card" style={{ gridColumn: 'span 2' }}>
                        <div className="result-icon">🧱</div>
                        <div className="result-info">
                          <h4>{t('calc_res_bricks')}</h4>
                          <p>{estimates.bricks.toLocaleString()} <span>{getLocalizedProductUnit('piece')}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="calc-action">
                    <button className="btn btn-accent" onClick={addEstimatesToCart}>
                      {t('calc_btn_add')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SPA PAGE 4: PRODUCT CATALOG */}
        {currentPage === 'products' && (
          <section className="section-padding">
            <div className="container catalog-layout">
              <div className="section-header">
                <span className="section-tagline">{t('catalog_tagline')}</span>
                <h2 className="section-title">{t('catalog_title')}</h2>
                <p className="section-desc">{t('catalog_desc')}</p>
              </div>

              {/* Premium Search Bar */}
              <div className="search-bar-container" style={{
                maxWidth: '600px',
                margin: '0 auto 30px auto',
                position: 'relative',
                zIndex: 10
              }}>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('catalog_search_placeholder')}
                    style={{
                      width: '100%',
                      padding: '14px 20px 14px 46px',
                      borderRadius: '30px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      color: 'white',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(5px)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = '0 0 15px var(--primary-glow)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-color)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    left: '18px',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none'
                  }}>
                    🔍
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '18px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>

              <div className="catalog-filters">
                <button className={`filter-btn ${catalogFilter === 'all' ? 'active' : ''}`} onClick={() => setCatalogFilter('all')}>{t('catalog_btn_all')}</button>
                <button className={`filter-btn ${catalogFilter === 'cement' ? 'active' : ''}`} onClick={() => setCatalogFilter('cement')}>{t('catalog_btn_cement')}</button>
                <button className={`filter-btn ${catalogFilter === 'steel' ? 'active' : ''}`} onClick={() => setCatalogFilter('steel')}>{t('catalog_btn_steel')}</button>
                <button className={`filter-btn ${catalogFilter === 'bricks' ? 'active' : ''}`} onClick={() => setCatalogFilter('bricks')}>{t('catalog_btn_bricks')}</button>
                <button className={`filter-btn ${catalogFilter === 'aggregates' ? 'active' : ''}`} onClick={() => setCatalogFilter('aggregates')}>{t('catalog_btn_aggregates')}</button>
              </div>

<div className="catalog-grid">
                {productsLoading || !products || products.length === 0 ? (
                  Array(4).fill(0).map((_, idx) => (
                    <div className="catalog-card-skeleton" key={idx}>
                      <div className="skeleton-image-placeholder skeleton-shimmer"></div>
                      <div className="skeleton-body-placeholder">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span className="skeleton-bar skeleton-shimmer" style={{ width: "60px", height: "14px" }}></span>
                          <span className="skeleton-bar skeleton-shimmer" style={{ width: "80px", height: "18px", borderRadius: "12px" }}></span>
                        </div>
                        <span className="skeleton-bar skeleton-shimmer" style={{ width: "70%", height: "24px", marginBottom: "16px" }}></span>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                          <span className="skeleton-bar skeleton-shimmer" style={{ width: "90%", height: "12px" }}></span>
                          <span className="skeleton-bar skeleton-shimmer" style={{ width: "80%", height: "12px" }}></span>
                          <span className="skeleton-bar skeleton-shimmer" style={{ width: "85%", height: "12px" }}></span>
                        </div>
                        
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                          <span className="skeleton-bar skeleton-shimmer" style={{ width: "100px", height: "28px" }}></span>
                          <span className="skeleton-bar skeleton-shimmer" style={{ width: "110px", height: "36px", borderRadius: "8px" }}></span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  filteredProducts.map(prod => (
                    <div className="catalog-card" key={prod.id}>
                      <div className="catalog-img-wrapper">
                        <img className="catalog-img" src={prod.img} alt={getLocalizedProductName(prod)} />
                        <span className="catalog-tag">{getLocalizedProductBrand(prod)}</span>
                      </div>
                      <div className="catalog-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span className="catalog-brand">{getLocalizedCategory(prod.category).toUpperCase()}</span>
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: prod.quantity > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: prod.quantity > 0 ? '#34d399' : '#f87171',
                            border: prod.quantity > 0 ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                            fontWeight: 600
                          }}>
                            {prod.quantity > 0
                              ? `${lang === 'te' ? 'స్టాక్ ఉంది' : (lang === 'hi' ? 'స్టॉक में' : 'In Stock')}: ${prod.quantity} ${getLocalizedProductUnit(prod.unit)}${lang === 'en' && prod.quantity > 1 ? 's' : ''}`
                              : (lang === 'te' ? 'స్టాక్ లేదు' : (lang === 'hi' ? 'స్టాక్ సమాప్త్' : 'Out of Stock'))}
                          </span>
                        </div>
                        <h3 className="catalog-name">{getLocalizedProductName(prod)}</h3>
                        <ul className="catalog-spec-list">
                          {Object.entries(getLocalizedProductSpecs(prod)).map(([k, v]) => (
                            <li key={k}><span>{k}:</span> <strong>{v}</strong></li>
                          ))}
                        </ul>
                        <div className="catalog-price-row">
                          <div className="catalog-price">
                            ₹{prod.price} <span>/ {getLocalizedProductUnit(prod.unit)}</span>
                          </div>
                          <button className="btn-add-quote" onClick={() => addToCart(prod.id)}>
                            <Plus size={16} /> {lang === 'te' ? 'కోట్ కార్ట్' : (lang === 'hi' ? 'कार्ट जोड़ें' : 'Add to Quote')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {currentPage === 'admin' && (
          <section className="section-padding">
            <div className="container">

              {!isAdminLoggedIn ? (
                /* Admin Login View */
                <div className="admin-login-container">
                  <form onSubmit={handleAdminLogin} className="admin-login-card">
                    <div style={{ textAlign: 'center' }}>
                      <Lock size={32} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
                      <h2 style={{ color: 'white' }}>{t('admin_login_title')}</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>{t('admin_login_desc')}</p>
                    </div>

                    <div className="form-group">
                      <label htmlFor="admUser">{t('admin_label_username')}</label>
                      <input type="text" className="form-input" id="admUser" placeholder={userPlaceholder[lang]} value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="admPass">{t('admin_label_password')}</label>
                      <input type="password" className="form-input" id="admPass" placeholder={passPlaceholder[lang]} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      {t('admin_btn_login')}
                    </button>
                  </form>
                </div>
              ) : (
                /* Admin Dashboard Console View */
                <div className="admin-dashboard-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h2 style={{ color: 'white' }}>{t('admin_title_center')}</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('admin_desc_center')}</p>
                    </div>
                    <button className="btn btn-secondary" onClick={handleAdminLogout} style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', gap: '6px' }}>
                      <LogOut size={16} /> {t('admin_btn_logout')}
                    </button>
                  </div>

                  {/* Dashboard Tab Filters */}
                  <div className="admin-tabs">
                    <button className={`admin-tab-btn ${adminActiveTab === 'prices' ? 'active' : ''}`} onClick={() => setAdminActiveTab('prices')}>{t('admin_tab_rates')}</button>
                    <button className={`admin-tab-btn ${adminActiveTab === 'inquiries' ? 'active' : ''}`} onClick={() => setAdminActiveTab('inquiries')}>{t('admin_tab_inquiries')} ({adminInquiries.length})</button>
                    <button className={`admin-tab-btn ${adminActiveTab === 'subscribers' ? 'active' : ''}`} onClick={() => setAdminActiveTab('subscribers')}>{t('admin_tab_subscribers')} ({adminSubscribers.length})</button>
                  </div>

                  {/* Tab 1: Prices Control */}
                  {adminActiveTab === 'prices' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                        <h3 style={{ color: 'white', margin: 0 }}>{t('admin_title_rates_setting')}</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            className="btn btn-primary"
                            onClick={handleSendProductAlert}
                            style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(16, 185, 129, 0.25)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34d399' }}
                          >
                            <Bell size={16} />
                            {lang === 'te' ? 'రోజువారీ ధరల అలర్ట్ పంపు' : (lang === 'hi' ? 'दैनिक दर अलर्ट भेजें' : 'Send Daily Rates Alert')}
                          </button>
                          <button
                            className="btn btn-accent"
                            onClick={() => setIsAddProductModalOpen(true)}
                            style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Plus size={16} />
                            {t('admin_btn_add_product')}
                          </button>
                        </div>
                      </div>
                      <div className="inquiries-list">
                        {products.map(prod => {
                          // Local state for inputs to allow modifying independently before submit
                          return (
                            <AdminPriceRow
                              key={prod.id}
                              product={prod}
                              onSave={handleUpdateProductPrice}
                              onEdit={openEditModal}
                              onDelete={handleDeleteProduct}
                              lang={lang}
                              t={t}
                              getLocalizedProductName={getLocalizedProductName}
                              getLocalizedProductBrand={getLocalizedProductBrand}
                              getLocalizedProductUnit={getLocalizedProductUnit}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Customer Inquiries */}
                  {adminActiveTab === 'inquiries' && (
                    <div>
                      <div className="admin-analytics-grid">
                        <div className="analytics-card">
                          <span className="analytics-title">{t('admin_stat_total')}</span>
                          <span className="analytics-value">{adminInquiries.length}</span>
                        </div>
                        <div className="analytics-card">
                          <span className="analytics-title">{t('admin_stat_pending')}</span>
                          <span className="analytics-value" style={{ color: 'var(--accent)' }}>
                            {adminInquiries.filter(i => i.status === 'pending').length}
                          </span>
                        </div>
                        <div className="analytics-card">
                          <span className="analytics-title">{t('admin_stat_processed')}</span>
                          <span className="analytics-value" style={{ color: 'var(--success)' }}>
                            {adminInquiries.filter(i => i.status === 'processed').length}
                          </span>
                        </div>
                      </div>

                      <h3 style={{ color: 'white', marginBottom: '20px' }}>{t('admin_title_inq_db')}</h3>
                      <div className="inquiries-list">
                        {adminInquiries.length === 0 ? (
                          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>{t('admin_no_inquiries')}</p>
                        ) : (
                          adminInquiries.map(inq => (
                            <div className="inquiry-card" key={inq._id}>
                              <div className="inquiry-card-header">
                                <div className="inquiry-cust-info">
                                  <h4>{inq.name}</h4>
                                  <p>📞 {t('admin_inq_phone')}: {inq.phone} | {t('admin_inq_submitted')}: {new Date(inq.createdAt || inq.date).toLocaleString('en-IN')}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <span className={`inquiry-status-badge ${inq.status}`}>{inq.status}</span>
                                  <select
                                    value={inq.status}
                                    onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                                    className="calc-select"
                                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                  >
                                    <option value="pending">{t('admin_inq_set_pending')}</option>
                                    <option value="processed">{t('admin_inq_set_processed')}</option>
                                    <option value="cancelled">{t('admin_inq_set_cancelled')}</option>
                                  </select>
                                </div>
                              </div>

                              <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)' }}>"{inq.message}"</p>

                              <table className="inquiry-items-table">
                                <thead>
                                  <tr>
                                    <th>{t('admin_th_material')}</th>
                                    <th>{t('admin_th_unit_price')}</th>
                                    <th style={{ textAlign: 'center' }}>{t('admin_th_qty')}</th>
                                    <th style={{ textAlign: 'right' }}>{t('admin_th_total_cost')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {inq.items.map((item, idx) => {
                                    const localizedItemName = productTranslations[lang]?.[item.product.id]?.name || item.product.name;
                                    const localizedItemBrand = productTranslations[lang]?.[item.product.id]?.brand || item.product.brand;
                                    const localizedItemUnit = getLocalizedProductUnit(item.product.unit);
                                    return (
                                      <tr key={idx}>
                                        <td>{localizedItemName} ({localizedItemBrand})</td>
                                        <td>₹{item.product.price} / {localizedItemUnit}</td>
                                        <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                        <td style={{ textAlign: 'right' }}>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</td>
                                      </tr>
                                    );
                                  })}
                                  <tr style={{ fontWeight: 'bold' }}>
                                    <td colSpan="3" style={{ textAlign: 'right', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>{t('admin_inq_subtotal')}:</td>
                                    <td style={{ textAlign: 'right', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>₹{inq.subtotal.toLocaleString('en-IN')}</td>
                                  </tr>
                                  {inq.discount > 0 && (
                                    <tr style={{ fontWeight: 'bold', color: 'var(--success)' }}>
                                      <td colSpan="3" style={{ textAlign: 'right' }}>Bulk Discount:</td>
                                      <td style={{ textAlign: 'right' }}>- ₹{inq.discount.toLocaleString('en-IN')}</td>
                                    </tr>
                                  )}
                                  {inq.deliveryCharge > 0 && (
                                    <tr style={{ fontWeight: 'bold' }}>
                                      <td colSpan="3" style={{ textAlign: 'right', color: 'var(--accent)' }}>{t('admin_inq_delivery')}:</td>
                                      <td style={{ textAlign: 'right', color: 'var(--accent)' }}>₹{inq.deliveryCharge.toLocaleString('en-IN')}</td>
                                    </tr>
                                  )}
                                  <tr style={{ fontWeight: '800', fontSize: '1rem', color: 'white' }}>
                                    <td colSpan="3" style={{ textAlign: 'right' }}>{t('admin_inq_total_estimate')}:</td>
                                    <td style={{ textAlign: 'right' }}>₹{(inq.totalEstimate || ((inq.subtotal || 0) - (inq.discount || 0) + (inq.deliveryCharge || 0))).toLocaleString('en-IN')}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Price Alert Subscribers */}
                  {adminActiveTab === 'subscribers' && (
                    <div>
                      <h3 style={{ color: 'white', marginBottom: '20px' }}>{t('admin_title_subscribers_db')}</h3>
                      <div className="inquiry-card">
                        <table className="inquiry-items-table">
                          <thead>
                            <tr>
                              <th>{t('inquiry_label_name')}</th>
                              <th>{t('admin_th_email')}</th>
                              <th>{t('admin_th_phone')}</th>
                              <th style={{ textAlign: 'right' }}>{t('admin_th_sub_date')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {adminSubscribers.length === 0 ? (
                              <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>{t('admin_no_subscribers')}</td>
                              </tr>
                            ) : (
                              adminSubscribers.map((sub, idx) => {
                                const notProvidedText = {
                                  en: "Not Provided",
                                  te: "అందించబడలేదు",
                                  hi: "प्रदान नहीं किया गया"
                                };
                                return (
                                  <tr key={idx}>
                                    <td><strong>{sub.name || 'Customer'}</strong></td>
                                    <td>{sub.email || (notProvidedText[lang] || 'Not Provided')}</td>
                                    <td>{sub.phone || (notProvidedText[lang] || 'Not Provided')}</td>
                                    <td style={{ textAlign: 'right' }}>{new Date(sub.createdAt).toLocaleDateString('en-IN')}</td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </section>
        )}

      </main>

      {/* Floating Inquiry Quote Cart Drawer */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingCart size={20} />
            Inquiry Quote Cart
          </div>
          <button className="btn-close-cart" onClick={() => setIsCartOpen(false)}><X size={20} /></button>
        </div>

        <div className="cart-items-wrapper">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">
                <ShoppingCart size={28} />
              </div>
              <p dangerouslySetInnerHTML={{ __html: t('cart_empty_msg') || 'Your cart is empty.<br/>Browse items or use the Material Calculator to get started.' }}></p>
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.product.id}>
                <div className="cart-item-info">
                  <h4 className="cart-item-name">{getLocalizedProductName(item.product)}</h4>
                  <span className="cart-item-brand">{getLocalizedProductBrand(item.product)}</span>
                  <div className="cart-item-price">₹{item.product.price} / {getLocalizedProductUnit(item.product.unit)}</div>
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-control">
                    <button className="qty-btn" onClick={() => updateCartQty(item.product.id, -1)}>-</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateCartQty(item.product.id, 1)}>+</button>
                  </div>
                  <button className="btn-remove-item" onClick={() => removeFromCart(item.product.id)}>{lang === 'te' ? 'తొలగించు' : (lang === 'hi' ? 'हटाएं' : 'Remove')}</button>
                </div>
              </div>
            ))
          )}

          {/* Delivery Estimator box integrated directly inside cart */}
          {cart.length > 0 && (
            <div className="delivery-container">
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                <Truck size={18} style={{ color: 'var(--accent)' }} />
                <h4 style={{ color: 'white', fontSize: '0.95rem' }}>{t('delivery_calculator')}</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{t('delivery_desc')}</p>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t('delivery_label_distance')}</span>
                  <strong style={{ color: 'var(--accent)' }}>{shippingDistance} km</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={shippingDistance}
                  onChange={(e) => setShippingDistance(parseInt(e.target.value))}
                  className="calc-range"
                />
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Total Payload Weight:</span>
                  <span style={{ color: 'white', fontWeight: 600 }}>{(cartTotalWeightKg / 1000).toFixed(2)} Tons</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', color: 'var(--text-muted)' }}>
                  <span>{t('delivery_res_charge')}:</span>
                  {shippingCost === 0 ? (
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>FREE</span>
                  ) : (
                    <span style={{ color: 'white', fontWeight: 600 }}>₹{shippingCost.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.3 }}>
                {t('delivery_note')}
              </p>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>Estimated Subtotal:</span>
              <span className="cart-total" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            {cartDiscount > 0 && (
              <div className="cart-summary-row" style={{ color: 'var(--success)' }}>
                <span>Bulk Discount:</span>
                <span className="cart-total" style={{ fontSize: '1.05rem', color: 'var(--success)' }}>- ₹{cartDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            {shippingCost > 0 && (
              <div className="cart-summary-row">
                <span>Shipping Charge:</span>
                <span className="cart-total" style={{ fontSize: '1.05rem', color: 'var(--accent)' }}>+ ₹{shippingCost.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="cart-summary-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <span>Grand Total:</span>
              <span className="cart-total">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0' }}>*Prices exclude loading / unloading labor. Final charges locked on dispatch.</p>

            <div className="cart-actions">
              <button className="btn btn-primary" onClick={sendWhatsAppQuote} style={{ width: '100%' }}>
                Send Request to WhatsApp 💬
              </button>
              <button className="btn btn-secondary" onClick={() => window.print()} style={{ width: '100%' }}>
                Download PDF Invoice 🖨️
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Cart Launcher Button */}
      <button className="floating-cart-btn" onClick={() => setIsCartOpen(!isCartOpen)} aria-label="Open Quote Cart">
        <ShoppingCart size={24} />
        {cart.length > 0 && (
          <div className="cart-count-badge">{cart.length}</div>
        )}
      </button>

      {/* MODAL WINDOW: Select Broadcast Channel */}
      <div className={`modal-overlay ${isBroadcastModalOpen ? 'open' : ''}`}>
        <div className="modal-content" style={{ maxWidth: '500px', width: '95%' }}>
          <button className="modal-close" onClick={() => { setIsBroadcastModalOpen(false); setBroadcastData(null); }} style={{ zIndex: 10, color: 'white' }}><X size={20} /></button>
          <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={24} style={{ color: 'var(--success)' }} />
            Send Price Alert
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Send today's updated price alert individually to WhatsApp subscribers or broadcast to all email subscribers.
          </p>

          {broadcastData && (
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Products:</span>
                <strong style={{ color: 'white' }}>{products.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Active Subscribers:</span>
                <strong style={{ color: 'var(--success)' }}>{adminSubscribers.length}</strong>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '6px' }}>Message Preview:</span>
                <div style={{
                  background: 'var(--bg-tertiary)',
                  padding: '16px',
                  borderRadius: '6px',
                  fontSize: '0.88rem',
                  color: 'var(--text-main)',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-color)'
                }}>
                  {renderBroadcastPreview()}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {broadcastData && adminSubscribers.filter(s => s.phone).length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                  Send alert via WhatsApp manually:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                  {adminSubscribers.filter(s => s.phone).map((sub, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <span style={{ color: 'white', fontSize: '0.8rem' }}>
                        👤 <strong>{sub.name || 'Customer'}</strong> <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>({sub.phone})</span>
                      </span>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          handleWhatsAppIndividual(sub.phone, getBroadcastMessage(sub.name));
                          triggerBackendAlert();
                        }}
                        style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#25D366', borderColor: '#25D366', color: 'black', width: 'auto', minWidth: 'auto' }}
                      >
                        Send Individual 💬
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              className="btn btn-accent"
              onClick={handleEmailBroadcast}
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
            >
              Send via Email App ✉️ ({adminSubscribers.filter(s => s.email).length} sub)
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => { setIsBroadcastModalOpen(false); setBroadcastData(null); }}
              style={{ width: '100%', marginTop: '4px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* MODAL WINDOW: Daily prices subscription signup */}
      <div className={`modal-overlay ${isAlertModalOpen ? 'open' : ''}`}>
        <div className="modal-content">
          <button className="modal-close" onClick={() => setIsAlertModalOpen(false)}><X size={20} /></button>
          <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '1.4rem' }}>{t('prices_alert_title')}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>{t('prices_alert_desc')}</p>

          <form onSubmit={handleAlertSubscribe}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label htmlFor="subName">{t('inquiry_label_name')}</label>
              <input type="text" className="form-input" id="subName" placeholder={lang === 'te' ? 'ఉదా. రమేష్ కుమార్' : lang === 'hi' ? 'जैसे. रमेश कुमार' : 'e.g. Ramesh Kumar'} value={subName} onChange={(e) => setSubName(e.target.value)} required />
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label htmlFor="subEmail">Email Address</label>
              <input type="email" className="form-input" id="subEmail" placeholder="e.g. name@gmail.com" value={subEmail} onChange={(e) => setSubEmail(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label htmlFor="subPhone">Mobile Number (SMS)</label>
              <input type="tel" className="form-input" id="subPhone" placeholder="e.g. 918639048484" value={subPhone} onChange={(e) => setSubPhone(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Confirm Alert Subscription
            </button>
          </form>
        </div>
      </div>
      {/* MODAL WINDOW: Admin Add New Product */}
      <div className={`modal-overlay ${isAddProductModalOpen ? 'open' : ''}`}>
        <div className="modal-content" style={{ maxWidth: '600px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
          <button className="modal-close" onClick={() => setIsAddProductModalOpen(false)}><X size={20} /></button>
          <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1.4rem' }}>{t('admin_modal_add_title')}</h3>

          <form onSubmit={handleAddProductSubmit}>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label htmlFor="newProdName" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>{t('admin_label_prod_name')}</label>
                <input
                  type="text"
                  className="form-input"
                  id="newProdName"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newProdBrand" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>{t('admin_label_prod_brand')}</label>
                <input
                  type="text"
                  className="form-input"
                  id="newProdBrand"
                  value={newProdBrand}
                  onChange={(e) => setNewProdBrand(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label htmlFor="newProdCategory" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>{t('admin_label_prod_category')}</label>
                <select
                  className="calc-select"
                  id="newProdCategory"
                  value={newProdCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '8px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                >
                  <option value="cement">{t('catalog_btn_cement')}</option>
                  <option value="steel">{t('catalog_btn_steel')}</option>
                  <option value="bricks">{t('catalog_btn_bricks')}</option>
                  <option value="aggregates">{t('catalog_btn_aggregates')}</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="newProdPrice" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>{t('admin_label_prod_price')}</label>
                <input
                  type="number"
                  className="form-input"
                  id="newProdPrice"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  required
                  min="0"
                  step="any"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label htmlFor="newProdUnit" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>{t('admin_label_prod_unit')}</label>
                <select
                  className="calc-select"
                  id="newProdUnit"
                  value={newProdUnit}
                  onChange={(e) => setNewProdUnit(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '8px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                >
                  <option value="bag">bag</option>
                  <option value="ton">ton</option>
                  <option value="piece">piece</option>
                  <option value="brass">brass</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="newProdQty" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>{t('admin_label_prod_qty')}</label>
                <input
                  type="number"
                  className="form-input"
                  id="newProdQty"
                  value={newProdQty}
                  onChange={(e) => setNewProdQty(e.target.value)}
                  required
                  min="0"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>{t('admin_label_prod_image')}</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="file"
                    id="newProdImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="newProdImage"
                    className="btn btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.85rem', cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    {t('admin_btn_upload')}
                  </label>
                  {newProdImagePreview && (
                    <img
                      src={newProdImagePreview}
                      alt="Preview"
                      style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                    />
                  )}
                </div>
              </div>
              <div className="form-group"></div>
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', display: 'block', marginBottom: '12px' }}>
                {t('admin_label_prod_specs')}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {newProdSpecs.map((spec, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Spec Key (e.g. Type)"
                      value={spec.key}
                      onChange={(e) => handleSpecKeyChange(index, e.target.value)}
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Spec Value (e.g. OPC 53)"
                      value={spec.value}
                      onChange={(e) => handleSpecValueChange(index, e.target.value)}
                      style={{ flex: 1.5, padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleRemoveSpec(index)}
                      style={{ padding: '8px', color: 'var(--danger)', borderColor: 'var(--danger-glow)', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddSpec}
                  style={{ width: 'fit-content', padding: '6px 12px', fontSize: '0.8rem', marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={14} /> Add Custom Spec
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsAddProductModalOpen(false)}
              >
                {t('admin_btn_cancel')}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {t('admin_btn_submit')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL WINDOW: Admin Edit Product */}
      <div className={`modal-overlay ${isEditProductModalOpen ? 'open' : ''}`}>
        <div className="modal-content" style={{ maxWidth: '600px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
          <button className="modal-close" onClick={() => { setIsEditProductModalOpen(false); setEditingProduct(null); }}><X size={20} /></button>
          <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1.4rem' }}>{t('admin_modal_edit_title')}</h3>

          <form onSubmit={handleEditProductSubmit}>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label htmlFor="editProdName" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>{t('admin_label_prod_name')}</label>
                <input
                  type="text"
                  className="form-input"
                  id="editProdName"
                  value={editProdName}
                  onChange={(e) => setEditProdName(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editProdBrand" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>{t('admin_label_prod_brand')}</label>
                <input
                  type="text"
                  className="form-input"
                  id="editProdBrand"
                  value={editProdBrand}
                  onChange={(e) => setEditProdBrand(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label htmlFor="editProdCategory" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>{t('admin_label_prod_category')}</label>
                <select
                  className="calc-select"
                  id="editProdCategory"
                  value={editProdCategory}
                  onChange={(e) => handleEditCategoryChange(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '8px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                >
                  <option value="cement">{t('catalog_btn_cement')}</option>
                  <option value="steel">{t('catalog_btn_steel')}</option>
                  <option value="bricks">{t('catalog_btn_bricks')}</option>
                  <option value="aggregates">{t('catalog_btn_aggregates')}</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="editProdPrice" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>{t('admin_label_prod_price')}</label>
                <input
                  type="number"
                  className="form-input"
                  id="editProdPrice"
                  value={editProdPrice}
                  onChange={(e) => setEditProdPrice(e.target.value)}
                  required
                  min="0"
                  step="any"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label htmlFor="editProdUnit" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>{t('admin_label_prod_unit')}</label>
                <select
                  className="calc-select"
                  id="editProdUnit"
                  value={editProdUnit}
                  onChange={(e) => setEditProdUnit(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '8px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                >
                  <option value="bag">bag</option>
                  <option value="ton">ton</option>
                  <option value="piece">piece</option>
                  <option value="brass">brass</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="editProdQty" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>{t('admin_label_prod_qty_edit')}</label>
                <input
                  type="number"
                  className="form-input"
                  id="editProdQty"
                  value={editProdQty}
                  onChange={(e) => setEditProdQty(e.target.value)}
                  required
                  min="0"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>{t('admin_label_prod_image')}</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="file"
                    id="editProdImage"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="editProdImage"
                    className="btn btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.85rem', cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    {t('admin_btn_upload')}
                  </label>
                  {editProdImagePreview && (
                    <img
                      src={editProdImagePreview}
                      alt="Preview"
                      style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                    />
                  )}
                </div>
              </div>
              <div className="form-group"></div>
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', display: 'block', marginBottom: '12px' }}>
                {t('admin_label_prod_specs')}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {editProdSpecs.map((spec, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Spec Key (e.g. Type)"
                      value={spec.key}
                      onChange={(e) => handleEditSpecKeyChange(index, e.target.value)}
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Spec Value (e.g. OPC 53)"
                      value={spec.value}
                      onChange={(e) => handleEditSpecValueChange(index, e.target.value)}
                      style={{ flex: 1.5, padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleEditRemoveSpec(index)}
                      style={{ padding: '8px', color: 'var(--danger)', borderColor: 'var(--danger-glow)', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleEditAddSpec}
                  style={{ width: 'fit-content', padding: '6px 12px', fontSize: '0.8rem', marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={14} /> Add Custom Spec
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setIsEditProductModalOpen(false); setEditingProduct(null); }}
              >
                {t('admin_btn_cancel')}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {t('admin_btn_edit_submit')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Premium Elegant Footer */}
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <div className="logo-group">
              <div className="logo-icon">VT</div>
              <span className="logo-text" style={{ background: 'none', WebkitTextFillColor: 'initial', color: 'white' }}>VIGNESHWARA <span className="serif-italic" style={{ color: 'var(--accent)' }}>Traders</span></span>
            </div>
            <p>{t('footer_desc')}</p>
          </div>

          <div className="footer-col">
            <h4>{t('footer_contact_header')}</h4>
            <ul className="footer-links" style={{ gap: '8px' }}>
              <li style={{ color: 'white', fontWeight: 600 }}>{t('footer_manager')}</li>
              <li><a href="tel:+918639048484" className="footer-link">📞 Call: +91 86390 48484</a></li>
              <li><a href="https://wa.me/918639048484" className="footer-link" target="_blank" rel="noopener noreferrer">💬 WhatsApp: +91 86390 48484</a></li>
              <li><a href="mailto:mallesh.dln@gmail.com" className="footer-link" style={{ textTransform: 'none', wordBreak: 'break-all' }}>✉️ Email: mallesh.dln@gmail.com</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('footer_nav_header')}</h4>
            <ul className="footer-links">
              <li><span className="footer-link" onClick={() => navigateToPage('landing')}>{t('nav_home')}</span></li>
              <li><span className="footer-link" onClick={() => navigateToPage('prices')}>{t('nav_prices')}</span></li>
              <li><span className="footer-link" onClick={() => navigateToPage('calculator')}>{t('nav_calculator')}</span></li>
              <li><span className="footer-link" onClick={() => navigateToPage('products')}>{t('nav_products')}</span></li>
              <li><span className="footer-link" onClick={() => navigateToPage('landing', 'contact')}>{t('nav_details')}</span></li>
            </ul>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© 2026 Vigneshwara Traders. All Rights Reserved.</span>
          <span>Designed with High Visibility, Transparent Pricing & Automated Estimations.</span>
        </div>
      </footer>

      {/* Printable Invoice Sheet */}
      <div className="print-invoice-sheet">
        <div className="invoice-watermark">{companyNames[lang] || companyNames['en']}</div>
        <div className="invoice-header">
          <div className="invoice-header-left">
            <h1 className="invoice-company-name">{companyNames[lang] || companyNames['en']}</h1>
            <p className="invoice-company-sub">Hyderabad Rd, Kalwakurthy, Telangana 509324</p>
            <p className="invoice-company-contact">📞 +91 86390 48484 | ✉️ mallesh.dln@gmail.com</p>
          </div>
          <div className="invoice-header-right">
            <h2 className="invoice-title">{invoiceTitles[lang] || invoiceTitles['en']}</h2>
            <p className="invoice-meta"><strong>{dateLabels[lang] || dateLabels['en']}:</strong> {new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>{t('admin_th_material')}</th>
              <th>{brandLabelsInvoice[lang] || 'Brand'}</th>
              <th>{calcDetailsLabels[lang] || 'Calculation'}</th>
              <th style={{ textAlign: 'right' }}>{t('admin_th_total_cost')}</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, idx) => (
              <tr key={idx}>
                <td>{getLocalizedProductName(item.product)}</td>
                <td>{getLocalizedProductBrand(item.product)}</td>
                <td>
                  ₹{item.product.price} / {getLocalizedProductUnit(item.product.unit)} × {item.quantity} {getLocalizedProductUnit(item.product.unit)}
                </td>
                <td style={{ textAlign: 'right' }}>
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-summary">
          <div className="invoice-summary-row">
            <span>{subtotalLabels[lang] || 'Subtotal'}:</span>
            <strong>₹{cartSubtotal.toLocaleString('en-IN')}</strong>
          </div>
          {cartDiscount > 0 && (
            <div className="invoice-summary-row" style={{ color: '#10b981' }}>
              <span>Bulk Discount:</span>
              <strong>- ₹{cartDiscount.toLocaleString('en-IN')}</strong>
            </div>
          )}
          <div className="invoice-summary-row">
            <span>{deliveryLabelsInvoice[lang] || 'Delivery Charge'}:</span>
            <strong>
              {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toLocaleString('en-IN')}`}
            </strong>
          </div>
          <div className="invoice-summary-row grand-total">
            <span>{grandTotalLabels[lang] || 'Grand Total'}:</span>
            <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <div className="invoice-footer">
          <p className="invoice-note">{noteLabels[lang] || noteLabels['en']}</p>
          <p className="invoice-thank-you">Thank you for choosing {companyNames[lang] || companyNames['en']}!</p>
        </div>
      </div>
    </div>
  );
}

// Inner Component for managing Admin Price fields local state
function AdminPriceRow({ product, onSave, onEdit, onDelete, lang, t, getLocalizedProductName, getLocalizedProductBrand, getLocalizedProductUnit }) {
  const [price, setPrice] = useState(product.price);
  const [change, setChange] = useState(product.change);
  const [changeAmount, setChangeAmount] = useState(product.changeAmount);

  const brandLabels = {
    en: "Brand",
    te: "బ్రాండ్",
    hi: "ब्रांड"
  };
  const unitLabels = {
    en: "Unit",
    te: "యూనిట్",
    hi: "इकाई"
  };

  return (
    <div className="admin-price-row">
      <div style={{ flex: 2 }}>
        <strong style={{ color: 'white', fontSize: '0.95rem' }}>{getLocalizedProductName(product)}</strong><br />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          {brandLabels[lang] || 'Brand'}: {getLocalizedProductBrand(product)} | {unitLabels[lang] || 'Unit'}: {getLocalizedProductUnit(product.unit)} | {t('admin_th_qty') || 'Quantity'}: {product.quantity || 0}
        </span>
      </div>
      <div style={{ flex: 1.2, marginRight: '10px' }}>
        <input
          className="admin-price-input"
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ flex: 1.2, marginRight: '10px' }}>
        <select
          className="calc-select"
          value={change}
          onChange={(e) => setChange(e.target.value)}
          style={{ padding: '6px', fontSize: '0.8rem', width: '100%' }}
        >
          <option value="up">🔺 {lang === 'te' ? 'పెరిగింది' : (lang === 'hi' ? 'बढ़ी' : 'Up')}</option>
          <option value="down">🔻 {lang === 'te' ? 'తగ్గింది' : (lang === 'hi' ? 'घटी' : 'Down')}</option>
          <option value="stable">➖ {lang === 'te' ? 'స్థిరంగా ఉంది' : (lang === 'hi' ? 'स्थिर' : 'Stable')}</option>
        </select>
      </div>
      <div style={{ flex: 1, marginRight: '10px' }}>
        <input
          className="admin-price-input"
          type="number"
          value={changeAmount}
          onChange={(e) => setChangeAmount(parseFloat(e.target.value) || 0)}
          style={{ width: '100%' }}
          placeholder="Amt"
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          className="btn btn-primary"
          onClick={() => onSave(product.id, price, change, changeAmount)}
          style={{ padding: '8px 16px', fontSize: '0.8rem' }}
        >
          {t('admin_btn_save')}
        </button>
        
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onEdit(product)}
          style={{ padding: '8px', color: 'var(--accent)', borderColor: 'var(--accent-glow)', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', marginLeft: '8px' }}
          title="Edit Details"
        >
          <Edit size={16} />
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onDelete(product.id)}
          style={{ padding: '8px', color: 'var(--danger)', borderColor: 'var(--danger-glow)', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', marginLeft: '8px' }}
          title={t('admin_btn_delete')}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
