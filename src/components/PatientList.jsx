import React from 'react';
import { motion } from 'framer-motion';

const PatientList = ({ onNavigate }) => {
    const patients = [
        { id: 1, name: 'Alex Morgan', hr: '72 bpm', spo2: '98%', temp: '36.5°C', status: 'Normal', lastUpdate: '2 min ago', avatar: 'AM' },
        { id: 2, name: 'Sarah Connor', hr: '85 bpm', spo2: '96%', temp: '37.1°C', status: 'Warning', lastUpdate: '5 min ago', avatar: 'SC' },
        { id: 3, name: 'James Howlett', hr: '110 bpm', spo2: '92%', temp: '38.5°C', status: 'Critical', lastUpdate: 'Just now', avatar: 'JH' },
        { id: 4, name: 'Diana Prince', hr: '65 bpm', spo2: '99%', temp: '36.2°C', status: 'Normal', lastUpdate: '10 min ago', avatar: 'DP' },
        { id: 5, name: 'Bruce Wayne', hr: '92 bpm', spo2: '95%', temp: '37.0°C', status: 'Warning', lastUpdate: '15 min ago', avatar: 'BW' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
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
                <div style={{ ...styles.cell, flex: 2 }}>PATIENT NAME</div>
                <div style={styles.cell}>HEART RATE</div>
                <div style={styles.cell}>SpO2</div>
                <div style={styles.cell}>TEMP</div>
                <div style={styles.cell}>STATUS</div>
                <div style={styles.cell}>LAST UPDATE</div>
                <div style={styles.cell}>ACTION</div>
            </div>

            <div style={styles.list}>
                {patients.map((patient) => (
                    <motion.div
                        key={patient.id}
                        style={{ ...styles.row, border: '1px solid transparent' }} // Add transparent border to prevent layout shift
                        variants={itemVariants}
                        layout
                        whileHover={{
                            scale: 1.01,
                            backgroundColor: 'var(--color-bg-subtle)',
                            borderColor: 'var(--color-text-primary)', // Transition to black
                            zIndex: 1,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            transition: { duration: 0.3 } // 0.3s transition
                        }}
                    >
                        <div style={{ ...styles.rowCell, flex: 2, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={styles.avatar}>{patient.avatar}</div>
                            <span style={styles.nameText}>{patient.name}</span>
                        </div>
                        <div style={styles.rowCell}>{patient.hr}</div>
                        <div style={styles.rowCell}>{patient.spo2}</div>
                        <div style={styles.rowCell}>{patient.temp}</div>
                        <div style={styles.rowCell}>
                            <StatusBadge status={patient.status} />
                        </div>
                        <div style={styles.rowCell}>{patient.lastUpdate}</div>
                        <div style={styles.rowCell}>
                            <button onClick={() => onNavigate('patient-detail', patient.id)} style={styles.actionButton}>View Details</button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

const StatusBadge = ({ status }) => {
    let style = styles.badgeNormal;
    let isCritical = false;

    if (status === 'Warning') style = styles.badgeWarning;
    if (status === 'Critical') {
        style = styles.badgeCritical;
        isCritical = true;
    }

    return (
        <motion.span
            style={style}
            animate={isCritical ? {
                scale: [1, 1.05, 1],
                boxShadow: ['0 0 0px rgba(217, 48, 37, 0)', '0 0 4px rgba(217, 48, 37, 0.4)', '0 0 0px rgba(217, 48, 37, 0)']
            } : {}}
            transition={isCritical ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
        >
            {isCritical && <span style={styles.dot}></span>}
            {status}
        </motion.span>
    );
};

const styles = {
    container: {
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border-color)',
        padding: 'var(--spacing-lg)',
        overflow: 'hidden',
    },
    headerRow: {
        display: 'flex',
        padding: '0 var(--spacing-md) var(--spacing-sm) var(--spacing-md)',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: 'var(--spacing-xs)',
    },
    cell: {
        flex: 1,
        fontSize: '0.7rem',
        color: 'var(--color-text-tertiary)',
        fontWeight: 'var(--font-weight-bold)',
        letterSpacing: '0.05em',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px', // tiny gap for separateness
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--spacing-md)',
        borderRadius: '8px',
        backgroundColor: 'var(--color-bg-surface)', // ensure solid bg for hover lift
        cursor: 'pointer',
    },
    rowCell: {
        flex: 1,
        fontSize: '0.9rem',
        color: 'var(--color-text-primary)',
        fontWeight: 'var(--font-weight-medium)',
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#F0F0F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: '#666',
    },
    nameText: {
        fontWeight: 'var(--font-weight-bold)',
    },
    badgeNormal: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 8px',
        borderRadius: '100px',
        backgroundColor: '#E6F4EA', // Light green
        color: '#1E8E3E',
        fontSize: '0.75rem',
        fontWeight: '600',
    },
    badgeWarning: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 8px',
        borderRadius: '100px',
        backgroundColor: '#FEF7E0', // Light yellow/orange
        color: '#F9AB00',
        fontSize: '0.75rem',
        fontWeight: '600',
    },
    badgeCritical: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        borderRadius: '100px',
        backgroundColor: '#FCE8E6', // Light red
        color: '#D93025',
        fontSize: '0.75rem',
        fontWeight: '600',
    },
    dot: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
    actionButton: {
        backgroundColor: 'transparent',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        padding: '4px 12px',
        fontSize: '0.75rem',
        cursor: 'pointer',
        color: 'var(--color-text-secondary)',
        transition: 'all 0.2s',
    },
};

export default PatientList;
