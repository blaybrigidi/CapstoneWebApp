import React, { useState, useEffect } from 'react';
import LiveVitalCard from './LiveVitalCard';
import VitalHistoryChart from './VitalHistoryChart';
import { api } from '../services/api';
import { generatePatientReport } from '../services/pdfService';
// import { useParams } from 'react-router-dom'; // Removed as we use prop
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, FileText, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { Skeleton } from "@/components/ui/skeleton";

const RiskStatusCard = ({ risk, anomalyScore }) => {
    const getRiskConfig = (riskLevel) => {
        switch (riskLevel) {
            case 'stable':
                return { color: 'bg-green-500', label: 'Stable', icon: <CheckCircle className="h-6 w-6" />, textColor: 'text-white' };
            case 'warning':
                return { color: 'bg-yellow-500', label: 'Warning', icon: <AlertTriangle className="h-6 w-6" />, textColor: 'text-white' };
            case 'high_risk':
                return { color: 'bg-red-500', label: 'High Risk', icon: <AlertTriangle className="h-6 w-6" />, textColor: 'text-white' };
            default:
                return { color: 'bg-gray-400', label: 'Unknown', icon: <Activity className="h-6 w-6" />, textColor: 'text-white' };
        }
    };

    const config = getRiskConfig(risk);

    return (
        <Card className={`${config.color} border-none shadow-md`}>
            <CardContent className={`flex flex-col items-center justify-center p-6 ${config.textColor}`}>
                <div className="flex items-center gap-2 mb-2">
                    {config.icon}
                    <h3 className="text-xl font-bold">{config.label}</h3>
                </div>
                <p className="text-sm opacity-90 font-medium text-center">Glucose Instability Risk</p>
                <div className="mt-4 text-center">
                    <span className="text-3xl font-extrabold">{(anomalyScore * 100).toFixed(1)}%</span>
                    <p className="text-xs opacity-75">Confidence Score</p>
                </div>
                <p className="text-xs mt-4 opacity-75">Prediction Horizon: 30 mins</p>
            </CardContent>
        </Card>
    );
};

const PatientDetail = ({ onNavigate, patientId }) => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getVitalStatus = (type, value) => {
        if (!value || value === '--') return 'Unknown';
        if (type === 'hr') {
            if (value > 100 || value < 60) return 'Abnormal';
        }
        if (type === 'spo2') {
            if (value < 95) return 'Abnormal';
        }
        return 'Normal';
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!patientId) return;
            try {
                const data = await api.getPatient(patientId);

                // Initial Patient State
                setPatient({
                    name: `${data.firstName} ${data.lastName}`,
                    id: data.id,
                    status: data.status || 'Normal',
                    vitals: {
                        hr: { value: '--', unit: 'bpm', status: 'Unknown' },
                        spo2: { value: '--', unit: '%', status: 'Unknown' },
                        temp: { value: '--', unit: '°C', status: 'Unknown' },
                        hrv: { value: '--', unit: 'ms', status: 'Unknown' }
                    },
                    ml: {
                        risk: 'stable',
                        score: 0.0
                    }
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching patient details:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchInitialData();

        // Real-time listener for vitals and ML predictions
        const unsubscribe = api.subscribeToVitals(patientId, (data) => {
            setPatient(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    vitals: {
                        hr: {
                            value: data.heart_rate || '--',
                            unit: 'bpm',
                            status: getVitalStatus('hr', data.heart_rate)
                        },
                        spo2: {
                            value: data.spo2 || '--',
                            unit: '%',
                            status: getVitalStatus('spo2', data.spo2)
                        },
                        temp: {
                            value: data.temperature || '--',
                            unit: '°C',
                            status: 'Normal'
                        },
                        hrv: {
                            value: data.hrv_rmssd || '--',
                            unit: 'ms',
                            status: 'Normal'
                        }
                    },
                    ml: {
                        risk: data.instability_risk || 'stable',
                        score: data.anomaly_score || 0
                    }
                };
            });
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [patientId]);

    const handleDownloadPDF = async () => {
        if (!patient) return;
        try {
            // Fetch updated 24h history for the report
            const history = await api.getVitalHistory(patient.id, '24h');
            // Sort descenting for the table? usually ascending or descending. 
            // Let's do descending (newest first) for the table
            history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            await generatePatientReport(patient, history);
        } catch (err) {
            console.error("Failed to generate PDF:", err);
            // Could add toast here
        }
    };

    if (loading) {
        return (
            <div className="ml-[280px] p-8 min-h-screen max-w-[1400px]">
                <div className="flex flex-col gap-4 mb-10">
                    <Skeleton className="h-6 w-32" />
                    <div className="flex items-baseline gap-4">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Skeleton className="h-40 rounded-xl" />
                    <Skeleton className="h-40 rounded-xl" />
                    <Skeleton className="h-40 rounded-xl" />
                    <Skeleton className="h-40 rounded-xl" />
                </div>
                <Skeleton className="h-[500px] rounded-xl" />
            </div>
        );
    }

    if (!patient) {
        return <div className="ml-[280px] p-10 text-destructive font-medium">Patient not found</div>;
    }

    return (
        <main
            className="ml-[280px] p-8 min-h-screen max-w-[1400px]"
        >
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="flex flex-col gap-2">
                    <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground p-0 h-auto font-medium"
                        onClick={() => onNavigate('dashboard')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Button>
                    <div className="flex items-baseline gap-4 mt-2">
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{patient.name}</h1>
                        <span className="text-lg text-muted-foreground font-medium">ID: {patient.id}</span>
                        {patient.status === 'Critical' && (
                            <Badge variant="destructive" className="text-sm px-3 py-1">CRITICAL</Badge>
                        )}
                    </div>
                </div>
                <Button
                    className="rounded-full shadow-lg"
                    size="lg"
                    onClick={handleDownloadPDF}
                >
                    <FileText className="mr-2 h-4 w-4" /> Generate PDF Report
                </Button>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                    label="Body Temp"
                    value={patient.vitals.temp.value}
                    unit={patient.vitals.temp.unit}
                    status={patient.vitals.temp.status}
                />
                {/* ML Prediction Card */}
                <RiskStatusCard risk={patient.ml.risk} anomalyScore={patient.ml.score} />
            </section>

            {/* Historical Trends */}
            <section className="h-[500px]">
                <VitalHistoryChart patientId={patient.id} />
            </section>

        </main>
    );
};

export default PatientDetail;


