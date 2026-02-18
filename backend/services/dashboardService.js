const { db, rtdb } = require('../config/firebase');

// Simple in-memory cache
const cache = {
    stats: { data: null, timestamp: 0 },
    analytics: { data: null, timestamp: 0 },
    activity: { data: null, timestamp: 0 }
};

const CACHE_TTL = {
    STATS: 15000, // 15 seconds
    ANALYTICS: 60000, // 1 minute
    ACTIVITY: 10000 // 10 seconds (for recent alerts)
};

const computeStats = async () => {
    const now = Date.now();
    if (cache.stats.data && (now - cache.stats.timestamp < CACHE_TTL.STATS)) {
        return cache.stats.data;
    }

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

        const stats = {
            criticalAlerts: critical,
            warnings: warning,
            activePatients: active,
            pendingReports: 5 // Mocked
        };

        cache.stats = { data: stats, timestamp: now };
        return stats;
    } catch (error) {
        console.error("Error computing stats:", error);
        // Fallback mock data
        return {
            criticalAlerts: 2,
            warnings: 5,
            activePatients: 12,
            pendingReports: 4
        };
    }
};

const fetchActivityLog = async () => {
    const now = Date.now();
    if (cache.activity.data && (now - cache.activity.timestamp < CACHE_TTL.ACTIVITY)) {
        console.log('Serving activity from cache');
        return cache.activity.data;
    }

    try {
        // Similar to fetchUnreadAlerts, fetch from RTDB and flatten
        const snapshot = await rtdb.ref('alerts').once('value');
        if (!snapshot.exists()) return [];

        const allAlerts = [];
        const data = snapshot.val();

        Object.keys(data).forEach(patientId => {
            const patientAlerts = data[patientId];
            Object.keys(patientAlerts).forEach(alertId => {
                allAlerts.push({ id: alertId, patientId, ...patientAlerts[alertId] });
            });
        });

        const sorted = allAlerts
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10);

        cache.activity = { data: sorted, timestamp: now };
        return sorted;
    } catch (error) {
        console.error("Error fetching activity log from RTDB:", error);
        return [];
    }
};

const fetchUnreadAlerts = async () => {
    try {
        const snapshot = await rtdb.ref('alerts').once('value');
        if (!snapshot.exists()) return [];

        let allAlerts = [];
        const data = snapshot.val();

        // Flatten
        Object.keys(data).forEach(patientId => {
            const patientAlerts = data[patientId];
            Object.keys(patientAlerts).forEach(alertId => {
                const alert = patientAlerts[alertId];
                if (!alert.isRead) {
                    allAlerts.push({ id: alertId, patientId, ...alert });
                }
            });
        });

        // Sort and Limit
        allAlerts = allAlerts
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 20);

        // Enrich with Patient Data
        const enrichedAlerts = await Promise.all(allAlerts.map(async (alert) => {
            try {
                // Fetch basic patient info (Name)
                // In a real app, cache this or use a where-in query
                const patientDoc = await db.collection('patients').doc(alert.patientId).get();
                const patientName = patientDoc.exists
                    ? `${patientDoc.data().firstName} ${patientDoc.data().lastName}`
                    : 'Unknown Patient';

                // Format relative time (simple approximation)
                const diffMs = new Date() - new Date(alert.timestamp);
                const diffMins = Math.floor(diffMs / 60000);
                let timeString = 'Just now';
                if (diffMins > 0 && diffMins < 60) timeString = `${diffMins}m ago`;
                if (diffMins >= 60) timeString = `${Math.floor(diffMins / 60)}h ago`;

                // Map Vital Label
                const vitalMap = {
                    'HEART_RATE': 'Heart Rate',
                    'SPO2': 'Blood Oxygen',
                    'TEMPERATURE': 'Body Temp'
                };

                return {
                    ...alert,
                    patient: patientName,
                    time: timeString,
                    vital: vitalMap[alert.category] || alert.category,
                    value: `${alert.value} ${alert.unit || ''}`.trim()
                    // Note: unit might not be in alert, if not, value is just number
                };
            } catch (err) {
                console.error(`Error enriching alert ${alert.id}:`, err);
                return alert; // Return raw if enrichment fails
            }
        }));

        return enrichedAlerts;

    } catch (error) {
        console.error("Error fetching unread alerts form RTDB:", error);
        return [];
    }
};

const calculateAnalytics = async () => {
    const now = Date.now();
    if (cache.analytics.data && (now - cache.analytics.timestamp < CACHE_TTL.ANALYTICS)) {
        return cache.analytics.data;
    }

    try {
        const patientsRef = db.collection('patients');
        const snapshot = await patientsRef.get();
        const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const nowObj = new Date();
        const twentyFourHoursAgo = new Date(nowObj.getTime() - 24 * 60 * 60 * 1000);

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

        const analyticsData = {
            trends: trendData,
            averageSpO2: avgSpO2,
            anomalyEvents: 3, // Keep mocked or derive from 'Critical' count in history
            totalPatients: patients.length
        };

        cache.analytics = { data: analyticsData, timestamp: now };
        return analyticsData;

    } catch (error) {
        console.error("Error calculating analytics:", error);
        // Fallback mock data
        return {
            trends: [],
            averageSpO2: 97,
            anomalyEvents: 0,
            totalPatients: 0
        };
    }
};

const markAlertAsResolved = async (alertId, patientId) => {
    try {
        if (!patientId) throw new Error("patientId is required to resolve alert in RTDB");

        await rtdb.ref(`alerts/${patientId}/${alertId}`).update({
            isRead: true,
            resolvedAt: new Date().toISOString()
        });

        // Invalidate activity cache
        cache.activity = { data: null, timestamp: 0 };
        return { success: true };
    } catch (error) {
        console.error("Error resolving alert:", error);
        throw error;
    }
};

module.exports = {
    computeStats,
    fetchActivityLog,
    fetchUnreadAlerts,
    calculateAnalytics,
    markAlertAsResolved
};
