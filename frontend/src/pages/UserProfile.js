import React from 'react';

const Profile = ({ user }) => {
  if (!user) {
    return (
      <div style={styles.pageContainer}>
        <h2>Please login to view your profile</h2>
        {/* We should make login a <Link> or modal trigger */}
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
          {/* We will make this dynamic next */}
          <div style={styles.bookingList}>
            <div style={styles.booking}>
              <h4>Plumbing Service</h4>
              <p>Status: Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles for Profile page
const styles = { /* ... (Copy pageContainer, pageTitle, profileContent, etc. from App.js) ... */ };

export default Profile;