import { auth } from '../config/firebase';

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

    // Vitals
    getVitals: async (patientId, range = '24h') => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/vitals/${patientId}?range=${range}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch vitals');
        return response.json();
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
    }
};
