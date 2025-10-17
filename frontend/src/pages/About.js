import React from 'react';

function About() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>About LocalServiceHub</h1>
        <p style={styles.subtitle}>Connecting communities with trusted service providers</p>
      </div>
      
      <div style={styles.content}>
        <div style={styles.section}>
          <h2>Our Mission</h2>
          <p>
            LocalServiceHub is dedicated to making it easy for people to find reliable 
            local service providers while helping skilled professionals grow their businesses.
          </p>
        </div>

        <div style={styles.section}>
          <h2>Why Choose Us?</h2>
          <div style={styles.features}>
            <div style={styles.feature}>
              <h3>✅ Verified Providers</h3>
              <p>All service providers are thoroughly verified and rated by customers</p>
            </div>
            <div style={styles.feature}>
              <h3>💳 Secure Payments</h3>
              <p>Safe and secure payment processing for all transactions</p>
            </div>
            <div style={styles.feature}>
              <h3>🛡️ Satisfaction Guarantee</h3>
              <p>Your satisfaction is our top priority with money-back guarantee</p>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2>Our Story</h2>
          <p>
            Founded in 2024, LocalServiceHub started as a small project to help neighbors 
            find reliable service providers in their community. Today, we serve thousands 
            of customers across multiple cities.
          </p>
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
  },
  section: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginTop: '1.5rem',
  },
  feature: {
    padding: '1.5rem',
    backgroundColor: '#f1f5f9',
    borderRadius: '0.5rem',
  }
};

export default About;