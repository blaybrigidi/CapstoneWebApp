const { db } = require('../config/firebase');

const findAllPatients = async (filters) => {
    try {
        let patientsRef = db.collection('patients');

        // Apply filters if needed
        // Note: Firestore basic filtering. Complex queries might need indexes.
        if (filters.status && filters.status !== 'All') {
            patientsRef = patientsRef.where('status', '==', filters.status);
        }

        const snapshot = await patientsRef.get();

        // If empty, return mock data for now to not break frontend while DB is empty
        if (snapshot.empty) {
            return [
                { id: 'mock-1', firstName: 'James', lastName: 'Koomson', status: 'Normal' },
                { id: 'mock-2', firstName: 'Nana', lastName: 'Owusu', status: 'Critical' }
            ];
        }

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error getting patients:", error);
        throw new Error('Database Error: Could not fetch patients');
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
            return null;
        }
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        throw new Error('Database Error');
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
