const { db, rtdb } = require('../config/firebase');

const THRESHOLDS = {
    HEART_RATE: { min: 60, max: 100 },
    SPO2: { min: 95, max: 100 },
    TEMPERATURE: { min: 36.0, max: 37.5 }
};

/**
 * Checks if a vital sign reading is abnormal and creates an alert if so.
 * @param {string} patientId 
 * @param {string} type - 'HEART_RATE', 'SPO2', 'TEMPERATURE'
 * @param {number} value 
 */
const checkAndCreateAlert = async (patientId, type, value) => {
    let alertType = null;
    let message = null;

    if (type === 'HEART_RATE') {
        if (value > THRESHOLDS.HEART_RATE.max) {
            alertType = 'critical';
            message = `High Heart Rate detected: ${value} bpm`;
        } else if (value < THRESHOLDS.HEART_RATE.min) {
            alertType = 'warning';
            message = `Low Heart Rate detected: ${value} bpm`;
        }
    } else if (type === 'SPO2') {
        if (value < THRESHOLDS.SPO2.min) {
            alertType = 'critical';
            message = `Low SpO2 detected: ${value}%`;
        }
    } else if (type === 'TEMPERATURE') {
        if (value > THRESHOLDS.TEMPERATURE.max) {
            alertType = 'warning';
            message = `High Temperature detected: ${value}°C`;
        }
    }

    if (alertType) {
        try {
            const alertData = {
                patientId,
                type: alertType,
                message,
                category: type,
                value,
                isRead: false,
                timestamp: new Date().toISOString(),
                createdAt: new Date().toISOString() // Duplicate for sorting if needed
            };

            // Write to RTDB instead of Firestore to match ML Guide
            // Path: alerts/{patientId}/{alertId}
            const newAlertRef = rtdb.ref(`alerts/${patientId}`).push();
            await newAlertRef.set(alertData);

            console.log(`[Alert] Created ${alertType} alert for patient ${patientId}: ${message}`);

            // Also update patient status in Firestore (for Patient List UI)
            const status = alertType === 'critical' ? 'Critical' : 'Warning';
            await db.collection('patients').doc(patientId).update({ status });

            return { id: newAlertRef.key, ...alertData, newStatus: status };
        } catch (error) {
            console.error("[Alert] Failed to create alert:", error);
            // Don't throw, just log. Alert failure shouldn't block vital ingestion.
        }
    }

    return null;
};

module.exports = {
    checkAndCreateAlert,
    THRESHOLDS
};
