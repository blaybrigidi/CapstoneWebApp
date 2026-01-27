import React from 'react';
import '../styles/variables.css';

const Sidebar = ({ onNavigate, currentView = 'dashboard' }) => {
  const menuItems = [
    { name: 'Dashboard', icon: 'Active', id: 'dashboard' },
    { name: 'Patients', icon: '', id: 'patients' },
    { name: 'Analytics', icon: '', id: 'analytics' },
    { name: 'Alerts', icon: '', id: 'alerts' },
    { name: 'Reports', icon: '', id: 'reports' },
    { name: 'Settings', icon: '', id: 'settings' },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoArea}>
        <h2 style={styles.logoText}>Clinician<span style={{ fontWeight: 'var(--font-weight-regular)' }}>Dash</span></h2>
      </div>
      <nav style={styles.nav}>
        <ul style={styles.ul}>
          {menuItems.map((item) => {
            const isActive = currentView === item.id || (currentView === 'patient-detail' && item.id === 'patients');
            return (
              <li key={item.name} style={styles.li}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.id === 'dashboard' || item.id === 'settings') {
                      onNavigate(item.id);
                    }
                  }}
                  style={{
                    ...styles.link,
                    ...(isActive ? styles.activeLink : {})
                  }}
                >
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <div style={styles.userProfile}>
        <div style={styles.avatar}>DR</div>
        <div style={styles.userInfo}>
          <p style={styles.userName}>Dr. Smith</p>
          <p style={styles.userRole}>Cardiologist</p>
        </div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '280px', /* Slightly wider */
    backgroundColor: 'var(--color-bg-body)',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid var(--border-color)',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 10,
  },
  logoArea: {
    padding: 'var(--spacing-lg) var(--spacing-lg)',
    marginBottom: 'var(--spacing-md)',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'var(--font-weight-heavy)',
    letterSpacing: '-0.03em',
  },
  nav: {
    flex: 1,
    padding: '0 var(--spacing-md)',
  },
  ul: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  li: {
    marginBottom: '2px',
  },
  link: {
    display: 'block',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderRadius: 'var(--border-radius)',
    textDecoration: 'none',
    color: 'var(--color-text-secondary)',
    fontWeight: 'var(--font-weight-medium)',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
  },
  activeLink: {
    backgroundColor: 'var(--color-bg-subtle)',
    color: 'var(--color-text-primary)',
    fontWeight: 'var(--font-weight-bold)',
  },
  userProfile: {
    padding: 'var(--spacing-lg)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-text-primary)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: '0.8rem',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    margin: 0,
    fontSize: '0.9rem',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text-primary)',
  },
  userRole: {
    margin: 0,
    fontSize: '0.8rem',
    color: 'var(--color-text-tertiary)',
  },
};

export default Sidebar;
