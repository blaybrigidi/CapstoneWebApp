import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const VitalHistoryChart = ({ patientId }) => {
    const [activeMetric, setActiveMetric] = useState('hr');
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!patientId) return;
            try {
                // Fetch 24h history
                const response = await api.getVitals(patientId, '24h');

                // Filter by active metric type
                const metricTypeMap = {
                    'hr': 'HEART_RATE',
                    'spo2': 'SPO2',
                    'temp': 'TEMPERATURE'
                };

                const filtered = response.filter(v => v.type === metricTypeMap[activeMetric]);

                // Sort by timestamp ascending
                filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                // Map to chart format
                const mapped = filtered.map(v => ({
                    date: new Date(v.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    [activeMetric]: v.value,
                    originalTimestamp: v.timestamp
                }));

                setChartData(mapped);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching vital history:", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [patientId, activeMetric]);

    const metrics = {
        hr: { label: 'Heart Rate', color: '#0056b3', unit: 'bpm', domain: [40, 140] },
        spo2: { label: 'SpO2', color: '#008b8b', unit: '%', domain: [85, 100] },
        temp: { label: 'Temperature', color: '#e67300', unit: '°C', domain: [35, 41] },
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg border shadow-md text-sm">
                    <p className="font-medium mb-1 text-muted-foreground">{label}</p>
                    <p className="font-bold text-lg">
                        {`${payload[0].value} ${metrics[activeMetric].unit}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="h-full flex flex-col shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle className="text-lg font-semibold text-foreground">
                    Historical Trends
                </CardTitle>
                <div className="flex bg-muted p-1 rounded-lg gap-1">
                    {['hr', 'spo2', 'temp'].map((metric) => (
                        <button
                            key={metric}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeMetric === metric
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => setActiveMetric(metric)}
                        >
                            {metrics[metric].label}
                        </button>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="flex-1 min-h-[300px] w-full px-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        key={activeMetric}
                        data={chartData}
                        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={metrics[activeMetric].color} stopOpacity={0.1} />
                                <stop offset="95%" stopColor={metrics[activeMetric].color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                            minTickGap={30}
                            height={30}
                            tickMargin={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                            domain={metrics[activeMetric].domain}
                            width={30}
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
            </CardContent>
        </Card>
    );
};

export default VitalHistoryChart;
