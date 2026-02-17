import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // We might need to create this too
import { Button } from "@/components/ui/button";

const PatientList = ({ onNavigate, searchQuery = '', statusFilter = 'All' }) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await api.getPatients();
                // Map backend data to frontend structure
                const mappedPatients = response.map(p => ({
                    id: p.id,
                    name: `${p.firstName} ${p.lastName}`,
                    hr: p.lastVitalsConfig?.heartRate || 72,
                    hrTrend: { dir: 'stable', val: 0 }, // Mock trend for now
                    spo2: p.lastVitalsConfig?.spO2 || 98,
                    spo2Trend: { dir: 'stable', val: 0 },
                    temp: 36.5, // Mock temp as it wasn't in seed
                    status: p.status || 'Normal',
                    lastUpdate: p.updatedAt ? new Date(p.updatedAt).getTime() : Date.now(),
                    avatar: `${p.firstName[0]}${p.lastName[0]}`
                }));
                setPatients(mappedPatients);
            } catch (error) {
                console.error("Error fetching patients:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

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
        result.sort((a, b) => (statusPriority[a.status] ?? 2) - (statusPriority[b.status] ?? 2));

        return result;
    }, [patients, searchQuery, statusFilter]);

    const getFreshnessStatus = (timestamp) => {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        if (minutes < 2) return { text: 'Just now', color: 'text-green-600', dot: 'bg-green-600' };
        if (minutes < 5) return { text: `${minutes} min ago`, color: 'text-yellow-600', dot: 'bg-yellow-600' };
        if (minutes >= 60) return { text: 'Offline', color: 'text-red-500', isOffline: true };
        return { text: `${minutes} min ago`, color: 'text-red-500', dot: 'bg-red-500' };
    };

    return (
        <motion.div
            className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[30%]">PATIENT NAME</TableHead>
                        <TableHead>HEART RATE</TableHead>
                        <TableHead>SpO2</TableHead>
                        <TableHead>TEMP</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead>LAST UPDATE</TableHead>
                        <TableHead>ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <AnimatePresence mode="popLayout">
                        {filteredPatients.map((patient) => {
                            const freshness = getFreshnessStatus(patient.lastUpdate);
                            const isCritical = patient.status === 'Critical';

                            return (
                                <motion.tr
                                    key={patient.id}
                                    variants={{
                                        hidden: { opacity: 0, x: -10 },
                                        visible: { opacity: 1, x: 0 },
                                        exit: { opacity: 0, height: 0 }
                                    }}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className={`
                                        border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted
                                        ${isCritical ? 'bg-red-50/50 hover:bg-red-50/80 border-l-4 border-l-red-500' : 'border-l-4 border-l-transparent'}
                                    `}
                                    onClick={() => onNavigate('patient-detail', patient.id)}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground text-xs">
                                                {patient.avatar}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground">{patient.name}</span>
                                                <span className="text-xs text-muted-foreground">ID: {1000 + patient.id}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <VitalCell value={`${patient.hr} bpm`} trend={patient.hrTrend} />
                                    </TableCell>
                                    <TableCell>
                                        <VitalCell value={`${patient.spo2}%`} trend={patient.spo2Trend} />
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">{patient.temp}°C</span>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={patient.status} />
                                    </TableCell>
                                    <TableCell>
                                        {freshness.isOffline ? (
                                            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                OFFLINE
                                            </span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className={`h-1.5 w-1.5 rounded-full ${freshness.dot}`} />
                                                <span className={`text-xs ${freshness.color}`}>{freshness.text}</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            onClick={(e) => { e.stopPropagation(); onNavigate('patient-detail', patient.id); }}
                                        >
                                            Details
                                        </Button>
                                    </TableCell>
                                </motion.tr>
                            );
                        })}
                    </AnimatePresence>
                </TableBody>
            </Table>
            {filteredPatients.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                    No patients found matching your search.
                </div>
            )}
        </motion.div>
    );
};

// Helper component for Vital signs with trends
const VitalCell = ({ value, trend }) => (
    <div>
        <div className="font-medium text-foreground">{value}</div>
        {trend && trend.dir !== 'stable' && (
            <div className={`text-xs flex items-center gap-0.5 ${trend.dir === 'up' && trend.val > 0 ? 'text-red-500' : 'text-green-600'}`}>
                <span>{trend.dir === 'up' ? '↑' : '↓'}</span>
                <span>{trend.val}</span>
            </div>
        )}
    </div>
);

const StatusBadge = ({ status }) => {
    let classes = "bg-green-100 text-green-700 hover:bg-green-100/80";
    if (status === 'Warning') classes = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
    if (status === 'Critical') classes = "bg-red-100 text-red-700 border border-red-200 hover:bg-red-100/80";

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${classes}`}>
            {status === 'Critical' && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-600" />}
            {status}
        </span>
    );
};

export default PatientList;

