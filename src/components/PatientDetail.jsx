import React from 'react';
import { motion } from 'framer-motion';
import LiveVitalCard from './LiveVitalCard';
import VitalHistoryChart from './VitalHistoryChart';

const PatientDetail = ({ onNavigate, patientId }) => {
    // Mock data - in a real app this would fetch based on patientId
    const patient = {
        name: 'James Howlett',
        id: 'PT-X092',
        vitals: {
            hr: { value: 110, unit: 'bpm', status: 'Abnormal' },
            spo2: { value: 92, unit: '%', status: 'Abnormal' },
            temp: { value: 38.5, unit: '°C', status: 'Abnormal' }
        }
    };

    return (
        <motion.main
            style={styles.main}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
        >
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <button onClick={() => onNavigate('dashboard')} style={styles.backButton}>
                        ← Back to Dashboard
                    </button>
                    <div style={styles.patientInfo}>
                        <h1 style={styles.patientName}>{patient.name}</h1>
                        <span style={styles.patientId}>ID: {patient.id}</span>
                    </div>
                </div>
                <button style={styles.pdfButton}>
                    Generate PDF Report
                </button>
            </header>

            <section style={styles.vitalsGrid}>
                <LiveVitalCard
                    label="Heart Rate"
                    value={patient.vitals.hr.value}
                    unit={patient.vitals.hr.unit}
                    status={patient.vitals.hr.status}
                />
                <LiveVitalCard
                    label="Blood Oxygen"
                    value={patient.vitals.spo2.value}
                    unit={patient.vitals.spo2.unit}
                    status={patient.vitals.spo2.status}
                />
                <LiveVitalCard
                    label="Body Temperature"
                    value={patient.vitals.temp.value}
                    unit={patient.vitals.temp.unit}
                    status={patient.vitals.temp.status}
                />
            </section>

            {/* Historical Trends */}
            <section style={styles.historySection}>
                <VitalHistoryChart />
            </section>

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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-xl)',
    },
    headerLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
    },
    backButton: {
        background: 'none',
        border: 'none',
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
        fontSize: '0.9rem',
        padding: 0,
        textAlign: 'left',
        fontWeight: 'var(--font-weight-medium)',
        width: 'fit-content',
    },
    patientInfo: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 'var(--spacing-md)',
    },
    patientName: {
        fontSize: '2.5rem',
        fontWeight: 'var(--font-weight-heavy)',
        letterSpacing: '-0.03em',
    },
    patientId: {
        fontSize: '1.2rem',
        color: 'var(--color-text-secondary)',
        fontWeight: 'var(--font-weight-medium)',
    },
    pdfButton: {
        backgroundColor: 'var(--color-text-primary)',
        color: '#FFF',
        border: 'none',
        padding: '0.8rem 1.6rem',
        borderRadius: '100px',
        fontWeight: 'var(--font-weight-medium)',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'opacity 0.2s',
    },
    vitalsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)',
    },
    historySection: {
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        padding: 'var(--spacing-lg)',
        backgroundColor: 'var(--color-bg-subtle)',
        height: '400px', // Fixed height for the chart container
    },
};

export default PatientDetail;


