import React from 'react';
import { motion } from 'framer-motion';

const LiveVitalCard = ({ label, value, unit, status = 'Normal' }) => {
    const isAbnormal = status !== 'Normal';

    return (
        <motion.div
            style={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
            <div style={styles.header}>
                <span style={styles.label}>{label}</span>
                <div style={styles.liveIndicator}>
                    <motion.div
                        style={{ ...styles.dot, backgroundColor: isAbnormal ? '#FF3B30' : '#34C759' }}
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span style={styles.liveText}>LIVE</span>
                </div>
            </div>

            <div style={styles.valueContainer}>
                <span style={styles.value}>{value}</span>
                <span style={styles.unit}>{unit}</span>
            </div>

            <div style={styles.footer}>
                <span style={{
                    ...styles.status,
                    color: isAbnormal ? '#FF3B30' : '#34C759',
                    backgroundColor: isAbnormal ? 'rgba(255, 59, 48, 0.1)' : 'rgba(52, 199, 89, 0.1)'
                }}>
                    {status}
                </span>
            </div>
        </motion.div>
    );
};

const styles = {
    card: {
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        padding: 'var(--spacing-lg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '220px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)', // Very subtle lift
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-md)',
    },
    label: {
        fontSize: '0.9rem',
        color: 'var(--color-text-secondary)',
        fontWeight: 'var(--font-weight-bold)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    liveIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
    },
    liveText: {
        fontSize: '0.65rem',
        fontWeight: '900',
        color: 'var(--color-text-tertiary)',
        letterSpacing: '0.1em',
    },
    valueContainer: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '4px',
        marginBottom: 'var(--spacing-md)',
    },
    value: {
        fontSize: '4.5rem',
        fontWeight: 'var(--font-weight-regular)', // Light/Regular for Swiss feel
        color: 'var(--color-text-primary)',
        lineHeight: 1,
        letterSpacing: '-0.03em',
    },
    unit: {
        fontSize: '1.2rem',
        color: 'var(--color-text-secondary)',
        fontWeight: 'var(--font-weight-medium)',
    },
    footer: {
        marginTop: 'auto',
    },
    status: {
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: '100px',
        fontSize: '0.8rem',
        fontWeight: '600',
    }
};

export default LiveVitalCard;
