import React from 'react';

const SummaryCard = ({ title, value, subtext, type = 'normal' }) => {
  // Using pure monochromatic ghost styling as requested
  // type can be used for subtle indicators if needed, 
  // currently keeping strictly monochromatic per high-level directive

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{title}</h3>
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
    backgroundColor: 'transparent', /* Ghost styling */
    border: '1px solid var(--border-color)', /* 1px light gray */
    padding: 'var(--spacing-md)',
    borderRadius: 'var(--border-radius)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    minHeight: '160px', /* Taller for breathability */
    transition: 'border-color 0.2s ease',
    cursor: 'default',
  },
  title: {
    fontSize: '0.75rem',
    color: 'var(--color-text-tertiary)',
    fontWeight: 'var(--font-weight-medium)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 'var(--spacing-sm)',
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
