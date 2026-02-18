import { auth } from '../config/firebase';
import { ref, query, orderByKey, limitToLast, get, onValue } from 'firebase/database';
import { database } from '../config/firebase';

const API_BASE_URL = '/api';

// Helper to get current user's ID token
const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }
    return {
        'Content-Type': 'application/json'
    };
};

export const api = {
    // Patients
    getPatients: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/patients?${queryParams}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch patients');
        return response.json();
    },

    getPatient: async (id) => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/patients/${id}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch patient details');
        return response.json();
    },

    createPatient: async (data) => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/patients`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create patient');
        return response.json();
    },

    // Vitals (Realtime Database Integration)

    // Subscribe to real-time updates
    subscribeToVitals: (patientId, callback) => {
        const vitalsRef = query(
            ref(database, `patient_data/${patientId}`),
            orderByKey(),
            limitToLast(1)
        );

        const unsubscribe = onValue(vitalsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const timestamp = Object.keys(data)[0];
                const reading = data[timestamp];
                callback({ timestamp, ...reading });
            }
        });

        return unsubscribe; // Return cleanup function
    },

    // Get history for charts
    getVitalHistory: async (patientId, range = '24h') => {
        try {
            const now = Date.now();
            let startTime;

            switch (range) {
                case '24h':
                    startTime = now - (24 * 60 * 60 * 1000);
                    break;
                case '7d':
                    startTime = now - (7 * 24 * 60 * 60 * 1000);
                    break;
                case '30d':
                    startTime = now - (30 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startTime = now - (24 * 60 * 60 * 1000);
            }

            // const startIso = new Date(startTime).toISOString();

            // Query by timestamp (key)
            // Note: Keys in RTDB are ISO strings, which sort lexicographically correctly
            const vitalsRef = query(
                ref(database, `patient_data/${patientId}`),
                orderByKey(),
                // startAt(startIso) // Uncomment when real data has correct ISO keys
                limitToLast(range === '24h' ? 50 : 500) // Adjust limit based on range to avoid over-fetching
            );

            const snapshot = await get(vitalsRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                let history = Object.entries(data).map(([key, value]) => ({
                    timestamp: key,
                    ...value
                }));

                // Client-side filtering for now until startAt is verified with the key format
                // Our keys might use underscores or be slightly different in the simulation
                history = history.filter(h => {
                    // Handle potential underscore in keys from simulation script
                    const ts = h.timestamp.replace(/_/g, '.');
                    return new Date(ts).getTime() >= startTime;
                });

                return history;
            }
            return [];
        } catch (error) {
            console.error("Error fetching history:", error);
            return [];
        }
    },

    // Legacy method shim for backward compatibility during refactor
    getVitals: async (patientId, range = '24h') => {
        const history = await api.getVitalHistory(patientId, range);
        // Map back to old format expected by current charts
        // The old format had separate entries for each type. 
        // The new format has one entry with multiple fields.
        // We need to flatten it for the old chart component until it's refactored.

        const flatList = [];
        history.forEach(reading => {
            if (reading.heart_rate) flatList.push({ type: 'HEART_RATE', value: reading.heart_rate, timestamp: reading.timestamp });
            if (reading.spo2) flatList.push({ type: 'SPO2', value: reading.spo2, timestamp: reading.timestamp });
            if (reading.temperature) flatList.push({ type: 'TEMPERATURE', value: reading.temperature, timestamp: reading.timestamp });
        });

        return flatList;
    },

    // Dashboard
    getDashboardStats: async () => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`, { headers });
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        return response.json();
    },

    getAnalytics: async () => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/dashboard/analytics`, { headers });
        if (!response.ok) throw new Error('Failed to fetch analytics');
        return response.json();
    },

    getAlerts: async () => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/dashboard/alerts`, { headers });
        if (!response.ok) throw new Error('Failed to fetch alerts');
        return response.json();
    },

    resolveAlert: async (id, patientId) => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/dashboard/alerts/${id}/resolve`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ patientId })
        });
        if (!response.ok) throw new Error('Failed to resolve alert');
        return response.json();
    }
};
