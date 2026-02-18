import React from 'react';

const RecentActivity = ({ onNavigate }) => {
    const activities = [
        { id: 1, text: "Nana Kwadwo marked Critical", time: "2 min ago", type: "critical", link: { view: 'patient-detail', id: 3 } },
        { id: 2, text: "New alert for Chris Lamptey", time: "5 min ago", type: "warning", link: { view: 'alerts', id: 2 } },
        { id: 3, text: "Dr. Blay reviewed active reports", time: "15 min ago", type: "info" },
        { id: 4, text: "System maintenance scheduled", time: "1 hour ago", type: "info" },
    ];

    return (
        <div style={styles.container}>
            <h3 style={styles.header}>Recent Activity</h3>
            <div style={styles.list}>
                {activities.map((activity, index) => (
                    <div
                        key={activity.id}
                        style={styles.item}
                        onClick={() => activity.link && onNavigate(activity.link.view, activity.link.id)}
                    >
                        <div style={styles.dotContainer}>
                            <div style={{
                                ...styles.dot,
                                backgroundColor: activity.type === 'critical' ? '#D93025' :
                                    activity.type === 'warning' ? '#F9AB00' : '#1a73e8'
                            }} />
                            {index !== activities.length - 1 && <div style={styles.line} />}
                        </div>
                        <div style={styles.content}>
                            <p style={styles.text}>{activity.text}</p>
                            <span style={styles.time}>{activity.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        padding: 'var(--spacing-md)',
        height: '100%',
    },
    header: {
        fontSize: '0.9rem',
        fontWeight: 'var(--font-weight-bold)',
        marginBottom: 'var(--spacing-md)',
        color: 'var(--color-text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    item: {
        display: 'flex',
        gap: '12px',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
    },
    dotContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '6px',
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        flexShrink: 0,
    },
    content: {
        fontSize: '0.85rem',
    },
    text: {
        margin: '0 0 2px 0',
        color: 'var(--color-text-primary)',
        lineHeight: '1.4',
    },
    time: {
        fontSize: '0.75rem',
        color: 'var(--color-text-tertiary)',
    },
};

export default RecentActivity;
