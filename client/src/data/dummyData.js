// Dummy data for trending cases and success stories
export const trendingCases = [
    {
        id: 1,
        patientName: "Rajesh Kumar",
        age: 45,
        disease: "Cardiac Surgery",
        hospital: "Apollo Hospital, Delhi",
        hospitalVerified: true,
        amountRequired: 450000,
        amountRaised: 320000,
        supporters: 127,
        urgency: "Critical",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=300&fit=crop",
        story: "Rajesh, a daily wage worker, needs urgent heart surgery. His family has exhausted all savings.",
        daysLeft: 12
    },
    {
        id: 2,
        patientName: "Priya Sharma",
        age: 8,
        disease: "Bone Marrow Transplant",
        hospital: "Fortis Memorial, Gurgaon",
        hospitalVerified: true,
        amountRequired: 850000,
        amountRaised: 680000,
        supporters: 243,
        urgency: "High",
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop",
        story: "Little Priya is battling leukemia. She needs a bone marrow transplant to survive.",
        daysLeft: 8
    },
    {
        id: 3,
        patientName: "Mohammed Ali",
        age: 62,
        disease: "Kidney Transplant",
        hospital: "Max Super Speciality, Saket",
        hospitalVerified: true,
        amountRequired: 650000,
        amountRaised: 425000,
        supporters: 156,
        urgency: "Moderate",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop",
        story: "Mohammed, a retired teacher, requires a kidney transplant. His pension cannot cover the costs.",
        daysLeft: 20
    }
];

export const successStories = [
    {
        id: 1,
        patientName: "Anita Desai",
        age: 34,
        disease: "Liver Transplant",
        hospital: "AIIMS, New Delhi",
        amountRaised: 720000,
        supporters: 189,
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=faces",
        quote: "Thanks to JIVANDAN and the amazing supporters, I got a second chance at life. My daughter has her mother back.",
        status: "Successfully Treated",
        treatmentDate: "December 2023"
    },
    {
        id: 2,
        patientName: "Vikram Singh",
        age: 52,
        disease: "Cancer Treatment",
        hospital: "Tata Memorial, Mumbai",
        amountRaised: 580000,
        supporters: 234,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
        quote: "The platform's transparency gave my family hope. Every rupee was accounted for, and I'm now cancer-free.",
        status: "Successfully Treated",
        treatmentDate: "January 2024"
    },
    {
        id: 3,
        patientName: "Meera Patel",
        age: 19,
        disease: "Spinal Surgery",
        hospital: "Manipal Hospital, Bangalore",
        amountRaised: 390000,
        supporters: 167,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces",
        quote: "I can walk again! The verified hospital process made my parents trust the platform completely.",
        status: "Successfully Treated",
        treatmentDate: "November 2023"
    }
];

export const trustStats = [
    {
        icon: "ShieldCheck",
        title: "Hospital Verified",
        description: "Every case is verified by registered hospitals",
        count: "100%"
    },
    {
        icon: "Lock",
        title: "Secure Payments",
        description: "Razorpay-powered encrypted transactions",
        count: "₹2.5Cr+"
    },
    {
        icon: "Users",
        title: "Active Supporters",
        description: "Community members making a difference",
        count: "12,000+"
    },
    {
        icon: "Heart",
        title: "Lives Impacted",
        description: "Patients successfully treated",
        count: "450+"
    }
];

export const howItWorksSteps = [
    {
        step: 1,
        icon: "FileText",
        title: "Patient Submits Case",
        description: "Patient or family submits medical case with required documents"
    },
    {
        step: 2,
        icon: "Building2",
        title: "Hospital Verifies",
        description: "Registered hospital verifies medical need and treatment cost"
    },
    {
        step: 3,
        icon: "Heart",
        title: "Supporters Donate",
        description: "Community members contribute directly to hospital account"
    }
];
