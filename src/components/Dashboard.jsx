import React, { useState } from 'react';
import SummaryCard from './SummaryCard';
import { motion } from 'framer-motion';
import PatientList from './PatientList';
import RecentActivity from './RecentActivity';

const Dashboard = ({ onNavigate }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const stats = [
        {
            title: 'Critical Alerts',
            value: '3',
            subtext: 'Requires immediate attention',
            type: 'alert',
            action: () => onNavigate('alerts', null, { filter: 'critical' })
        },
        {
            title: 'Warnings Today',
            value: '12',
            subtext: 'Blood pressure anomalies',
            type: 'warning',
            action: () => onNavigate('alerts', null, { filter: 'warning' })
        },
        {
            title: 'Active Patients',
            value: '142',
            subtext: '+4 since yesterday',
            type: 'normal',
            action: () => { setSearchQuery(''); setStatusFilter('All'); } // Clear filters
        },
        {
            title: 'Reports Pending',
            value: '8',
            subtext: 'Review needed by Friday',
            type: 'normal',
            action: null
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
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
                        onClick={() => {/* no-op for demo */ }}
                    >
                        + New Patient
                    </motion.button>
                </div>
            </motion.header>

            {/* Summary Cards */}
            <motion.section style={styles.statsGrid} layout>
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        style={styles.gridItem}
                        variants={itemVariants}
                        layout
                        whileHover={stat.action ? { scale: 1.02 } : {}}
                    >
                        <SummaryCard
                            title={stat.title}
                            value={stat.value}
                            subtext={stat.subtext}
                            type={stat.type}
                            onClick={stat.action}
                            isActive={false}
                        />
                    </motion.div>
                ))}
            </motion.section>

            {/* Content Area: Patient List + Sidebar */}
            <div style={styles.contentArea}>
                <motion.div style={styles.mainColumn} variants={itemVariants}>

                    {/* Search and Filter Bar */}
                    <div style={styles.filterBar}>
                        <div style={styles.searchContainer}>
                            <span style={styles.searchIcon}>🔍</span>
                            <input
                                type="text"
                                placeholder="Search patients..."
                                style={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            style={styles.filterSelect}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Critical">Critical Only</option>
                            <option value="Warning">Warning Only</option>
                            <option value="Normal">Normal Only</option>
                        </select>
                    </div>

                    <PatientList
                        onNavigate={onNavigate}
                        searchQuery={searchQuery}
                        statusFilter={statusFilter}
                    />
                </motion.div>

                <motion.div style={styles.sideColumn} variants={itemVariants}>
                    <RecentActivity onNavigate={onNavigate} />
                </motion.div>
            </div>
        </motion.main>
    );
};

const styles = {
    main: {
        marginLeft: '280px',
        padding: 'var(--spacing-xl)',
        minHeight: '100vh',
        maxWidth: '1600px', // Increased max-width
    },
    header: {
        marginTop: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    title: {
        fontSize: '3rem',
        fontWeight: 'var(--font-weight-heavy)',
        letterSpacing: '-0.04em',
        lineHeight: '1.1',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-xl)',
    },
    gridItem: {
        /* Grid item styling handled by card */
    },
    contentArea: {
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        gap: 'var(--spacing-lg)',
        alignItems: 'start',
    },
    mainColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
    },
    sideColumn: {
        display: 'flex',
        flexDirection: 'column',
    },
    filterBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 0 var(--spacing-sm) 0',
    },
    searchContainer: {
        position: 'relative',
        width: '300px',
    },
    searchIcon: {
        position: 'absolute',
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '0.9rem',
        color: 'var(--color-text-tertiary)',
    },
    searchInput: {
        width: '100%',
        padding: '10px 10px 10px 36px',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--color-bg-surface)',
        fontSize: '0.9rem',
        color: 'var(--color-text-primary)',
        outline: 'none',
    },
    filterSelect: {
        padding: '10px 16px',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--color-bg-surface)',
        color: 'var(--color-text-primary)',
        fontSize: '0.9rem',
        outline: 'none',
        cursor: 'pointer',
    },
    buttonPrimary: {
        backgroundColor: 'var(--color-primary)',
        color: '#FFF',
        border: 'none',
        padding: '0.8rem 1.6rem',
        borderRadius: '100px',
        fontWeight: 'var(--font-weight-medium)',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
};

export default Dashboard;
