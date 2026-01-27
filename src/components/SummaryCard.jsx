
import React from 'react';
import { motion } from 'framer-motion';

const SummaryCard = ({ title, value, subtext, type = 'normal' }) => {
  // Using pure monochromatic ghost styling as requested
  // type can be used for subtle indicators if needed, 
  // currently keeping strictly monochromatic per high-level directive
  const isAlert = type === 'alert';

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
        {isAlert && (
          <motion.div
            style={styles.pulsingDot}
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
      <div style={styles.content}>
        <span style={styles.value}>
          {value}
        </span>
      </div>
      {subtext && <p style={styles.subtext}>{subtext}</p>}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'var(--color-bg-surface)', /* Ensure white background for opacity contrast */
    border: '1px solid var(--border-color)',
    padding: 'var(--spacing-md)',
    borderRadius: 'var(--border-radius)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    minHeight: '160px',
    transition: 'border-color 0.3s ease, transform 0.3s ease', /* Allow smooth transition matching parent */
    cursor: 'default',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'var(--spacing-sm)',
  },
  title: {
    fontSize: '0.75rem',
    color: 'var(--color-text-tertiary)',
    fontWeight: 'var(--font-weight-medium)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    margin: 0,
  },
  pulsingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#FF3B30', /* Red for heartbeat */
    boxShadow: '0 0 4px rgba(255, 59, 48, 0.4)',
  },
  content: {
    marginTop: 'auto',
    marginBottom: 'var(--spacing-sm)',
  },
  value: {
    fontSize: '3rem', /* Large, light weight */
    fontWeight: 'var(--font-weight-regular)',
    lineHeight: 1,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
  },
  subtext: {
    margin: 0,
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.4',
  },
};

export default SummaryCard;
