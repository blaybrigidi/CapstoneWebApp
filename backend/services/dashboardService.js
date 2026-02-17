const { db } = require('../config/firebase');

const computeStats = async () => {
    try {
        const patientsRef = db.collection('patients');
        const snapshot = await patientsRef.get();

        let critical = 0;
        let warning = 0;
        let active = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            active++; // Assuming all present are active
            if (data.status === 'Critical') critical++;
            if (data.status === 'Warning') warning++;
        });

        // Pending reports is still mocked as we don't have a reports collection yet
        return {
            criticalAlerts: critical,
            warnings: warning,
            activePatients: active,
            pendingReports: 5 // Mocked
        };
    } catch (error) {
        console.error("Error computing stats:", error);
        throw new Error('Failed to compute dashboard stats');
    }
};

const fetchActivityLog = async () => {
    // TODO: Query Alert/Activity table

    // Mock Response
    return [
        { id: 1, text: "Nana Kwadwo marked Critical", time: "2 min ago", type: "critical" },
        { id: 2, text: "New alert for Chris Lamptey", time: "5 min ago", type: "warning" },
        { id: 3, text: "Dr. Blay reviewed active reports", time: "15 min ago", type: "info" }
    ];
};

const calculateAnalytics = async () => {
    try {
        const patientsRef = db.collection('patients');
        const snapshot = await patientsRef.get();
        const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 1. Fetch vitals for all patients (last 24h)
        // Optimization: In a real app, use a collectionGroup query or pre-aggregated stats.
        // Here we'll query each patient's vitals subcollection for the last 24h.

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        let allVitals = [];

        // Parallel fetch
        const promises = patients.map(async (patient) => {
            const vitalsSnap = await db.collection('patients').doc(patient.id)
                .collection('vitals')
                .where('timestamp', '>=', twentyFourHoursAgo.toISOString())
                .orderBy('timestamp', 'asc') // Create composite index if needed, or sort in JS
                .get();

            return vitalsSnap.docs.map(d => d.data());
        });

        const results = await Promise.all(promises);
        results.forEach(pVitals => allVitals.push(...pVitals));

        // 2. Aggregate by Hour for the Chart
        // We want to show "Average SpO2" or "Average Stability" over time
        // Let's create a "System Health Score" based on vitals stability
        // Or simpler: Average SpO2 across all patients

        const buckets = {}; // "HH:00" -> [values]

        allVitals.forEach(v => {
            if (v.type === 'SPO2') {
                const date = new Date(v.timestamp);
                const hourKey = date.toLocaleString('en-US', { hour: 'numeric', hour12: true });
                // Sort key for ordering
                const sortKey = date.getTime();

                // Bucket by hour
                if (!buckets[hourKey]) buckets[hourKey] = { sum: 0, count: 0, time: sortKey };
                buckets[hourKey].sum += v.value;
                buckets[hourKey].count++;
            }
        });

        const trendData = Object.keys(buckets).map(key => ({
            date: key,
            value: Math.round(buckets[key].sum / buckets[key].count),
            sortTime: buckets[key].time
        })).sort((a, b) => a.sortTime - b.sortTime);

        // 3. Current System Stats
        const currentSpO2 = allVitals.filter(v => v.type === 'SPO2').slice(-10); // Last few readings
        const avgSpO2 = currentSpO2.length
            ? Math.round(currentSpO2.reduce((acc, v) => acc + v.value, 0) / currentSpO2.length)
            : 98;

        return {
            trends: trendData,
            averageSpO2: avgSpO2,
            anomalyEvents: 3, // Keep mocked or derive from 'Critical' count in history
            totalPatients: patients.length
        };

    } catch (error) {
        console.error("Error calculating analytics:", error);
        throw new Error('Failed to calculate analytics');
    }
};

module.exports = {
    computeStats,
    fetchActivityLog,
    calculateAnalytics
};
