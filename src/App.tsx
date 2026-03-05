import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  Calendar, 
  TrendingUp, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Menu,
  X,
  ChevronRight,
  Star,
  LayoutDashboard,
  Package,
  CreditCard,
  Users,
  Mail,
  Smartphone,
  Bell,
  Info,
  ArrowRight,
  ShieldCheck,
  Zap,
  Leaf,
  Heart,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SHOP_LAT = 6.1375; // Lomé central
const SHOP_LNG = 1.2125;

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

// --- Types ---
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface User {
  id: number;
  nom: string;
  whatsapp: string;
  is_admin: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// --- Contexts ---
const AuthContext = createContext<AuthContextType | null>(null);
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const CartContext = createContext<{
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  total: number;
} | null>(null);

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

// --- Components ---

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-secondary font-bold text-xl">SG</div>
            <span className="text-xl font-bold text-primary tracking-tight">SODJA GATE</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary font-medium">Accueil</Link>
            <Link to="/reservations" className="text-gray-600 hover:text-primary font-medium">Réservations</Link>
            <Link to="/investir" className="text-gray-600 hover:text-primary font-medium">Investir</Link>
            <Link to="/suggestions" className="text-gray-600 hover:text-primary font-medium">Suggestions</Link>
            {user?.is_admin === 1 && (
              <Link to="/admin" className="text-primary font-bold flex items-center gap-1">
                <LayoutDashboard size={18} /> Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/panier" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-secondary text-primary text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline text-sm font-medium text-gray-700">Salut, {user.nom.split(' ')[0]}</span>
                <button onClick={logout} className="p-2 text-gray-400 hover:text-accent transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary text-sm px-4 py-2">Connexion</Link>
            )}
            <button className="md:hidden p-2 text-gray-600" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">Accueil</Link>
              <Link to="/reservations" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">Réservations</Link>
              <Link to="/investir" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">Investir</Link>
              <Link to="/suggestions" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">Suggestions</Link>
              {user?.is_admin === 1 && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-primary font-bold">Admin Dashboard</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-secondary font-bold text-xl">SG</div>
            <span className="text-xl font-bold text-primary tracking-tight">SODJA GATE</span>
          </div>
          <p className="text-gray-500 max-w-sm leading-relaxed">
            SODJA GATE est votre partenaire de confiance au Togo pour des produits alimentaires de qualité à base de soja. 
            Nous innovons pour votre santé et votre bien-être.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-6">Navigation</h4>
          <ul className="space-y-4 text-gray-500">
            <li><Link to="/" className="hover:text-primary transition-colors">Accueil</Link></li>
            <li><Link to="/reservations" className="hover:text-primary transition-colors">Réservations</Link></li>
            <li><Link to="/investir" className="hover:text-primary transition-colors">Investir</Link></li>
            <li><Link to="/suggestions" className="hover:text-primary transition-colors">Suggestions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-6">Contact</h4>
          <ul className="space-y-4 text-gray-500">
            <li>Lomé, Togo</li>
            <li>WhatsApp: +228 71 00 05 88</li>
            <li>Email: contact@sodjagate.tg</li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-gray-200 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} SODJA GATE. Tous droits réservés.
      </div>
    </div>
  </footer>
);

// --- Pages ---

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 md:py-24">
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white leading-tight mb-6"
          >
            Le meilleur du <span className="text-secondary">Soja</span> au Togo.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg mb-8"
          >
            Découvrez nos produits sains, savoureux et 100% locaux. 
            De la ferme à votre table, avec amour.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <a href="#produits" className="btn btn-secondary inline-flex items-center gap-2">
              Commander maintenant <ChevronRight size={20} />
            </a>
          </motion.div>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/10 -skew-x-12 translate-x-1/4" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-secondary rounded-full blur-3xl opacity-20" />
      </section>

      {/* Products Section */}
      <section id="produits" className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Nos Produits</h2>
            <p className="text-gray-500">Qualité premium, goût authentique.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[4/3] rounded-2xl mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="card group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-primary font-bold shadow-sm text-xs">
                    {product.name.toLowerCase().includes('soja') && !product.name.toLowerCase().includes('céréale') && !product.name.toLowerCase().includes('lait') ? 'À partir de ' : ''}{product.price} FCFA
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2">{product.description}</p>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full btn btn-primary flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Ajouter au panier
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Why Us Section */}
      <section className="bg-gray-50 rounded-3xl p-12 md:p-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Pourquoi choisir SODJA GATE ?</h2>
          <p className="text-gray-500">Nous nous engageons pour la qualité et votre santé.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: <CheckCircle className="text-primary" />, title: "100% Naturel", desc: "Sans conservateurs chimiques, juste du soja pur." },
            { icon: <Star className="text-secondary" />, title: "Goût Unique", desc: "Une recette traditionnelle revisitée pour vous plaire." },
            { icon: <TrendingUp className="text-accent" />, title: "Local & Durable", desc: "Soutien direct aux agriculteurs togolais." }
          ].map((feature, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                {React.cloneElement(feature.icon as React.ReactElement<{ size: number }>, { size: 32 })}
              </div>
              <h4 className="font-bold text-xl mb-3">{feature.title}</h4>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'T-Money' | 'Livraison'>('T-Money');
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);

  const calculateDelivery = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const dist = getDistance(
          SHOP_LAT, SHOP_LNG,
          latitude, longitude
        );
        const fee = Math.round(dist * 75);
        setDistance(dist);
        setDeliveryFee(fee);
        setCoords({ lat: latitude, lng: longitude });
        setLocating(false);
      },
      (error) => {
        console.error(error);
        alert("Impossible d'obtenir votre position. Veuillez vérifier vos permissions.");
        setLocating(false);
      }
    );
  };

  const finalTotal = total + (deliveryFee || 0);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          total_amount: finalTotal,
          delivery_fee: deliveryFee || 0,
          user_lat: coords?.lat,
          user_lng: coords?.lng,
          payment_method: paymentMethod === 'T-Money' ? 'T-Money (+228 71000588)' : 'Paiement à la livraison'
        })
      });
      
      if (res.ok) {
        setSuccess(true);
        clearCart();
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de la commande.");
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur réseau est survenue.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-green-600">Commande Réussie !</h2>
        <p className="text-gray-700 font-medium mb-4">Merci pour votre confiance. Votre commande est en cours de préparation.</p>
        
        {paymentMethod === 'T-Money' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
            <p className="font-bold mb-1">Action requise :</p>
            <p>Veuillez effectuer le transfert T-Money de <strong>{finalTotal} FCFA</strong> sur le numéro <strong>+228 71 00 05 88</strong> pour valider votre commande.</p>
          </div>
        )}

        <p className="text-gray-500 mb-8">
          Nous vous contacterons par WhatsApp dans moins de 3 min pour la livraison de votre commande.
        </p>
        <div className="flex flex-col gap-4">
          <a 
            href={`https://wa.me/22871000588?text=Bonjour SODJA GATE, je viens de passer une commande de ${finalTotal} FCFA (${paymentMethod === 'T-Money' ? 'Payé par T-Money' : 'Paiement à la livraison'}). Mon numéro est ${user?.whatsapp}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn bg-[#25D366] text-white hover:bg-[#128C7E] flex items-center justify-center gap-2"
          >
            <MessageSquare size={20} />
            Confirmer via WhatsApp
          </a>
          <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
        <p className="text-gray-500 mb-8">Il semble que vous n'ayez pas encore ajouté de produits.</p>
        <Link to="/" className="btn btn-primary">Découvrir nos produits</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-12">Votre Panier</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-6 p-4 bg-white rounded-2xl border border-gray-100">
              <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded-xl" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-primary font-bold">{item.price} FCFA</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold w-6 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-gray-400 hover:text-accent"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="card p-8 sticky top-24">
            <h3 className="text-xl font-bold mb-6">Résumé</h3>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Mode de paiement</label>
              <div className="space-y-2">
                <button 
                  onClick={() => setPaymentMethod('T-Money')}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between",
                    paymentMethod === 'T-Money' ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-gray-200 hover:border-primary/50"
                  )}
                >
                  <span className="text-sm font-medium">T-Money (+228 71000588)</span>
                  {paymentMethod === 'T-Money' && <CheckCircle size={16} className="text-primary" />}
                </button>
                <button 
                  onClick={() => setPaymentMethod('Livraison')}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between",
                    paymentMethod === 'Livraison' ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-gray-200 hover:border-primary/50"
                  )}
                >
                  <span className="text-sm font-medium">Paiement à la livraison</span>
                  {paymentMethod === 'Livraison' && <CheckCircle size={16} className="text-primary" />}
                </button>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500">
                <span>Sous-total</span>
                <span>{total} FCFA</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-gray-500">
                  <span>Livraison</span>
                  {deliveryFee !== null ? (
                    <span className="text-primary font-bold">{deliveryFee} FCFA</span>
                  ) : (
                    <span className="text-amber-600 font-medium italic">À calculer</span>
                  )}
                </div>
                {deliveryFee === null && (
                  <button 
                    onClick={calculateDelivery}
                    disabled={locating}
                    className="text-[10px] text-primary hover:underline flex items-center gap-1"
                  >
                    {locating ? <Clock size={10} className="animate-spin" /> : <Smartphone size={10} />}
                    Calculer selon ma position (75 CFA/km)
                  </button>
                )}
                {coords && (
                  <div className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
                    <ShieldCheck size={10} /> Position capturée
                  </div>
                )}
                {distance !== null && (
                  <p className="text-[10px] text-gray-400">
                    Distance estimée : {distance.toFixed(1)} km
                  </p>
                )}
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between font-bold text-xl">
                <span>Total</span>
                <div className="text-right">
                  <span className="text-primary block">{finalTotal} FCFA</span>
                  {deliveryFee === null && <span className="text-[10px] text-gray-400 font-normal">+ frais de livraison</span>}
                </div>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full btn btn-primary py-4 flex items-center justify-center gap-2"
            >
              {loading ? <Clock className="animate-spin" /> : <ShoppingBag size={20} />}
              Confirmer la commande
            </button>
            <p className="mt-4 text-center text-[10px] text-gray-400">
              En confirmant, vous acceptez que les frais de livraison soient calculés lors de l'appel de confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Auth = ({ type }: { type: 'login' | 'register' }) => {
  const [formData, setFormData] = useState({ nom: '', whatsapp: '', quartier: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (type === 'register' && formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        if (type === 'login') {
          login(data.token, data.user);
          navigate('/');
        } else {
          navigate('/verify', { state: { whatsapp: formData.whatsapp, emailSent: data.emailSent, testCode: data.testCode } });
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="card p-8">
        <h2 className="text-3xl font-bold mb-2 text-center text-primary">
          {type === 'login' ? 'Bon retour !' : 'Rejoignez-nous'}
        </h2>
        <p className="text-gray-500 text-center mb-8">
          {type === 'login' ? 'Connectez-vous à votre compte SODJA GATE' : 'Créez votre compte en quelques secondes'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Ex: Jean Dupont"
                  value={formData.nom}
                  onChange={e => setFormData({ ...formData, nom: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Votre Quartier</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Ex: Agoè, Adidogomé..."
                  value={formData.quartier}
                  onChange={e => setFormData({ ...formData, quartier: e.target.value })}
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro WhatsApp</label>
            <input 
              type="tel" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="Ex: +228 00 00 00 00"
              value={formData.whatsapp}
              onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
            />
          </div>
          {type === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (Obligatoire pour vérification)</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Ex: jean@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          {type === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn btn-primary py-4 mt-4"
          >
            {loading ? 'Chargement...' : type === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            {type === 'login' ? "Pas encore de compte ?" : "Déjà un compte ?"}
            <Link to={type === 'login' ? '/register' : '/login'} className="ml-2 text-primary font-bold hover:underline">
              {type === 'login' ? "S'inscrire" : "Se connecter"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const Verification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const whatsapp = location.state?.whatsapp;
  const emailSent = location.state?.emailSent;
  const initialTestCode = location.state?.testCode;
  const [testCode, setTestCode] = useState(initialTestCode || '');

  useEffect(() => {
    if (!whatsapp) {
      navigate('/register');
    }
    if (emailSent === false && !testCode) {
      setError("L'envoi de l'email a échoué. Veuillez vérifier vos paramètres SMTP.");
    }
  }, [whatsapp, emailSent, testCode, navigate]);

  if (!whatsapp) return null;

  const handleResend = async () => {
    setLoading(true);
    setError('');
    setInfo('');
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp })
      });
      const data = await res.json();
      if (res.ok) {
        setInfo(data.message);
        if (data.testCode) setTestCode(data.testCode);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp, otp_code: otp })
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/login');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Vérification par Email</h2>
        <p className="text-gray-500 mb-8">
          Nous avons envoyé un code de vérification à votre adresse email. Veuillez vérifier votre boîte de réception (et vos spams).
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        {info && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-600 rounded-xl text-sm">
            {info}
          </div>
        )}

        {testCode && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-center">
            <p className="text-xs uppercase font-bold mb-1 opacity-70">Code de test (Email échoué)</p>
            <p className="text-3xl font-mono tracking-widest font-bold">{testCode}</p>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <input 
            type="text" 
            maxLength={6}
            required
            className="w-full text-center text-3xl tracking-[1em] font-bold py-4 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            placeholder="000000"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn btn-primary py-4"
          >
            {loading ? 'Vérification...' : 'Vérifier le compte'}
          </button>
        </form>
        <button 
          onClick={handleResend}
          disabled={loading}
          className="mt-6 text-sm text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
        >
          Renvoyer le code
        </button>
      </div>
    </div>
  );
};

const Reservations = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ product_name: '', quantity: 1, date: '', time: '', location: '', comment: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Réservation Reçue !</h2>
        <p className="text-gray-500 mb-8">Nous vous contacterons bientôt pour confirmer votre réservation.</p>
        <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Réserver pour un événement</h1>
        <p className="text-gray-500">Mariages, anniversaires ou réunions, nous nous occupons de tout.</p>
      </div>
      <div className="card p-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Produit souhaité</label>
            <select 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary"
              value={formData.product_name}
              onChange={e => setFormData({ ...formData, product_name: e.target.value })}
            >
              <option value="">Sélectionnez un produit</option>
              <option value="Soja simple">Soja simple</option>
              <option value="Soja + Spaghetti">Soja + Spaghetti</option>
              <option value="Soja + Spaghetti + Saucisses">Soja + Spaghetti + Saucisses</option>
              <option value="Céréale de soja">Céréale de soja</option>
              <option value="Grain de soja">Grain de soja</option>
              <option value="Lait de soja">Lait de soja</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
            <input 
              type="number" 
              min="1"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary"
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
            <input 
              type="time" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary"
              value={formData.time}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de livraison</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary"
              placeholder="Ex: Quartier Adidogomé"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaires particuliers</label>
            <textarea 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary h-32"
              placeholder="Précisez vos besoins..."
              value={formData.comment}
              onChange={e => setFormData({ ...formData, comment: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={loading} className="w-full btn btn-primary py-4">
              {loading ? 'Envoi...' : 'Confirmer la réservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Investment = () => {
  const [formData, setFormData] = useState({ name: '', whatsapp: '', email: '', amount: 0, shares: 0, motivation: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <TrendingUp size={48} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Demande Envoyée !</h2>
        <p className="text-gray-500 mb-8">Votre demande d'achat d'actions est en cours d'étude par notre équipe financière.</p>
        <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Opportunité</span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Investissez dans l'avenir de <span className="text-primary">SODJA GATE</span>.</h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Devenez actionnaire d'une entreprise en pleine croissance au Togo. 
            Participez à la révolution alimentaire locale et bénéficiez de notre succès.
          </p>
          <div className="space-y-4">
            {[
              "Dividendes annuels garantis",
              "Participation aux décisions stratégiques",
              "Soutien à l'économie locale togolaise"
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-primary">
                  <CheckCircle size={14} />
                </div>
                <span className="font-medium text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input 
                  type="tel" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary"
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant (FCFA)</label>
                <input 
                  type="number" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'actions</label>
                <input 
                  type="number" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary"
                  value={formData.shares}
                  onChange={e => setFormData({ ...formData, shares: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pourquoi investir ?</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary h-24"
                value={formData.motivation}
                onChange={e => setFormData({ ...formData, motivation: e.target.value })}
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn btn-primary py-4">
              {loading ? 'Envoi...' : "Soumettre ma demande d'achat"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Suggestions = () => {
  const [formData, setFormData] = useState({ name: '', whatsapp: '', message: '', rating: 5 });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare size={48} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Merci !</h2>
        <p className="text-gray-500 mb-8">Vos suggestions nous aident à nous améliorer chaque jour.</p>
        <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Votre avis compte</h1>
        <p className="text-gray-500">Aidez-nous à mieux vous servir.</p>
      </div>
      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Votre Nom</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input 
                type="tel" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary"
                value={formData.whatsapp}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note (1 à 5)</label>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                    formData.rating >= star ? "bg-secondary text-primary" : "bg-gray-100 text-gray-400"
                  )}
                >
                  <Star fill={formData.rating >= star ? "currentColor" : "none"} size={24} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Votre Message</label>
            <textarea 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary h-40"
              placeholder="Dites-nous ce que vous en pensez..."
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
          <button type="submit" disabled={loading} className="w-full btn btn-primary py-4">
            {loading ? 'Envoi...' : 'Envoyer ma suggestion'}
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'investments' | 'suggestions'>('orders');
  const [notification, setNotification] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const [sRes, oRes, rRes, iRes, suRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/reservations', { headers }),
        fetch('/api/admin/investments', { headers }),
        fetch('/api/admin/suggestions', { headers })
      ]);
      
      setStats(await sRes.json());
      setOrders(await oRes.json());
      setReservations(await rRes.json());
      setInvestments(await iRes.json());
      setSuggestions(await suRes.json());
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      let message = "";
      
      switch (data.type) {
        case 'NEW_ORDER':
          message = `Nouvelle commande #${data.orderId} de ${data.user} (${data.quartier || 'Quartier non précisé'}) - ${data.total} FCFA`;
          break;
        case 'NEW_RESERVATION':
          message = `Nouvelle réservation de ${data.user} pour ${data.product}`;
          break;
        case 'NEW_SUGGESTION':
          message = `Nouvelle suggestion de ${data.user}`;
          break;
        case 'NEW_INVESTMENT':
          message = `Nouvelle demande d'investissement de ${data.user} (${data.amount} FCFA)`;
          break;
      }

      if (message) {
        setNotification(message);
        fetchData();
        
        // Play notification sound
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log("Audio playback blocked by browser", e));

        // Clear notification after 10 seconds
        setTimeout(() => setNotification(null), 10000);
      }
    };

    return () => ws.close();
  }, [fetchData]);

  const updateStatus = async (type: string, id: number, status: string) => {
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    await fetch(`/api/admin/${type}/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status })
    });
    // Refresh data
    fetchData();
  };

  return (
    <div className="py-8 space-y-8 relative">
      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-24 right-4 z-50 bg-primary text-white p-4 rounded-2xl shadow-2xl border-4 border-white flex items-center gap-4 max-w-sm animate-bounce"
        >
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <Bell size={20} />
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-wider">Alerte Immédiate</p>
            <p className="text-xs font-medium opacity-90">{notification}</p>
          </div>
          <button onClick={() => setNotification(null)} className="ml-2 opacity-50 hover:opacity-100">
            <X size={16} />
          </button>
        </motion.div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de Bord Admin</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Utilisateurs", value: stats.users, icon: <Users className="text-blue-500" /> },
          { label: "Commandes", value: stats.orders, icon: <ShoppingBag className="text-primary" /> },
          { label: "Revenu Total", value: `${stats.revenue} FCFA`, icon: <TrendingUp className="text-green-500" /> }
        ].map((stat, i) => (
          <div key={i} className="card p-6 flex items-center gap-6">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
              {React.cloneElement(stat.icon as React.ReactElement<{ size: number }>, { size: 28 })}
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'orders', label: 'Commandes', icon: <ShoppingBag size={18} /> },
          { id: 'reservations', label: 'Réservations', icon: <Calendar size={18} /> },
          { id: 'investments', label: 'Investissements', icon: <TrendingUp size={18} /> },
          { id: 'suggestions', label: 'Suggestions', icon: <MessageSquare size={18} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-6 py-4 flex items-center gap-2 font-bold transition-all border-b-2",
              activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="card overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Client / Quartier</th>
              <th className="px-6 py-4">Total & Paiement</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activeTab === 'orders' && orders.map(order => (
              <tr key={order.id}>
                <td className="px-6 py-4">
                  <div className="font-bold">{order.user_name}</div>
                  <div className="text-xs text-primary font-medium">{order.user_quartier || 'N/A'}</div>
                  <div className="text-xs text-gray-400">{order.user_whatsapp}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-primary">{order.total_amount} FCFA</div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">{order.payment_method}</div>
                  {order.delivery_fee > 0 && (
                    <div className="text-[10px] text-amber-600 font-medium italic">Livraison: {order.delivery_fee} FCFA</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    order.status === 'Confirmé' ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                  )}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <select 
                      className="text-sm border rounded p-1"
                      onChange={(e) => updateStatus('orders', order.id, e.target.value)}
                      value={order.status}
                    >
                      <option value="En attente">En attente</option>
                      <option value="Confirmé">Confirmé</option>
                      <option value="Annulé">Annulé</option>
                    </select>
                    <a 
                      href={`https://wa.me/${order.user_whatsapp.replace(/\+/g, '')}?text=Bonjour ${order.user_name}, c'est SODJA GATE concernant votre commande de ${order.total_amount} FCFA.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Contacter via WhatsApp"
                    >
                      <MessageSquare size={16} />
                    </a>
                    {order.user_lat && order.user_lng && (
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&origin=${SHOP_LAT},${SHOP_LNG}&destination=${order.user_lat},${order.user_lng}&travelmode=driving`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Voir l'itinéraire de livraison"
                      >
                        <ArrowRight size={16} />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {activeTab === 'reservations' && reservations.map(res => (
              <tr key={res.id}>
                <td className="px-6 py-4">
                  <div className="font-bold">{res.user_name}</div>
                  <div className="text-xs text-gray-400">{res.user_whatsapp}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium">{res.product_name}</div>
                  <div className="text-xs text-gray-400">Qté: {res.quantity} | {res.location}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{res.date} à {res.time}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600">
                    {res.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <select 
                      className="text-sm border rounded p-1"
                      onChange={(e) => updateStatus('reservations', res.id, e.target.value)}
                      value={res.status}
                    >
                      <option value="En attente">En attente</option>
                      <option value="Confirmée">Confirmée</option>
                      <option value="Annulée">Annulée</option>
                    </select>
                    <a 
                      href={`https://wa.me/${res.user_whatsapp.replace(/\+/g, '')}?text=Bonjour ${res.user_name}, c'est SODJA GATE concernant votre réservation de ${res.product_name} le ${res.date}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Contacter via WhatsApp"
                    >
                      <MessageSquare size={16} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {activeTab === 'investments' && investments.map(inv => (
              <tr key={inv.id}>
                <td className="px-6 py-4">
                  <div className="font-bold">{inv.name}</div>
                  <div className="text-xs text-gray-400">{inv.whatsapp}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium">{inv.amount} FCFA</div>
                  <div className="text-xs text-gray-400">{inv.shares} actions</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-600">
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <select 
                      className="text-sm border rounded p-1"
                      onChange={(e) => updateStatus('investments', inv.id, e.target.value)}
                      value={inv.status}
                    >
                      <option value="En étude">En étude</option>
                      <option value="Accepté">Accepté</option>
                      <option value="Refusé">Refusé</option>
                    </select>
                    <a 
                      href={`https://wa.me/${inv.whatsapp.replace(/\+/g, '')}?text=Bonjour ${inv.name}, c'est SODJA GATE concernant votre demande d'investissement.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Contacter via WhatsApp"
                    >
                      <MessageSquare size={16} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {activeTab === 'suggestions' && suggestions.map(sug => (
              <tr key={sug.id}>
                <td className="px-6 py-4">
                  <div className="font-bold">{sug.name}</div>
                  <div className="text-xs text-gray-400">{sug.whatsapp}</div>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <div className="text-sm truncate">{sug.message}</div>
                  <div className="flex text-secondary mt-1">
                    {[...Array(sug.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500" colSpan={3}>{new Date(sug.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main App Wrapper ---

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/login" element={<Auth type="login" />} />
            <Route path="/register" element={<Auth type="register" />} />
            <Route path="/verify" element={<Verification />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/investir" element={<Investment />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const login = (token: string, user: User) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
        <Router>
          <AppContent />
        </Router>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}
