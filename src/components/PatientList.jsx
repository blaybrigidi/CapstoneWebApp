import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PatientList = ({ onNavigate, searchQuery = '', statusFilter = 'All' }) => {
    // Enhanced Mock Data with trend info and raw timestamps
    const patients = useMemo(() => [
        { id: 1, name: 'Alex Morgan', hr: 72, hrTrend: { dir: 'stable', val: 0 }, spo2: 98, spo2Trend: { dir: 'up', val: 1 }, temp: 36.5, status: 'Normal', lastUpdate: Date.now() - 1000 * 60 * 2, avatar: 'AM' },
        { id: 3, name: 'James Howlett', hr: 110, hrTrend: { dir: 'up', val: 8 }, spo2: 92, spo2Trend: { dir: 'down', val: 3 }, temp: 38.5, status: 'Critical', lastUpdate: Date.now() - 1000 * 30, avatar: 'JH' },
        { id: 2, name: 'Sarah Connor', hr: 85, hrTrend: { dir: 'up', val: 5 }, spo2: 96, spo2Trend: { dir: 'stable', val: 0 }, temp: 37.1, status: 'Warning', lastUpdate: Date.now() - 1000 * 60 * 5, avatar: 'SC' },
        { id: 4, name: 'Diana Prince', hr: 65, hrTrend: { dir: 'down', val: 2 }, spo2: 99, spo2Trend: { dir: 'stable', val: 0 }, temp: 36.2, status: 'Normal', lastUpdate: Date.now() - 1000 * 60 * 10, avatar: 'DP' },
        { id: 5, name: 'Bruce Wayne', hr: 92, hrTrend: { dir: 'up', val: 12 }, spo2: 95, spo2Trend: { dir: 'down', val: 1 }, temp: 37.0, status: 'Warning', lastUpdate: Date.now() - 1000 * 60 * 15, avatar: 'BW' },
        { id: 6, name: 'Tony Stark', hr: 115, hrTrend: { dir: 'up', val: 15 }, spo2: 89, spo2Trend: { dir: 'down', val: 5 }, temp: 39.2, status: 'Critical', lastUpdate: Date.now() - 1000 * 60 * 60, avatar: 'TS' }, // Stale data test
    ], []);

    const filteredPatients = useMemo(() => {
        let result = [...patients];

        // 1. Filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(p => p.name.toLowerCase().includes(lowerQuery));
        }
        if (statusFilter !== 'All') {
            result = result.filter(p => p.status === statusFilter);
        }

        // 2. Sort: Critical -> Warning -> Normal
        const statusPriority = { 'Critical': 0, 'Warning': 1, 'Normal': 2 };
        result.sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);

        return result;
    }, [patients, searchQuery, statusFilter]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
    };

    const getFreshnessStatus = (timestamp) => {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        if (minutes < 2) return { text: 'Just now', color: '#1E8E3E' }; // Green
        if (minutes < 5) return { text: `${minutes} min ago`, color: '#F9AB00' }; // Yellow
        if (minutes >= 60) return { text: 'Offline', color: '#D93025', isOffline: true }; // Red/Offline
        return { text: `${minutes} min ago`, color: '#D93025' }; // Red
    };

    return (
        <motion.div
            style={styles.container}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            layout
        >
            <div style={styles.headerRow}>
                <div style={{ ...styles.cell, flex: 2.2 }}>PATIENT NAME</div>
                <div style={styles.cell}>HEART RATE</div>
                <div style={styles.cell}>SpO2</div>
                <div style={styles.cell}>TEMP</div>
                <div style={styles.cell}>STATUS</div>
                <div style={styles.cell}>LAST UPDATE</div>
                <div style={styles.cell}>ACTIONS</div>
            </div>

            <div style={styles.list}>
                <AnimatePresence>
                    {filteredPatients.map((patient) => {
                        const freshness = getFreshnessStatus(patient.lastUpdate);
                        const isCritical = patient.status === 'Critical';

                        return (
                            <motion.div
                                key={patient.id}
                                style={{
                                    ...styles.row,
                                    backgroundColor: isCritical ? 'rgba(252, 232, 230, 0.4)' : 'var(--color-bg-surface)', // Subtle red tint for critical
                                    borderLeft: isCritical ? '4px solid #D93025' : '4px solid transparent',
                                }}
                                variants={itemVariants}
                                layout
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, height: 0 }}
                                whileHover={{
                                    scale: 1.005,
                                    backgroundColor: isCritical ? 'rgba(252, 232, 230, 0.8)' : 'rgba(0, 146, 202, 0.04)', // Slight blue tint for normal rows
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <div style={{ ...styles.rowCell, flex: 2.2, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={styles.avatar}>{patient.avatar}</div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={styles.nameText}>{patient.name}</span>
                                        <span style={styles.idText}>ID: {1000 + patient.id}</span>
                                    </div>
                                </div>

                                <VitalCell value={`${patient.hr} bpm`} trend={patient.hrTrend} />
                                <VitalCell value={`${patient.spo2}%`} trend={patient.spo2Trend} />
                                <div style={styles.rowCell}>{patient.temp}°C</div>

                                <div style={styles.rowCell}>
                                    <StatusBadge status={patient.status} />
                                </div>
                                <div style={styles.rowCell}>
                                    {freshness.isOffline ? (
                                        <span style={styles.offlineBadge}>OFFLINE</span>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: freshness.color }} />
                                            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{freshness.text}</span>
                                        </div>
                                    )}
                                </div>
                                <div style={{ ...styles.rowCell, display: 'flex' }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onNavigate('patient-detail', patient.id); }}
                                        style={styles.actionButtonPrimary}
                                    >
                                        Details
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                {filteredPatients.length === 0 && (
                    <div style={styles.emptyState}>No patients found matching your search.</div>
                )}
            </div>
        </motion.div>
    );
};

// Helper component for Vital signs with trends
const VitalCell = ({ value, trend }) => (
    <div style={styles.rowCell}>
        <div>{value}</div>
        {trend && trend.dir !== 'stable' && (
            <div style={{
                fontSize: '0.75rem',
                color: trend.dir === 'up' && trend.val > 0 ? '#D93025' : (trend.val > 0 ? '#1E8E3E' : '#666'), // Red if up (bad for HR usually, simplified here) - actually let's keep it neutral or context aware. 
                // Simple logic: Highlight changes.
                display: 'flex', alignItems: 'center', gap: '2px', opacity: 0.8
            }}>
                <span>{trend.dir === 'up' ? '↑' : '↓'}</span>
                <span>{trend.val}</span>
            </div>
        )}
    </div>
);

const StatusBadge = ({ status }) => {
    let style = styles.badgeNormal;
    let isCritical = false;

    if (status === 'Warning') style = styles.badgeWarning;
    if (status === 'Critical') {
        style = styles.badgeCritical;
        isCritical = true;
    }

    return (
        <span style={style}>
            {isCritical && <span style={styles.dot}></span>}
            {status}
        </span>
    );
};

const styles = {
    container: {
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border-color)',
        padding: '0', // Full flush
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    headerRow: {
        display: 'flex',
        padding: 'var(--spacing-md) var(--spacing-lg)',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--color-bg-subtle)', // Should be #F9F9F9 per vars
    },
    cell: {
        flex: 1,
        fontSize: '0.75rem',
        color: 'var(--color-text-secondary)',
        fontWeight: 'var(--font-weight-bold)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--spacing-md) var(--spacing-lg)',
        borderBottom: '1px solid var(--border-color)', // Separators
        cursor: 'default', // Actions define interaction
        transition: 'background-color 0.2s',
    },
    rowCell: {
        flex: 1,
        fontSize: '0.9rem',
        color: 'var(--color-text-primary)',
        fontWeight: 'var(--font-weight-medium)',
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#E0E0E0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: '#555',
    },
    nameText: {
        fontWeight: 'var(--font-weight-bold)',
        color: 'var(--color-text-primary)',
    },
    idText: {
        fontSize: '0.75rem',
        color: 'var(--color-text-tertiary)',
    },
    badgeNormal: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '100px',
        backgroundColor: '#E6F4EA', // Keep semantic soft green
        color: '#1E8E3E',
        fontSize: '0.75rem',
        fontWeight: '600',
    },
    badgeWarning: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '100px',
        backgroundColor: '#FEF7E0', // Keep semantic soft orange
        color: '#B06000',
        fontSize: '0.75rem',
        fontWeight: '600',
    },
    badgeCritical: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '100px',
        backgroundColor: '#FCE8E6', // Keep semantic soft red
        color: '#D93025',
        fontSize: '0.75rem',
        fontWeight: '700',
        border: '1px solid rgba(217, 48, 37, 0.2)'
    },
    dot: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
    offlineBadge: {
        fontSize: '0.7rem',
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#9aa0a6',
        padding: '2px 6px',
        borderRadius: '4px',
    },
    actionButtonPrimary: {
        backgroundColor: 'var(--color-primary)', // Solid primary as requested for primary actions, or outline? "Primary button style: Background: #0092CA Text: white". 
        // Wait, "View Details" is a primary action per row? The initial design had "Details" as outline and "Alerts" as secondary.
        // User said "Primary actions... Use #0092CA... Primary button style: Background #...". 
        // Let's make "Details" the solid primary button.
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '6px',
        padding: '6px 12px',
        fontSize: '0.8rem',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.2s',
    },
    actionButtonSecondary: {
        backgroundColor: 'transparent',
        color: 'var(--color-primary)', // Link/interactive text color
        border: '1px solid var(--color-primary)', // Outline style for secondary/tertiary
        borderRadius: '6px',
        padding: '5px 11px', // Accounting for border
        fontSize: '0.8rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    emptyState: {
        padding: 'var(--spacing-xl)',
        textAlign: 'center',
        color: 'var(--color-text-secondary)',
    }
};

export default PatientList;

