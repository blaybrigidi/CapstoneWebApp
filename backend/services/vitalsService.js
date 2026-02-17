const { db } = require('../config/firebase');

const logVitalSign = async (data) => {
    try {
        const { patientId, type, value, unit } = data;

        const timestamp = new Date().toISOString();
        const vitalsData = {
            type,
            value,
            unit: unit || '',
            timestamp
        };

        // Option 1: Store in a subcollection 'vitals' under the patient
        // patients/{patientId}/vitals/{vitalId}
        const res = await db.collection('patients').doc(patientId).collection('vitals').add(vitalsData);

        // Also update the 'latest vitals' on the patient document for quick access
        await db.collection('patients').doc(patientId).update({
            [`latestVitals.${type}`]: { value, timestamp }
        });

        // Trigger Alert Logic Placeholder
        if (type === 'HEART_RATE' && value > 100) {
            // createAlert(patientId, 'CRITICAL', `High Heart Rate: ${value} bpm`);
        }

        return { id: res.id, ...vitalsData };
    } catch (error) {
        console.error("Error logging vital:", error);
        throw new Error('Database Error: Could not log vital sign');
    }
};

const fetchVitalHistory = async (patientId, range) => {
    try {
        // Range logic would convert '1h' to a timestamp query
        // For now, return all
        const snapshot = await db.collection('patients').doc(patientId)
            .collection('vitals')
            .orderBy('timestamp', 'desc')
            .limit(50)
            .get();

        if (snapshot.empty) {
            // Mock data for charts if empty
            return [
                { timestamp: new Date().toISOString(), value: 72 },
                { timestamp: new Date(Date.now() - 60000).toISOString(), value: 75 }
            ];
        }

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching vitals history:", error);
        // Fallback mock
        return [];
    }
};

module.exports = {
    logVitalSign,
    fetchVitalHistory
};
