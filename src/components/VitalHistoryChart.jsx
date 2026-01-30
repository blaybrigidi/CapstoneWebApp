import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const generateData = () => {
    const data = [];
    for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            hr: Math.floor(Math.random() * (120 - 60) + 60),
            spo2: Math.floor(Math.random() * (100 - 90) + 90),
            temp: parseFloat((Math.random() * (38 - 36) + 36).toFixed(1)),
        });
    }
    return data;
};

const data = generateData();

const VitalHistoryChart = () => {
    const [activeMetric, setActiveMetric] = useState('hr');

    const metrics = {
        hr: { label: 'Heart Rate', color: '#0056b3', unit: 'bpm', domain: [40, 140] },
        spo2: { label: 'SpO2', color: '#008b8b', unit: '%', domain: [85, 100] },
        temp: { label: 'Temperature', color: '#e67300', unit: '°C', domain: [35, 41] },
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={styles.tooltip}>
                    <p style={styles.tooltipLabel}>{label}</p>
                    <p style={styles.tooltipValue}>
                        {`${payload[0].value} ${metrics[activeMetric].unit}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>Historical Trends</h3>
                <div style={styles.toggles}>
                    <button
                        style={activeMetric === 'hr' ? styles.activeToggle : styles.toggle}
                        onClick={() => setActiveMetric('hr')}
                    >
                        Heart Rate
                    </button>
                    <button
                        style={activeMetric === 'spo2' ? styles.activeToggle : styles.toggle}
                        onClick={() => setActiveMetric('spo2')}
                    >
                        SpO2
                    </button>
                    <button
                        style={activeMetric === 'temp' ? styles.activeToggle : styles.toggle}
                        onClick={() => setActiveMetric('temp')}
                    >
                        Temp
                    </button>
                </div>
            </div>

            <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        key={activeMetric} // Force re-mount for smooth transition of axis
                        data={data}
                        margin={{ top: 10, right: 0, left: 0, bottom: 60 }}
                    >
                        <defs>
                            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={metrics[activeMetric].color} stopOpacity={0.1} />
                                <stop offset="95%" stopColor={metrics[activeMetric].color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#E5E5E5" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#999' }}
                            minTickGap={30}
                            height={50}
                            tickMargin={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#999' }}
                            domain={metrics[activeMetric].domain}
                            width={30} // Fixed width to align grid
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey={activeMetric}
                            stroke={metrics[activeMetric].color}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorMetric)"
                            animationDuration={800}
                            animationEasing="ease-in-out"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        padding: 'var(--spacing-lg)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-lg)',
    },
    title: {
        fontSize: '1rem',
        fontWeight: 'var(--font-weight-bold)',
        color: 'var(--color-text-primary)',
        margin: 0,
    },
    toggles: {
        display: 'flex',
        gap: '4px',
        backgroundColor: 'var(--color-bg-subtle)',
        padding: '4px',
        borderRadius: '8px',
    },
    toggle: {
        border: 'none',
        backgroundColor: 'transparent',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '0.8rem',
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.2s',
    },
    activeToggle: {
        border: 'none',
        backgroundColor: 'var(--color-bg-surface)',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '0.8rem',
        color: 'var(--color-text-primary)',
        cursor: 'pointer',
        fontWeight: '600',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    chartContainer: {
        flex: 1,
        minHeight: '300px',
        overflow: 'hidden', /* Ensure content stays within borders */
    },
    tooltip: {
        backgroundColor: '#1A1A1A',
        padding: '8px 12px',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    tooltipLabel: {
        margin: 0,
        fontSize: '0.75rem',
        color: '#888',
        marginBottom: '4px',
    },
    tooltipValue: {
        margin: 0,
        fontSize: '0.9rem',
        color: '#FFF',
        fontWeight: 'bold',
    }

};

export default VitalHistoryChart;
