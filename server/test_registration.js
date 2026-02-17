const axios = require('axios');

const testMultiSelectSpecialities = async () => {
    try {
        console.log('--- Testing Hospital Registration with Multi-Select Specialities ---');

        // Simulating the combined specialities string that Register.jsx would send
        const selectedSpecialities = ["Cardiology", "Neurology", "Other"];
        const otherSpeciality = "Ayurvedic Surgery, Yoga Therapy";

        const combinedSpecialities = [
            ...selectedSpecialities.filter(s => s !== 'Other'),
            ...otherSpeciality.split(',').map(s => s.trim())
        ].join(', ');

        const payload = {
            name: "Multi-Spec Hospital " + Math.floor(Math.random() * 1000),
            email: `multispec${Date.now()}@test.com`,
            password: "password123",
            phone: "9876543210",
            address: "Speciality Hub",
            city: "Pune",
            state: "Maharashtra",
            pincode: "411001",
            hospitalType: "private",
            maxCapacity: 100,
            specialities: combinedSpecialities,
            authorizedPerson: {
                name: "Dr. Multi",
                designation: "Director",
                phone: "9123456789"
            },
            organizationDetails: {
                registrationNumber: "PN-REG-" + Math.floor(Math.random() * 1000000),
                description: "Multi-speciality hub test.",
                website: "http://multispec.com"
            }
        };

        const response = await axios.post('http://localhost:5000/api/auth/register/hospital', payload);
        console.log('✅ Registration Successful!');
        console.log('Response Status:', response.status);
        console.log('Hospital Name:', response.data.hospital.hospitalName);
        console.log('Final Specialities (Saved as Array):', response.data.hospital.specialities);

        // Verify merging logic
        const expected = ["Cardiology", "Neurology", "Ayurvedic Surgery", "Yoga Therapy"];
        const actual = response.data.hospital.specialities;
        const allPresent = expected.every(s => actual.includes(s));

        if (allPresent && actual.length === expected.length) {
            console.log('🎉 Speciality Merging Logic Verified!');
        } else {
            console.warn('⚠️ Speciality mismatch!', { expected, actual });
        }

    } catch (error) {
        console.error('❌ Registration Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error Message:', error.message);
        }
    }
};

testMultiSelectSpecialities();
