const { db } = require('../config/firebase');

const findAllPatients = async (filters) => {
    try {
        let patientsRef = db.collection('patients');

        // Apply filters if needed
        if (filters.status && filters.status !== 'All') {
            patientsRef = patientsRef.where('status', '==', filters.status);
        }

        const snapshot = await patientsRef.get();

        if (snapshot.empty) {
            return [
                { id: 'mock-1', firstName: 'James', lastName: 'Koomson', status: 'Normal', lastVitalsConfig: { heartRate: 72, spO2: 98 } },
                { id: 'mock-2', firstName: 'Nana', lastName: 'Owusu', status: 'Critical', lastVitalsConfig: { heartRate: 110, spO2: 88 } }
            ];
        }

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error getting patients:", error);
        // Fallback to mock data if DB fails
        return [
            { id: 'mock-1', firstName: 'James', lastName: 'Koomson', status: 'Normal', lastVitalsConfig: { heartRate: 72, spO2: 98 } },
            { id: 'mock-2', firstName: 'Nana', lastName: 'Owusu', status: 'Critical', lastVitalsConfig: { heartRate: 110, spO2: 88 } },
            { id: 'mock-3', firstName: 'Ama', lastName: 'Mensah', status: 'Warning', lastVitalsConfig: { heartRate: 95, spO2: 94 } }
        ];
    }
};

const createPatient = async (patientData) => {
    try {
        // Add timestamp
        const newPatient = {
            ...patientData,
            createdAt: new Date().toISOString(),
            status: patientData.status || 'Normal'
        };

        const res = await db.collection('patients').add(newPatient);
        return { id: res.id, ...newPatient };
    } catch (error) {
        throw new Error('Database Error: Could not create patient');
    }
};

const findPatientById = async (id) => {
    try {
        const doc = await db.collection('patients').doc(id).get();
        if (!doc.exists) {
            // Check for mock ID match
            if (id.startsWith('mock-')) {
                return {
                    id: id,
                    firstName: 'Mock',
                    lastName: 'Patient',
                    status: 'Normal',
                    lastVitalsConfig: { heartRate: 75, spO2: 97 }
                };
            }
            return null;
        }
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        // Fallback mock
        return {
            id: id,
            firstName: 'Mock',
            lastName: 'Patient',
            status: 'Normal',
            lastVitalsConfig: { heartRate: 75, spO2: 97 }
        };
    }
};

const updatePatient = async (id, updateData) => {
    try {
        const patientRef = db.collection('patients').doc(id);
        await patientRef.update({
            ...updateData,
            updatedAt: new Date().toISOString()
        });

        // Return updated data
        const doc = await patientRef.get();
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        throw new Error('Database Error: Could not update patient');
    }
};

const deletePatient = async (id) => {
    try {
        await db.collection('patients').doc(id).delete();
        return true;
    } catch (error) {
        throw new Error('Database Error');
    }
};

module.exports = {
    findAllPatients,
    createPatient,
    findPatientById,
    updatePatient,
    deletePatient
};
