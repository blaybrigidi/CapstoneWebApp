import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LiveVitalCard from './LiveVitalCard';
import VitalHistoryChart from './VitalHistoryChart';
import { api } from '../services/api';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, FileText, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PatientDetail = ({ onNavigate }) => {
    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatient = async () => {
            if (!patientId) return;
            try {
                const data = await api.getPatient(patientId);

                const mappedPatient = {
                    name: `${data.firstName} ${data.lastName}`,
                    id: data.id,
                    status: data.status || 'Normal',
                    vitals: {
                        hr: {
                            value: data.lastVitalsConfig?.heartRate || '--',
                            unit: 'bpm',
                            status: getVitalStatus('hr', data.lastVitalsConfig?.heartRate)
                        },
                        spo2: {
                            value: data.lastVitalsConfig?.spO2 || '--',
                            unit: '%',
                            status: getVitalStatus('spo2', data.lastVitalsConfig?.spO2)
                        },
                        temp: {
                            value: 36.5, // Mock temp
                            unit: '°C',
                            status: 'Normal'
                        }
                    }
                };
                setPatient(mappedPatient);
                setError(null);
            } catch (error) {
                console.error("Error fetching patient details:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
        const interval = setInterval(fetchPatient, 5000);

        return () => clearInterval(interval);
    }, [patientId]);

    const getVitalStatus = (type, value) => {
        if (!value) return 'Unknown';
        if (type === 'hr') {
            if (value > 100 || value < 60) return 'Abnormal';
        }
        if (type === 'spo2') {
            if (value < 95) return 'Abnormal';
        }
        return 'Normal';
    };

    if (loading) {
        return <div className="p-10 text-white">Loading patient details...</div>;
    }

    if (!patient) {
        return <div className="p-10 text-white">Patient not found</div>;
    }

    return (
        <motion.main
            className="ml-[280px] p-8 min-h-screen max-w-[1400px]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
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
                <Button className="rounded-full shadow-lg" size="lg">
                    <FileText className="mr-2 h-4 w-4" /> Generate PDF Report
                </Button>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <section className="h-[500px]">
                <VitalHistoryChart patientId={patient.id} />
            </section>

        </motion.main>
    );
};

export default PatientDetail;


