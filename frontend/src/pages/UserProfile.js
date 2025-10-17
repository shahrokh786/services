import React from 'react';

function UserProfile({ user, onLogout }) {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>My Profile</h1>
        <p style={styles.subtitle}>Manage your account and bookings</p>
      </div>
      
      <div style={styles.content}>
        <div style={styles.profileCard}>
          <div style={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h2>{user?.name || 'User'}</h2>
          <p style={styles.email}>{user?.email}</p>
          <p style={styles.role}>Role: {user?.role || 'Customer'}</p>
          
          <div style={styles.stats}>
            <div style={styles.stat}>
              <h3>5</h3>
              <p>Bookings</p>
            </div>
            <div style={styles.stat}>
              <h3>4.8</h3>
              <p>Rating</p>
            </div>
            <div style={styles.stat}>
              <h3>12</h3>
              <p>Services</p>
            </div>
          </div>
          
          <button style={styles.logoutButton} onClick={onLogout}>
            Logout
          </button>
        </div>

        <div style={styles.bookings}>
          <h2>My Bookings</h2>
          <div style={styles.bookingList}>
            <div style={styles.booking}>
              <h3>Plumbing Repair</h3>
              <p>Status: <span style={styles.completed}>Completed</span></p>
              <p>Date: January 15, 2024</p>
              <p>Amount: $85</p>
            </div>
            <div style={styles.booking}>
              <h3>Electrical Wiring</h3>
              <p>Status: <span style={styles.upcoming}>Upcoming</span></p>
              <p>Date: January 20, 2024</p>
              <p>Amount: $120</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  },
  hero: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.25rem',
    opacity: 0.9,
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '4rem 2rem',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '2rem',
  },
  profileCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    height: 'fit-content',
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
  email: {
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  role: {
    color: '#374151',
    marginBottom: '2rem',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '2rem',
  },
  stat: {
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    width: '100%',
  },
  bookings: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  bookingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  booking: {
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
  },
  completed: {
    color: '#059669',
    fontWeight: 'bold',
  },
  upcoming: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
};

export default UserProfile;