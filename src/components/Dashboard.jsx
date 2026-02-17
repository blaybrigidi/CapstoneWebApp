import React, { useState, useEffect } from 'react';
import SummaryCard from './SummaryCard';
import { motion } from 'framer-motion';
import PatientList from './PatientList';
import RecentActivity from './RecentActivity';
import { api } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Dashboard = ({ onNavigate }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dashboardStats, setDashboardStats] = useState({
        criticalAlerts: 0,
        warnings: 0,
        activePatients: 0,
        pendingReports: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getDashboardStats();
                setDashboardStats(data);
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 5000);

        return () => clearInterval(interval);
    }, []);

    const statsCards = [
        {
            title: 'Critical Alerts',
            value: dashboardStats.criticalAlerts,
            icon: 'Activity',
            type: 'critical',
            subtext: 'Requires immediate attention',
            action: () => onNavigate('alerts', null, { filter: 'critical' })
        },
        {
            title: 'Warnings',
            value: dashboardStats.warnings,
            icon: 'AlertTriangle',
            type: 'warning',
            subtext: 'Monitor closely',
            action: () => onNavigate('alerts', null, { filter: 'warning' })
        },
        {
            title: 'Active Patients',
            value: dashboardStats.activePatients,
            icon: 'Users',
            type: 'info',
            subtext: 'Currently monitored',
            action: () => { setSearchQuery(''); setStatusFilter('All'); }
        },
        {
            title: 'Reports Pending',
            value: dashboardStats.pendingReports,
            icon: 'FileText',
            type: 'info',
            subtext: 'To be reviewed',
            action: null
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
    };

    return (
        <motion.main
            className="ml-[280px] p-8 min-h-screen max-w-[1600px]"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            variants={containerVariants}
        >
            <motion.header className="mt-8 mb-12 flex justify-between items-baseline" variants={itemVariants}>
                <h1 className="text-5xl font-extrabold tracking-tight leading-none text-foreground">
                    Patient Overview
                </h1>
                <div className="flex gap-4">
                    <Button
                        className="rounded-full px-8 py-6 text-md font-medium shadow-lg hover:shadow-xl transition-all"
                        onClick={() => {/* no-op for demo */ }}
                    >
                        + New Patient
                    </Button>
                </div>
            </motion.header>

            {/* Summary Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                {statsCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={stat.action ? { y: -5 } : {}}
                    >
                        <SummaryCard
                            title={stat.title}
                            value={stat.value}
                            subtext={stat.subtext}
                            type={stat.type}
                            icon={stat.icon}
                            onClick={stat.action}
                            isActive={false}
                        />
                    </motion.div>
                ))}
            </section>

            {/* Content Area: Patient List + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <motion.div className="lg:col-span-3 flex flex-col gap-6" variants={itemVariants}>

                    {/* Search and Filter Bar */}
                    <div className="flex justify-between items-center pb-2">
                        <div className="relative w-[300px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search patients..."
                                className="pl-9 h-11 bg-background"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2.5 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Critical">Critical Only</option>
                            <option value="Warning">Warning Only</option>
                            <option value="Normal">Normal Only</option>
                        </select>
                    </div>

                    <PatientList
                        onNavigate={onNavigate}
                        searchQuery={searchQuery}
                        statusFilter={statusFilter}
                    />
                </motion.div>

                <motion.div className="lg:col-span-1 flex flex-col" variants={itemVariants}>
                    <RecentActivity onNavigate={onNavigate} />
                </motion.div>
            </div>
        </motion.main>
    );
};

export default Dashboard;
