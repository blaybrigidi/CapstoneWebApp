import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertsManagement = ({ filter }) => {
    // Mock Alerts Data
    const [alerts, setAlerts] = useState([
        { id: 1, type: 'critical', patient: 'James Howlett', vital: 'SpO2', value: '82%', time: '2 mins ago' },
        { id: 2, type: 'warning', patient: 'Sarah Connor', vital: 'Heart Rate', value: '145 bpm', time: '15 mins ago' },
        { id: 3, type: 'info', patient: 'System', vital: 'Calibration', value: 'Complete', time: '1 hour ago' },
        { id: 4, type: 'warning', patient: 'Ellen Ripley', vital: 'Temp', value: '38.2°C', time: '3 hours ago' },
        { id: 5, type: 'critical', patient: 'Bruce Wayne', vital: 'Heart Rate', value: '45 bpm', time: '4 hours ago' },
        { id: 6, type: 'info', patient: 'System', vital: 'Update', value: 'Patch v2.1', time: '5 hours ago' },
        { id: 7, type: 'warning', patient: 'Diana Prince', vital: 'BP', value: '140/90', time: '6 hours ago' },
        { id: 8, type: 'critical', patient: 'Tony Stark', vital: 'Battery', value: 'Low (5%)', time: '7 hours ago' },
    ]);

    const filteredAlerts = filter
        ? alerts.filter(a => a.type === filter.toLowerCase())
        : alerts;

    const handleResolve = (id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    // Threshold State (similar to Settings)
    const [thresholds, setThresholds] = useState({
        hrMin: 60,
        hrMax: 100,
        spo2Min: 95,
        tempMax: 37.5
    });

    const [channels, setChannels] = useState({
        web: true,
        mobile: true,
        sms: false
    });

    const handleChange = (name, value) => {
        setThresholds(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChannelToggle = (channel) => {
        setChannels(prev => ({
            ...prev,
            [channel]: !prev[channel]
        }));
    };

    const handleSave = () => {
        alert('Threshold configurations saved.');
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <motion.main
            style={styles.main}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            variants={containerVariants}
        >
            <header style={styles.header}>
                <h1 style={styles.title}>Alerts & Thresholds</h1>
                <p style={styles.subtitle}>Monitor live incidents and configure safety triggers.</p>
            </header>

            <div style={styles.bentoGrid}>
                {/* Left Panel - Live Alert Feed (60%) */}
                <motion.section style={styles.feedPanel} variants={itemVariants}>
                    <h2 style={styles.panelTitle}>Live Alert Feed</h2>
                    <div style={styles.feedList}>
                        <AnimatePresence mode='popLayout'>
                            {filteredAlerts.map(alert => (
                                <motion.div
                                    key={alert.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                                    transition={{ duration: 0.3 }}
                                    style={styles.alertCard}
                                >
                                    <div style={styles.cardHeader}>
                                        <div style={styles.patientInfo}>
                                            {/* Visual Cue */}
                                            <div style={styles.statusIndicator}>
                                                {alert.type === 'critical' && (
                                                    <span className="pulse-dot-critical" style={styles.pulseDotCritical}></span>
                                                )}
                                                {alert.type === 'warning' && (
                                                    <span style={styles.dotWarning}></span>
                                                )}
                                                <span style={styles.patientName}>{alert.patient}</span>
                                            </div>
                                            <span style={styles.time}>{alert.time}</span>
                                        </div>
                                        <button
                                            onClick={() => handleResolve(alert.id)}
                                            style={styles.resolveButton}
                                        >
                                            Mark as Resolved
                                        </button>
                                    </div>
                                    <div style={styles.cardContent}>
                                        <div style={styles.vitalRow}>
                                            <span style={styles.vitalLabel}>{alert.vital}</span>
                                            <span style={styles.vitalValue}>{alert.value}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.section>

                {/* Right Panel - Threshold Configuration (40%) */}
                <motion.section style={styles.configPanel} variants={itemVariants}>
                    <h2 style={styles.panelTitle}>Threshold Configuration</h2>
                    <div style={styles.formContainer}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Heart Rate (bpm)</label>
                            <div style={styles.row}>
                                <NumberStepper
                                    value={thresholds.hrMin}
                                    onChange={(val) => handleChange('hrMin', val)}
                                    label="Min"
                                    min={30}
                                    max={90}
                                />
                                <NumberStepper
                                    value={thresholds.hrMax}
                                    onChange={(val) => handleChange('hrMax', val)}
                                    label="Max"
                                    min={90}
                                    max={200}
                                />
                            </div>
                            <span style={styles.caption}>Normal Resting: 60-100 BPM</span>
                        </div>

                        <div style={styles.divider}></div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Blood Oxygen (%)</label>
                            <NumberStepper
                                value={thresholds.spo2Min}
                                onChange={(val) => handleChange('spo2Min', val)}
                                label="Min SpO2"
                                min={80}
                                max={100}
                            />
                            <span style={styles.caption}>Target Range: &gt;95%</span>
                        </div>

                        <div style={styles.divider}></div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Body Temperature (°C)</label>
                            <NumberStepper
                                value={thresholds.tempMax}
                                onChange={(val) => handleChange('tempMax', val)}
                                label="Max Temp"
                                step={0.1}
                                min={35}
                                max={42}
                            />
                            <span style={styles.caption}>Normal Range: 36.5-37.5°C</span>
                        </div>

                        <div style={styles.divider}></div>

                        {/* Notification Channels Section */}
                        <div style={styles.channelsSection}>
                            <h3 style={styles.groupTitle}>Notification Channels</h3>
                            <div style={styles.channelList}>
                                <div style={styles.channelItem}>
                                    <span style={styles.channelLabel}>Web Dashboard</span>
                                    <Switch isOn={channels.web} onToggle={() => handleChannelToggle('web')} />
                                </div>
                                <div style={styles.channelItem}>
                                    <span style={styles.channelLabel}>Patient Mobile App</span>
                                    <Switch isOn={channels.mobile} onToggle={() => handleChannelToggle('mobile')} />
                                </div>
                                <div style={styles.channelItem}>
                                    <span style={styles.channelLabel}>Emergency SMS</span>
                                    <Switch isOn={channels.sms} onToggle={() => handleChannelToggle('sms')} />
                                </div>
                            </div>
                        </div>

                        <div style={styles.divider}></div>

                        {/* Anomaly Detection Section */}
                        <div style={styles.anomalySection}>
                            <div style={styles.sectionHeader}>
                                <h3 style={styles.groupTitle}>Anomaly Detection Sensitivity</h3>
                                <InfoTooltip text="Adjusts the Isolation Forest algorithm sensitivity for identifying statistical outliers in patient data" />
                            </div>
                            <SegmentControl
                                options={['Stable', 'Balanced', 'High Sensitivity']}
                                value={thresholds.sensitivity || 'Balanced'}
                                onChange={(val) => handleChange('sensitivity', val)}
                            />
                        </div>

                        <button style={styles.saveButton} onClick={handleSave}>
                            Update Triggers
                        </button>
                    </div>
                </motion.section>
            </div>
        </motion.main>
    );
};

const SegmentControl = ({ options, value, onChange }) => {
    return (
        <div style={segmentStyles.container}>
            {options.map((option) => {
                const isActive = value === option;
                return (
                    <motion.div
                        key={option}
                        style={segmentStyles.segment}
                        onClick={() => onChange(option)}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="segmentIndicator"
                                style={segmentStyles.indicator}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <span style={{
                            ...segmentStyles.label,
                            color: isActive ? '#FFF' : 'var(--color-text-secondary)', // Text turns white when active
                            fontWeight: isActive ? 600 : 500,
                            position: 'relative', // Ensure text is above indicator
                            zIndex: 2
                        }}>
                            {option}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
};

const InfoTooltip = ({ text }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            style={tooltipStyles.container}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            <div style={tooltipStyles.icon}>i</div>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        style={tooltipStyles.tooltip}
                    >
                        {text}
                        <div style={tooltipStyles.arrow} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Component Styles
const segmentStyles = {
    container: {
        display: 'flex',
        backgroundColor: 'var(--color-bg-subtle)',
        borderRadius: '8px',
        padding: '4px',
        position: 'relative',
        cursor: 'pointer',
    },
    segment: {
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 4px',
        zIndex: 1,
    },
    indicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000', // Black background for active state
        borderRadius: '6px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        zIndex: 1, // Below text but above segment bg
    },
    label: {
        fontSize: '0.8rem',
        zIndex: 1,
        textAlign: 'center',
        transition: 'color 0.2s',
    }
};

const tooltipStyles = {
    container: {
        position: 'relative',
        cursor: 'help',
        marginLeft: '4px',
    },
    icon: {
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        border: '1px solid var(--color-text-tertiary)',
        color: 'var(--color-text-tertiary)',
        fontSize: '0.7rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    tooltip: {
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '8px',
        backgroundColor: '#000',
        color: '#FFF',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '0.75rem',
        width: '200px',
        textAlign: 'center',
        zIndex: 10,
        pointerEvents: 'none',
    },
    arrow: {
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        borderWidth: '4px',
        borderStyle: 'solid',
        borderColor: '#000 transparent transparent transparent',
    }
};

const Switch = ({ isOn, onToggle }) => {
    return (
        <motion.div
            style={{
                ...switchStyles.container,
                backgroundColor: isOn ? '#000' : '#FFF',
                borderColor: isOn ? '#000' : '#E0E0E0',
            }}
            onClick={onToggle}
            whileTap={{ scale: 0.95 }}
            animate={{
                backgroundColor: isOn ? '#000' : '#FFF',
                borderColor: isOn ? '#000' : '#E0E0E0',
            }}
            transition={{ duration: 0.2 }} // 200ms fade
        >
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                    ...switchStyles.handle,
                    backgroundColor: '#FFF',
                    boxShadow: isOn ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
                    x: isOn ? 22 : 2, // Simple x offset toggle behavior
                }}
            />
        </motion.div>
    );
};

// Switch Styles
const switchStyles = {
    container: {
        width: '48px',
        height: '26px',
        borderRadius: '50px',
        border: '1px solid', // Color set inline
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '0',
        position: 'relative',
        transition: 'background-color 0.2s, border-color 0.2s',
    },
    handle: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        position: 'absolute',
        top: '2px',
        // left: handled by x prop in motion.div
    }
};

const NumberStepper = ({ value, onChange, label, step = 1, min, max }) => {
    const handleDecrement = () => {
        const newValue = Math.max(min || -Infinity, parseFloat((value - step).toFixed(1)));
        onChange(newValue);
    };

    const handleIncrement = () => {
        const newValue = Math.min(max || Infinity, parseFloat((value + step).toFixed(1)));
        onChange(newValue);
    };

    return (
        <div style={stepperStyles.container}>
            <button onClick={handleDecrement} style={stepperStyles.button}>-</button>
            <div style={stepperStyles.valueContainer}>
                <span style={stepperStyles.value}>{value}</span>
                {label && <span style={stepperStyles.label}>{label}</span>}
            </div>
            <button onClick={handleIncrement} style={stepperStyles.button}>+</button>
        </div>
    );
};

const stepperStyles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--color-bg-subtle)',
        borderRadius: '24px', // Pill shape
        padding: '4px',
        border: '1px solid var(--border-color)',
        minWidth: '120px',
        flex: 1,
    },
    button: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        border: '1px solid #E0E0E0',
        backgroundColor: '#fff',
        color: 'var(--color-text-primary)',
        fontSize: '1.1rem',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
    },
    valueContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: 1,
    },
    value: {
        fontSize: '1rem',
        fontWeight: '600',
        color: 'var(--color-text-primary)',
    },
    label: {
        fontSize: '0.65rem',
        color: 'var(--color-text-tertiary)',
        marginTop: '2px',
        textTransform: 'uppercase',
    }
};

const styles = {
    main: {
        marginLeft: '280px',
        padding: 'var(--spacing-xl)',
        minHeight: '100vh',
    },
    header: {
        marginBottom: 'var(--spacing-xl)',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: 'var(--font-weight-heavy)',
        letterSpacing: '-0.03em',
        marginBottom: 'var(--spacing-xs)',
        color: 'var(--color-text-on-brand)', // White
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.8)', // White opacity
        fontSize: '1rem',
    },
    bentoGrid: {
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr', // Roughly 60/40
        gap: 'var(--spacing-lg)',
        height: 'calc(100vh - 200px)', // Occupy remaining height
        minHeight: '500px',
    },
    feedPanel: {
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        padding: 'var(--spacing-lg)',
        display: 'flex',
        flexDirection: 'column',
    },
    configPanel: {
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        padding: 'var(--spacing-lg)',
        display: 'flex',
        flexDirection: 'column',
    },
    panelTitle: {
        fontSize: '1.1rem',
        fontWeight: 'var(--font-weight-bold)',
        marginBottom: 'var(--spacing-lg)',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: 'var(--spacing-md)',
    },
    feedList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
        overflowY: 'auto',
        paddingRight: '8px', // Space for scrollbar
    },
    alertCard: {
        padding: 'var(--spacing-lg)', // Significant internal padding
        border: '1px solid var(--border-color)', // 1px thin border
        borderRadius: '12px',
        backgroundColor: '#fff',
        boxShadow: 'none', // No shadow
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    patientInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    statusIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    pulseDotCritical: {
        width: '10px',
        height: '10px',
        backgroundColor: '#D93025', // Updated semantic red
        borderRadius: '50%',
        boxShadow: '0 0 0 0 rgba(217, 48, 37, 0.7)',
        animation: 'pulse-red 2s infinite',
    },
    dotWarning: {
        width: '10px',
        height: '10px',
        backgroundColor: '#F9AB00', // Updated semantic amber
        borderRadius: '50%',
    },
    patientName: {
        fontWeight: 'bold',
        fontSize: '1rem',
        color: 'var(--color-text-primary)',
    },
    time: {
        fontSize: '0.8rem',
        color: 'var(--color-text-tertiary)',
    },
    resolveButton: {
        background: 'none',
        border: 'none',
        color: 'var(--color-primary)', // Interactive text
        fontSize: '0.8rem',
        cursor: 'pointer',
        textDecoration: 'none', // Removed underline for cleaner look, or keep? Links usually have it or hover.
        padding: 0,
        fontWeight: '500',
        transition: 'color 0.2s',
    },
    cardContent: {
        display: 'flex',
    },
    vitalRow: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '8px',
    },
    vitalLabel: {
        fontSize: '0.9rem',
        color: 'var(--color-text-secondary)',
    },
    vitalValue: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: 'var(--color-text-primary)',
    },

    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    row: {
        display: 'flex',
        gap: 'var(--spacing-md)',
    },
    label: {
        fontSize: '0.85rem',
        color: 'var(--color-text-secondary)',
        fontWeight: '500',
    },
    input: {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid var(--border-color)',
        fontSize: '0.95rem',
        width: '100%',
        backgroundColor: 'var(--color-bg-subtle)',
        outline: 'none',
    },
    saveButton: {
        marginTop: 'auto',
        backgroundColor: '#000',
        color: '#FFF',
        border: 'none',
        padding: '12px',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    caption: {
        fontSize: '0.75rem',
        color: 'var(--color-text-tertiary)',
        marginTop: '4px',
        fontStyle: 'italic',
    },
    divider: {
        height: '1px',
        backgroundColor: 'var(--border-color)',
        margin: '2px 0',
    },
    channelsSection: {
        marginTop: 'var(--spacing-md)',
    },
    channelList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    channelItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
    },
    channelLabel: {
        fontSize: '0.9rem',
        color: 'var(--color-text-primary)',
        fontWeight: '500',
    },
    groupTitle: {
        fontSize: '1rem',
        fontWeight: 'var(--font-weight-bold)',
        marginBottom: '16px',
        color: 'var(--color-text-primary)',
    },
    anomalySection: {
        marginTop: 'var(--spacing-md)',
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '4px', // Adjusted to keep title close to header if needed
    }
};

export default AlertsManagement;
