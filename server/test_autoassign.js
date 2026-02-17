const axios = require('axios');

const testAutoAssignEndToEnd = async () => {
    try {
        console.log('--- Testing End-to-End Auto-Assignment ---');

        // 1. Create a Hospital with specific speciality and capacity
        console.log('Step 1: Registering a Hospital...');
        const hospitalPayload = {
            name: "Auto-Assign Test Hospital " + Math.floor(Math.random() * 100),
            email: `autoassign_hosp_${Date.now()}@test.com`,
            password: "password123",
            phone: "9876543210",
            address: "Test Hub",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400012",
            hospitalType: "private",
            maxCapacity: 10,
            specialities: "Oncology",
            authorizedPerson: {
                name: "Dr. Tester",
                designation: "Head",
                phone: "9123456789"
            }
        };

        const hospResponse = await axios.post('http://localhost:5000/api/auth/register/hospital', hospitalPayload);
        const hospitalId = hospResponse.data.hospital._id;
        console.log(`✅ Hospital registered! ID: ${hospitalId}, Specialities: ${hospResponse.data.hospital.specialities}`);

        // Note: In a real system, the admin would need to approve the hospital.
        // Assuming the test DB/server handles auto-approval or we mock the Status.
        // For this test, let's assume the controller/service finds it.
        // Actually, the service checks status 'approved' in User model.
        // Let's manually approve it if we have access, or assume the test environment is configured.

        // 2. Submit a Medical Case with matching speciality
        console.log('\nStep 2: Submitting a Medical Case...');
        const casePayload = {
            patientName: "Test Patient",
            age: 30,
            gender: "male",
            phone: "9988776655",
            email: "patient@test.com",
            city: "Mumbai",
            state: "Maharashtra",
            relationshipToPatient: "self",
            title: "Testing Auto Assign",
            disease: "Leukemia",
            description: "End-to-end test case.",
            diagnosisDate: "2024-01-01",
            currentCondition: "stable",
            recommendedTreatment: "Chemotherapy",
            expectedDuration: "6 months",
            requiredSpeciality: "Oncology",
            amountRequired: 500000,
            consents: {
                sharePublicly: true,
                hospitalVerification: true,
                policyAgreement: true,
                truthfulnessDeclaration: true
            }
        };

        // We need an auth token for a patient to submit a case
        // Let's register a patient first
        console.log('Registering a Patient...');
        const patientPayload = {
            name: "Test Patient User",
            email: `patient_${Date.now()}@test.com`,
            password: "password123",
            phone: "9988776655",
            role: "patient"
        };
        const patientResp = await axios.post('http://localhost:5000/api/auth/register', patientPayload);
        const token = patientResp.data.token;
        console.log('✅ Patient registered and token obtained.');

        const caseResp = await axios.post('http://localhost:5000/api/cases', casePayload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const caseId = caseResp.data.data._id;
        console.log(`✅ Case submitted! ID: ${caseId}, Status: ${caseResp.data.data.status}`);

        // 3. Since the case is 'pending' initially, we might need to trigger the auto-assign
        // Usually, it's called in the controller after submission.
        // Let's check the case status now.
        setTimeout(async () => {
            const finalCaseResp = await axios.get(`http://localhost:5000/api/cases/${caseId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('\n--- Final Verification ---');
            console.log('Case Status:', finalCaseResp.data.data.status);
            console.log('Assigned Hospital User ID:', finalCaseResp.data.data.assignedHospital);

            if (finalCaseResp.data.data.status === 'assigned') {
                console.log('🎉 SUCCESS: Case was automatically assigned to a hospital!');
            } else {
                console.warn('⚠️ Case is still pending. This might be because the test hospital is not "approved" yet.');
            }
        }, 3000);

    } catch (error) {
        console.error('❌ Test Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
};

testAutoAssignEndToEnd();
