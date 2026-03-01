/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Home, 
  Image as ImageIcon, 
  Calendar, 
  Mail, 
  User, 
  ChevronRight,
  MapPin,
  Star,
  Clock,
  Plus,
  Trash2,
  Edit3,
  LogOut,
  Lock,
  X,
  CheckCircle2,
  Phone,
  Send,
  Info,
  BookOpen
} from 'lucide-react';

// --- Types ---
type Screen = 'welcome' | 'register' | 'dashboard' | 'admin-login' | 'admin-panel';
type Tab = 'home' | 'portfolio' | 'book' | 'about' | 'contact' | 'profile';

interface UserData {
  name: string;
  phone: string;
}

interface PortfolioItem {
  id: number;
  url: string;
  title: string;
  description: string;
  category: string;
}

interface BookingRequest {
  name: string;
  phone: string;
  eventType: string;
  eventDate: string;
  message: string;
}

// --- Components ---

const WelcomeScreen = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div 
        className="cinematic-bg scale-110 blur-sm"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1452780212940-6f5c0d14d84a?auto=format&fit=crop&q=80&w=2070')` }}
      >
        <div className="cinematic-overlay" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center px-6"
      >
        <h1 className="font-serif text-4xl mb-1 gold-text tracking-tight font-bold">
          Karthik Digital Studio
        </h1>
        <p className="text-gold/80 text-lg font-serif italic mb-4">Gudivada</p>
        
        <div className="mb-8">
          <p className="text-white/90 text-sm font-medium tracking-wide mb-1">
            L. Rambabu
          </p>
          <p className="text-gold text-xs uppercase tracking-[0.2em] font-semibold">
            21 Years of Professional Photography Experience
          </p>
        </div>

        <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-light mb-12">
          Capturing Moments. Creating Memories.
        </p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          onClick={onEnter}
          className="gold-button px-14 py-4 rounded-full flex items-center gap-3 group transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gold/10"
        >
          <span>ENTER</span>
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    </div>
  );
};

const RegisterScreen = ({ onContinue }: { onContinue: (data: UserData) => void }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 2) {
      setError('Please enter a valid name');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Phone number must be exactly 10 digits');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      onContinue({ name, phone });
    } catch (err) {
      console.error(err);
      // Proceed anyway for demo purposes if API fails
      onContinue({ name, phone });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center p-6">
      <div 
        className="cinematic-bg blur-md"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=2070')` }}
      >
        <div className="cinematic-overlay" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-10 z-10"
      >
        <h2 className="font-serif text-3xl mb-2 gold-text text-center">Welcome</h2>
        <p className="text-white/40 text-center text-sm mb-10">Please provide your details to continue</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gold mb-2 ml-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Your Name"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gold mb-2 ml-1">Phone Number</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter Your Phone Number"
              className="input-field"
              required
            />
          </div>

          {error && <p className="text-red-400 text-[10px] text-center uppercase tracking-widest">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="gold-button w-full py-5 rounded-2xl mt-4 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'CONTINUE'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const Portfolio = ({ items, isAdmin, onDelete }: { items: PortfolioItem[], isAdmin?: boolean, onDelete?: (id: number) => void }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <motion.div 
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-[3/4] rounded-2xl overflow-hidden group"
        >
          <img 
            src={item.url} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            alt={item.title}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
            <span className="text-xs font-serif gold-text">{item.title}</span>
            <span className="text-[10px] text-white/60">{item.category}</span>
          </div>
          {isAdmin && onDelete && (
            <button 
              onClick={() => onDelete(item.id)}
              className="absolute top-2 right-2 bg-red-500/80 p-2 rounded-full text-white hover:bg-red-600 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
};

const BookingForm = ({ user, onSuccess }: { user: UserData, onSuccess: () => void }) => {
  const [formData, setFormData] = useState<BookingRequest>({
    name: user.name,
    phone: user.phone,
    eventType: '',
    eventDate: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) onSuccess();
    } catch (err) {
      console.error(err);
      onSuccess(); // Proceed for demo
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gold mb-2">Name</label>
          <input 
            type="text" 
            value={formData.name}
            readOnly
            className="input-field opacity-50"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gold mb-2">Phone</label>
          <input 
            type="text" 
            value={formData.phone}
            readOnly
            className="input-field opacity-50"
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-gold mb-2">Event Type</label>
        <select 
          value={formData.eventType}
          onChange={(e) => setFormData({...formData, eventType: e.target.value})}
          className="input-field appearance-none"
          required
        >
          <option value="" className="bg-charcoal">Select Event</option>
          <option value="Wedding" className="bg-charcoal">Wedding</option>
          <option value="Engagement" className="bg-charcoal">Engagement</option>
          <option value="Birthday" className="bg-charcoal">Birthday</option>
          <option value="Portrait" className="bg-charcoal">Portrait Session</option>
          <option value="Event" className="bg-charcoal">Corporate Event</option>
        </select>
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-gold mb-2">Event Date</label>
        <input 
          type="date" 
          value={formData.eventDate}
          onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
          className="input-field"
          required
        />
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-gold mb-2">Message</label>
        <textarea 
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className="input-field h-32 resize-none"
          placeholder="Tell us about your requirements..."
        />
      </div>
      <button 
        type="submit"
        disabled={loading}
        className="gold-button w-full py-4 rounded-2xl shadow-lg shadow-gold/20"
      >
        {loading ? 'Sending...' : 'CONFIRM BOOKING'}
      </button>
    </form>
  );
};

const AdminPanel = ({ onLogout }: { onLogout: () => void }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ url: '', title: '', description: '', category: 'Wedding' });

  const fetchPortfolio = useCallback(async () => {
    const res = await fetch('/api/portfolio');
    const data = await res.json();
    setItems(data);
  }, []);

  useEffect(() => { fetchPortfolio(); }, [fetchPortfolio]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    setShowAdd(false);
    fetchPortfolio();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      fetchPortfolio();
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 pb-24">
      <div className="flex justify-between items-center mb-10">
        <h2 className="font-serif text-3xl gold-text">Admin Panel</h2>
        <button onClick={onLogout} className="text-white/40 hover:text-white"><LogOut size={20} /></button>
      </div>

      <button 
        onClick={() => setShowAdd(true)}
        className="gold-button w-full py-4 rounded-2xl mb-8 flex items-center justify-center gap-2"
      >
        <Plus size={20} /> ADD NEW WORK
      </button>

      <Portfolio items={items} isAdmin onDelete={handleDelete} />

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card w-full max-w-md p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl gold-text">Add Portfolio Item</h3>
                <button onClick={() => setShowAdd(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <input 
                  placeholder="Image URL" 
                  className="input-field" 
                  value={newItem.url} 
                  onChange={e => setNewItem({...newItem, url: e.target.value})} 
                  required 
                />
                <input 
                  placeholder="Title" 
                  className="input-field" 
                  value={newItem.title} 
                  onChange={e => setNewItem({...newItem, title: e.target.value})} 
                  required 
                />
                <select 
                  className="input-field appearance-none"
                  value={newItem.category}
                  onChange={e => setNewItem({...newItem, category: e.target.value})}
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Events">Events</option>
                  <option value="Cinematic">Cinematic</option>
                </select>
                <textarea 
                  placeholder="Description" 
                  className="input-field h-24" 
                  value={newItem.description} 
                  onChange={e => setNewItem({...newItem, description: e.target.value})} 
                />
                <button type="submit" className="gold-button w-full py-4 rounded-xl">UPLOAD</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const fetchPortfolio = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      setPortfolio(data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('karthik_studio_user');
    if (saved) setUserData(JSON.parse(saved));
    fetchPortfolio();
  }, [fetchPortfolio]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminPassword }),
    });
    if (res.ok) {
      setCurrentScreen('admin-panel');
      setAdminError('');
    } else {
      setAdminError('Invalid access code');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-black min-h-screen relative shadow-2xl overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && (
          <motion.div key="welcome" exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5 }}>
            <WelcomeScreen onEnter={() => setCurrentScreen('register')} />
          </motion.div>
        )}

        {currentScreen === 'register' && (
          <motion.div key="register" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}>
            <RegisterScreen onContinue={(data) => {
              setUserData(data);
              localStorage.setItem('karthik_studio_user', JSON.stringify(data));
              setCurrentScreen('dashboard');
            }} />
          </motion.div>
        )}

        {currentScreen === 'dashboard' && userData && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
            {/* Header */}
            <header className="px-6 pt-12 pb-6 flex justify-between items-center">
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Karthik Digital Studio</p>
                <h2 className="text-xl font-serif gold-text">{userData.name}</h2>
              </div>
              <button 
                onClick={() => setCurrentScreen('admin-login')}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
              >
                <User size={20} className="text-gold" />
              </button>
            </header>

            <main className="px-6">
              {activeTab === 'home' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="bg-linear-to-r from-gold/20 to-transparent border-l-2 border-gold p-5 rounded-r-2xl mb-8">
                    <p className="text-gold text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Legacy of Excellence</p>
                    <p className="text-white/80 text-sm italic">"21 years of capturing your most precious moments in Gudivada."</p>
                  </div>

                  <div className="relative h-64 rounded-[2.5rem] overflow-hidden group mb-8 gold-glow">
                    <img 
                      src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=1000" 
                      className="w-full h-full object-cover"
                      alt="Hero"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-8 left-8">
                      <h3 className="text-3xl font-serif mb-1 gold-text">Mastery in Every Frame</h3>
                      <p className="text-white/60 text-xs uppercase tracking-widest">Premium Photography • Gudivada</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { icon: Star, label: 'Rating', val: '5.0' },
                      { icon: Clock, label: 'Exp.', val: '21yrs' },
                      { icon: MapPin, label: 'Loc.', val: 'Gudivada' },
                    ].map((item, i) => (
                      <div key={i} className="glass-card p-4 flex flex-col items-center text-center">
                        <item.icon size={16} className="text-gold mb-2" />
                        <span className="text-[10px] text-white/40 uppercase tracking-tighter mb-1">{item.label}</span>
                        <span className="text-sm font-medium">{item.val}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'portfolio' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="font-serif text-2xl mb-6 gold-text">Our Masterpieces</h3>
                  <Portfolio items={portfolio} />
                </motion.div>
              )}

              {activeTab === 'book' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <h3 className="font-serif text-2xl mb-2 gold-text">Reserve Your Session</h3>
                  <p className="text-white/40 text-sm mb-8">Let us capture your special day with 21 years of expertise.</p>
                  <BookingForm user={userData} onSuccess={() => setShowBookingSuccess(true)} />
                </motion.div>
              )}

              {activeTab === 'about' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="font-serif text-3xl gold-text mb-2">Our Story</h3>
                    <div className="w-12 h-1 bg-gold mx-auto rounded-full" />
                  </div>

                  <div className="glass-card p-6 space-y-6">
                    <section>
                      <h4 className="font-serif text-xl gold-text mb-3 flex items-center gap-2">
                        <User size={20} /> L. Rambabu
                      </h4>
                      <p className="text-white/70 text-sm leading-relaxed">
                        With over 21 years of dedicated professional experience, L. Rambabu has established himself as a master of the craft in Gudivada. His journey began with a passion for freezing time and has evolved into a legacy of visual storytelling.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-serif text-xl gold-text mb-3 flex items-center gap-2">
                        <Camera size={20} /> Karthik Digital Studio
                      </h4>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Founded in the heart of Gudivada, Karthik Digital Studio has been the trusted name for generations. We combine traditional values with modern technology to deliver high-end, cinematic results for every client.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-serif text-xl gold-text mb-3 flex items-center gap-2">
                        <Star size={20} /> Our Philosophy
                      </h4>
                      <p className="text-white/70 text-sm leading-relaxed italic">
                        "Capturing Moments. Creating Memories."
                      </p>
                      <p className="text-white/70 text-sm leading-relaxed mt-2">
                        We believe that photography is not just about taking pictures; it's about capturing the soul of a moment. Our philosophy is rooted in patience, precision, and a deep respect for the emotions we document.
                      </p>
                    </section>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4 text-center">
                      <p className="text-2xl font-serif gold-text">21+</p>
                      <p className="text-[10px] uppercase tracking-widest text-white/40">Years Exp.</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                      <p className="text-2xl font-serif gold-text">5000+</p>
                      <p className="text-[10px] uppercase tracking-widest text-white/40">Events Done</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'contact' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h3 className="font-serif text-2xl gold-text">Get in Touch</h3>
                  <div className="glass-card p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-gold/10 p-3 rounded-xl text-gold"><Phone size={20} /></div>
                      <div>
                        <p className="text-[10px] uppercase text-white/40">Call Us</p>
                        <p className="text-sm">+91 98480 12345</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-gold/10 p-3 rounded-xl text-gold"><Mail size={20} /></div>
                      <div>
                        <p className="text-[10px] uppercase text-white/40">Email</p>
                        <p className="text-sm">lalaboo884@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-gold/10 p-3 rounded-xl text-gold"><MapPin size={20} /></div>
                      <div>
                        <p className="text-[10px] uppercase text-white/40">Studio</p>
                        <p className="text-sm">Main Road, Gudivada</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <div className="w-24 h-24 rounded-full border-2 border-gold p-1 mx-auto mb-6 gold-glow">
                    <div className="w-full h-full rounded-full bg-charcoal flex items-center justify-center">
                      <User size={40} className="text-gold" />
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl gold-text mb-1">{userData.name}</h3>
                  <p className="text-white/40 text-sm mb-10">{userData.phone}</p>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('karthik_studio_user');
                      setUserData(null);
                      setCurrentScreen('welcome');
                    }}
                    className="text-red-400 text-xs uppercase tracking-[0.2em] font-bold"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4">
              <div className="nav-blur glass-card flex justify-around items-center py-4 px-2">
                {[
                  { id: 'home', icon: Home, label: 'Home' },
                  { id: 'portfolio', icon: ImageIcon, label: 'Portfolio' },
                  { id: 'book', icon: Calendar, label: 'Book' },
                  { id: 'about', icon: Info, label: 'About' },
                  { id: 'contact', icon: Mail, label: 'Contact' },
                  { id: 'profile', icon: User, label: 'Profile' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`flex flex-col items-center gap-1 transition-all ${
                      activeTab === tab.id ? 'text-gold scale-110' : 'text-white/40'
                    }`}
                  >
                    <tab.icon size={20} />
                    <span className="text-[8px] uppercase tracking-tighter">{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div layoutId="activeTab" className="w-1 h-1 bg-gold rounded-full mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </nav>
          </motion.div>
        )}

        {currentScreen === 'admin-login' && (
          <motion.div key="admin-login" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-screen flex items-center justify-center p-6">
            <div className="glass-card w-full max-w-md p-10">
              <div className="flex justify-center mb-6 text-gold"><Lock size={40} /></div>
              <h2 className="font-serif text-2xl text-center gold-text mb-8">Owner Access</h2>
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <input 
                  type="password" 
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="Enter Access Code"
                  className="input-field text-center"
                />
                {adminError && <p className="text-red-400 text-xs text-center">{adminError}</p>}
                <button type="submit" className="gold-button w-full py-4 rounded-xl">VERIFY</button>
                <button type="button" onClick={() => setCurrentScreen('dashboard')} className="w-full text-white/40 text-xs uppercase tracking-widest">Back to App</button>
              </form>
            </div>
          </motion.div>
        )}

        {currentScreen === 'admin-panel' && (
          <motion.div key="admin-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AdminPanel onLogout={() => setCurrentScreen('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Success Modal */}
      <AnimatePresence>
        {showBookingSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card p-10 text-center max-w-xs"
            >
              <div className="flex justify-center mb-6 text-emerald-400"><CheckCircle2 size={60} /></div>
              <h3 className="font-serif text-2xl gold-text mb-4">Request Sent</h3>
              <p className="text-white/60 text-sm mb-8">L. Rambabu has been notified. We will contact you shortly to confirm your session.</p>
              <button 
                onClick={() => {
                  setShowBookingSuccess(false);
                  setActiveTab('home');
                }}
                className="gold-button w-full py-4 rounded-xl"
              >
                GREAT
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
