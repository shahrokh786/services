// frontend/src/styles.js

// This object contains ALL styles from your original App.js
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
  logoLink: {
    textDecoration: 'none',
    color: 'white',
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
    textDecoration: 'none', // For <Link>
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

  // --- NEW STYLES FOR SERVICE CARD ---
  // These were added from our previous step
  serviceCardV2: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  serviceCardImage: {
    width: '100%',
    height: '200px', // 12rem or h-48
    objectFit: 'cover',
  },
  serviceCardContent: {
    padding: '1rem',
  },
  serviceCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  serviceCardTitle: {
    fontSize: '1.125rem', // text-lg
    fontWeight: '600', // font-semibold
    color: '#374151', // text-gray-800
  },
  serviceCardPrice: {
    backgroundColor: '#DBEAFE', // bg-blue-100
    color: '#1E40AF', // text-blue-800
    fontSize: '0.875rem', // text-sm
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontWeight: '500',
  },
  serviceCardDescription: {
    color: '#4B5563', // text-gray-600
    fontSize: '0.875rem', // text-sm
    marginBottom: '0.75rem',
    height: '40px', // Simulating line-clamp-2
    overflow: 'hidden',
  },
  serviceCardRating: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  serviceCardRatingText: {
    fontSize: '0.875rem', // text-sm
    color: '#4B5563', // text-gray-600
    marginLeft: '0.5rem',
  },
  serviceCardProvider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  serviceCardProviderInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  serviceCardAvatar: {
    width: '32px', // w-8
    height: '32px', // h-8
    borderRadius: '50%',
    marginRight: '0.5rem',
  },
  serviceCardProviderName: {
    fontSize: '0.875rem',
    color: '#374151',
  },
  serviceCardCategory: {
    fontSize: '0.875rem',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  serviceCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
  },
  serviceCardLocation: {
    fontSize: '0.875rem',
    color: '#6B7280',
  },
  serviceCardButton: {
    backgroundColor: '#2563EB', // bg-blue-600
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
    textDecoration: 'none',
  },

  // --- ADDED STYLES FOR DASHBOARD ---
  // I have added the missing styles here for you
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  dashboardCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    textDecoration: 'none',
    color: '#1f2937',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    border: '1px solid #e2e8f0',
  },

};

export default styles;