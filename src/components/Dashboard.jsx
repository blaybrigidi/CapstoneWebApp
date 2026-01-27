import React from 'react';
import SummaryCard from './SummaryCard';
import { motion } from 'framer-motion';
import PatientList from './PatientList';

const Dashboard = ({ onNavigate }) => {
    const stats = [
        { title: 'Active Patients', value: '142', subtext: '+4 since yesterday', type: 'normal' },
        { title: 'Critical Alerts', value: '3', subtext: 'Requires immediate attention', type: 'alert' },
        { title: 'Warnings Today', value: '12', subtext: 'Blood pressure anomalies', type: 'warning' },
        { title: 'Reports Pending', value: '8', subtext: 'Review needed by Friday', type: 'normal' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 24
            }
        }
    };

    return (
        <motion.main
            style={styles.main}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            variants={containerVariants}
        >
            <motion.header style={styles.header} variants={itemVariants}>
                <h1 style={styles.title}>Patient Overview</h1>
                <div style={styles.actions}>
                    <motion.button
                        style={styles.buttonPrimary}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        + New Patient
                    </motion.button>
                </div>
            </motion.header>

            <motion.section style={styles.grid} layout>
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        style={styles.gridItem}
                        variants={itemVariants}
                        layout
                        whileHover={{
                            scale: 1.01,
                            borderColor: "#1A1A1A",
                            transition: { duration: 0.3 }
                        }}
                    >
                        <SummaryCard
                            title={stat.title}
                            value={stat.value}
                            subtext={stat.subtext}
                            type={stat.type}
                        />
                    </motion.div>
                ))}
            </motion.section>

            <motion.section style={{ marginTop: 'var(--spacing-lg)' }} layout variants={itemVariants}>
                <PatientList onNavigate={onNavigate} />
            </motion.section>
        </motion.main>
    );
};

const styles = {
    main: {
        marginLeft: '280px',
        padding: 'var(--spacing-xl)',
        minHeight: '100vh',
        maxWidth: '1400px',
    },
    header: {
        marginTop: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    title: {
        fontSize: '3.5rem',
        fontWeight: 'var(--font-weight-heavy)',
        letterSpacing: '-0.04em',
        lineHeight: '1.1',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-md)',
    },
    gridItem: {
        /* Grid item styling handled by card */
    },
    bentoSection: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 'var(--spacing-md)',
    },
    bentoCardLarge: {
        backgroundColor: 'var(--color-bg-subtle)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        padding: 'var(--spacing-lg)',
        minHeight: '400px',
    },
    bentoCardSmall: {
        backgroundColor: 'var(--color-bg-subtle)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        padding: 'var(--spacing-lg)',
        minHeight: '400px',
    },
    cardTitle: {
        fontSize: '0.9rem',
        fontWeight: 'var(--font-weight-bold)',
        marginBottom: 'var(--spacing-md)',
    },
    cardEmpty: {
        color: 'var(--color-text-secondary)',
        fontSize: '0.9rem',
    },
    buttonPrimary: {
        backgroundColor: 'var(--color-text-primary)',
        color: '#FFF',
        border: 'none',
        padding: '0.8rem 1.6rem',
        borderRadius: '100px',
        fontWeight: 'var(--font-weight-medium)',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    statusIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem',
        color: 'var(--color-text-secondary)',
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#34C759',
    }
};

export default Dashboard;
