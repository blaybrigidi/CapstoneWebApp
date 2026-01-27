import React from 'react';
import SummaryCard from './SummaryCard';

const Dashboard = () => {
    const stats = [
        { title: 'Active Patients', value: '142', subtext: '+4 since yesterday', type: 'normal' },
        { title: 'Critical Alerts', value: '3', subtext: 'Requires immediate attention', type: 'alert' },
        { title: 'Warnings Today', value: '12', subtext: 'Blood pressure anomalies', type: 'warning' },
        { title: 'Reports Pending', value: '8', subtext: 'Review needed by Friday', type: 'normal' },
    ];

    return (
        <main style={styles.main}>
            <header style={styles.header}>
                <h1 style={styles.title}>Patient Overview</h1>
                <div style={styles.actions}>
                    {/* Minimalist action */}
                    <button style={styles.buttonPrimary}>+ New Patient</button>
                </div>
            </header>

            <section style={styles.grid}>
                {stats.map((stat, index) => (
                    <div key={index} style={styles.gridItem}>
                        <SummaryCard
                            title={stat.title}
                            value={stat.value}
                            subtext={stat.subtext}
                            type={stat.type}
                        />
                    </div>
                ))}
            </section>

            {/* Bento box placeholder content */}
            <section style={styles.bentoSection}>
                <div style={styles.bentoCardLarge}>
                    <h3 style={styles.cardTitle}>Activity Feed</h3>
                    <p style={styles.cardEmpty}>No recent activity to display.</p>
                </div>
                <div style={styles.bentoCardSmall}>
                    <h3 style={styles.cardTitle}>System Status</h3>
                    <div style={styles.statusIndicator}>
                        <span style={styles.dot}></span> All Systems Operational
                    </div>
                </div>
            </section>
        </main>
    );
};

const styles = {
    main: {
        marginLeft: '280px',
        padding: 'var(--spacing-xl)', /* Generous padding */
        minHeight: '100vh',
        maxWidth: '1400px', /* Constrain width on large screens */
    },
    header: {
        marginTop: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)', /* Huge whitespace */
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    title: {
        fontSize: '3.5rem', /* Very large, Swiss style */
        fontWeight: 'var(--font-weight-heavy)',
        letterSpacing: '-0.04em',
        lineHeight: '1.1',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-md)', /* Tight gap between rows for bento feel */
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
        backgroundColor: 'var(--color-bg-subtle)', /* Off-white differentiation */
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
        borderRadius: '100px', /* Pill shape */
        fontWeight: 'var(--font-weight-medium)',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'opacity 0.2s',
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
        backgroundColor: '#34C759', /* Subtle green for status */
    }
};

export default Dashboard;
