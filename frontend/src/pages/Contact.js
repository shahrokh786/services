import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Contact Us</h1>
        <p style={styles.subtitle}>Get in touch with our team</p>
      </div>
      
      <div style={styles.content}>
        <div style={styles.contactInfo}>
          <h2>Get In Touch</h2>
          
          <div style={styles.contactItem}>
            <h3>📍 Address</h3>
            <p>123 Service Street<br />New York, NY 10001</p>
          </div>
          
          <div style={styles.contactItem}>
            <h3>📞 Phone</h3>
            <p>+1 (555) 123-4567</p>
          </div>
          
          <div style={styles.contactItem}>
            <h3>✉️ Email</h3>
            <p>support@localservicehub.com</p>
          </div>
          
          <div style={styles.contactItem}>
            <h3>🕒 Business Hours</h3>
            <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM</p>
          </div>
        </div>

        <div style={styles.formContainer}>
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              style={styles.textarea}
              rows="5"
              required
            />
            <button type="submit" style={styles.submitButton}>
              Send Message
            </button>
          </form>
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 2rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
  },
  contactInfo: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    height: 'fit-content',
  },
  contactItem: {
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #e2e8f0',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    resize: 'vertical',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default Contact;