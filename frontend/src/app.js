import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', email: '', password: '', phone: '' 
  });

  // Load services when component mounts
  useEffect(() => {
    loadServices();
  }, []);

  // Handle user registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', registerData);
      alert('🎉 Registration successful!');
      setUser(response.data.user);
      setShowRegister(false);
      setRegisterData({ name: '', email: '', password: '', phone: '' });
    } catch (error) {
      alert('❌ Registration failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
      alert('🔐 Login successful!');
      setUser(response.data.user);
      setShowLogin(false);
      setLoginData({ email: '', password: '' });
    } catch (error) {
      alert('❌ Login failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    alert('👋 Logged out successfully!');
  };

  // Load services from backend
  const loadServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/services');
      setServices(response.data);
    } catch (error) {
      alert('❌ Failed to load services');
      // Fallback sample data
      setServices([
        {
          _id: '1',
          title: 'Plumbing Service',
          description: 'Professional plumbing repairs',
          category: 'plumbing',
          price: 85,
          provider: { name: 'Expert Plumbers' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Book a service
  const handleBookService = async (serviceId) => {
    if (!user) {
      alert('⚠️ Please login first to book a service!');
      setShowLogin(true);
      return;
    }

    try {
      const bookingData = {
        serviceId: serviceId,
        customerId: user.id,
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        address: '123 Main Street'
      };

      await axios.post('http://localhost:5000/api/bookings', bookingData);
      alert(`✅ Booking confirmed for service ${serviceId}!`);
    } catch (error) {
      alert('❌ Booking failed');
    }
  };

  // Render different pages
  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return (
          <div style={styles.pageContainer}>
            <h1 style={styles.pageTitle}>About Us</h1>
            <div style={styles.aboutContent}>
              <p>We are LocalServiceHub, connecting people with trusted service providers in their community.</p>
              <div style={styles.features}>
                <div style={styles.feature}>
                  <h3>🔒 Verified Providers</h3>
                  <p>All providers are background checked and rated</p>
                </div>
                <div style={styles.feature}>
                  <h3>💳 Secure Payments</h3>
                  <p>Safe and secure payment processing</p>
                </div>
                <div style={styles.feature}>
                  <h3>⭐ Quality Guarantee</h3>
                  <p>100% satisfaction guarantee on all services</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div style={styles.pageContainer}>
            <h1 style={styles.pageTitle}>Contact Us</h1>
            <div style={styles.contactContent}>
              <div style={styles.contactInfo}>
                <h3>📞 Phone: +1 (555) 123-4567</h3>
                <h3>✉️ Email: support@localservicehub.com</h3>
                <h3>📍 Address: 123 Service Street, NY</h3>
              </div>
              <div style={styles.contactForm}>
                <input style={styles.input} placeholder="Your Name" />
                <input style={styles.input} placeholder="Your Email" />
                <textarea style={styles.textarea} placeholder="Your Message" rows="4" />
                <button style={styles.primaryButton}>Send Message</button>
              </div>
            </div>
          </div>
        );

      case 'profile':
        if (!user) {
          return (
            <div style={styles.pageContainer}>
              <h2>Please login to view your profile</h2>
              <button style={styles.primaryButton} onClick={() => setShowLogin(true)}>
                Login
              </button>
            </div>
          );
        }
        return (
          <div style={styles.pageContainer}>
            <h1 style={styles.pageTitle}>My Profile</h1>
            <div style={styles.profileContent}>
              <div style={styles.profileHeader}>
                <div style={styles.avatar}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
              </div>
              <div style={styles.bookings}>
                <h3>My Bookings</h3>
                <div style={styles.bookingList}>
                  <div style={styles.booking}>
                    <h4>Plumbing Service</h4>
                    <p>Status: Completed</p>
                    <p>Date: Jan 15, 2024</p>
                  </div>
                  <div style={styles.booking}>
                    <h4>Electrical Repair</h4>
                    <p>Status: Upcoming</p>
                    <p>Date: Jan 20, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <>
            {/* Hero Section */}
            <section style={styles.hero}>
              <div style={styles.heroContent}>
                <h1 style={styles.heroTitle}>Find Trusted Local Service Providers</h1>
                <p style={styles.heroSubtitle}>
                  Connect with skilled professionals in your neighborhood
                </p>
                <button 
                  style={styles.ctaButton}
                  onClick={loadServices}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Find Services Near You'}
                </button>
              </div>
            </section>

            {/* Services Section */}
            {services.length > 0 && (
              <section style={styles.services}>
                <h2 style={styles.sectionTitle}>Available Services</h2>
                <div style={styles.servicesGrid}>
                  {services.map(service => (
                    <div key={service._id} style={styles.serviceCard}>
                      <h3 style={styles.serviceTitle}>{service.title}</h3>
                      <p style={styles.serviceCategory}>{service.category}</p>
                      <p style={styles.serviceDescription}>{service.description}</p>
                      <div style={styles.serviceFooter}>
                        <span style={styles.servicePrice}>${service.price}</span>
                        <button 
                          style={styles.bookButton}
                          onClick={() => handleBookService(service._id)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Categories Section */}
            <section style={styles.categories}>
              <h2 style={styles.sectionTitle}>Service Categories</h2>
              <div style={styles.categoriesGrid}>
                {['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'Other'].map((category) => (
                  <div key={category} style={styles.categoryCard}>
                    <h3>{category}</h3>
                    <p>50+ Providers</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div style={styles.container}>
      {/* Navigation Bar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <h1 
            style={styles.logo}
            onClick={() => setCurrentPage('home')}
          >
            LocalServiceHub
          </h1>
          
          <div style={styles.navLinks}>
            <button 
              style={currentPage === 'home' ? styles.activeNavLink : styles.navLink}
              onClick={() => setCurrentPage('home')}
            >
              Home
            </button>
            <button 
              style={currentPage === 'about' ? styles.activeNavLink : styles.navLink}
              onClick={() => setCurrentPage('about')}
            >
              About
            </button>
            <button 
              style={currentPage === 'contact' ? styles.activeNavLink : styles.navLink}
              onClick={() => setCurrentPage('contact')}
            >
              Contact
            </button>

            {user ? (
              <div style={styles.userSection}>
                <button 
                  style={styles.navLink}
                  onClick={() => setCurrentPage('profile')}
                >
                  Profile
                </button>
                <span style={styles.userName}>Hi, {user.name}</span>
                <button style={styles.logoutButton} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div style={styles.authButtons}>
                <button 
                  style={styles.loginButton}
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </button>
                <button 
                  style={styles.signupButton}
                  onClick={() => setShowRegister(true)}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        {renderPage()}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&copy; 2024 LocalServiceHub. All rights reserved.</p>
        <p>Backend: {services.length > 0 ? '✅ Connected' : '❌ Disconnected'}</p>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                style={styles.input}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                style={styles.input}
                required
              />
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.primaryButton}>
                  Login
                </button>
                <button 
                  type="button" 
                  style={styles.secondaryButton}
                  onClick={() => setShowLogin(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Sign Up</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Full Name"
                value={registerData.name}
                onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                style={styles.input}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                style={styles.input}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                style={styles.input}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={registerData.phone}
                onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                style={styles.input}
              />
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.primaryButton}>
                  Sign Up
                </button>
                <button 
                  type="button" 
                  style={styles.secondaryButton}
                  onClick={() => setShowRegister(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    margin: 0,
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
  },
  activeNavLink: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    color: 'white',
  },
  authButtons: {
    display: 'flex',
    gap: '1rem',
  },
  loginButton: {
    background: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  signupButton: {
    background: 'white',
    border: 'none',
    color: '#2563eb',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  logoutButton: {
    background: '#ef4444',
    border: 'none',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
  },
  hero: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: 'white',
    color: '#2563eb',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  services: {
    padding: '4rem 2rem',
    backgroundColor: '#f8fafc',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '3rem',
    color: '#1f2937',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  serviceCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  serviceTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#1f2937',
  },
  serviceCategory: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.875rem',
    display: 'inline-block',
    marginBottom: '1rem',
  },
  serviceDescription: {
    color: '#6b7280',
    marginBottom: '1rem',
    lineHeight: '1.5',
  },
  serviceFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#059669',
  },
  bookButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  categories: {
    padding: '4rem 2rem',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  categoryCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    cursor: 'pointer',
  },
  pageContainer: {
    padding: '4rem 2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  aboutContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  feature: {
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
  contactContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
  },
  contactInfo: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  contactForm: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  profileContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  profileHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  avatar: {
    width: '80px',
    height: '80px',
    backgroundColor: '#2563eb',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '0 auto 1rem',
  },
  bookings: {
    marginTop: '2rem',
  },
  bookingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  booking: {
    padding: '1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
  },
  footer: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '2rem',
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '400px',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical',
  },
  modalButtons: {
    display: 'flex',
    gap: '1rem',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: 1,
  },
};

export default App;