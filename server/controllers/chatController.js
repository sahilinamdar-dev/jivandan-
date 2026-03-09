const { askGroq } = require('../services/groqService');
const MedicalCase = require('../models/MedicalCase');
const Donation = require('../models/Donation');
const Hospital = require('../models/Hospital');
const User = require('../models/User');

// ─────────────────────────────────────────────
// Fetch ALL real stats from MongoDB (no guessing)
// ─────────────────────────────────────────────
const getLivePlatformStats = async () => {
    try {
        const [
            // Case counts — every status in the enum
            totalCases,
            submittedCases,
            verifiedCases,
            hospitalAssignedCases,
            hospitalApprovedCases,
            liveCases,
            milestoneCases,
            completedCases,
            rejectedCases,
            // Fraud
            reviewCases,
            blockedCases,
            // Users
            totalPatients,
            totalSupporters,
            totalHospitals,
            // Donations (only completed payments)
            donationResult,
            totalDonationCount,
            // Active hospitals
            activeHospitals,
        ] = await Promise.all([
            MedicalCase.countDocuments(),
            MedicalCase.countDocuments({ status: 'CASE_SUBMITTED' }),
            MedicalCase.countDocuments({ status: 'CASE_VERIFIED' }),
            MedicalCase.countDocuments({ status: { $in: ['HOSPITAL_ASSIGNED', 'assigned'] } }),
            MedicalCase.countDocuments({ status: 'HOSPITAL_APPROVED' }),
            MedicalCase.countDocuments({ status: { $in: ['CASE_LIVE', 'live'] } }),
            MedicalCase.countDocuments({ status: 'TREATMENT_MILESTONE' }),
            MedicalCase.countDocuments({ status: 'completed' }),
            MedicalCase.countDocuments({ status: 'rejected' }),
            MedicalCase.countDocuments({ fraudStatus: 'REVIEW' }),
            MedicalCase.countDocuments({ fraudStatus: 'BLOCKED' }),
            User.countDocuments({ role: 'patient' }),
            User.countDocuments({ role: 'supporter' }),
            User.countDocuments({ role: 'hospital' }),
            Donation.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            Donation.countDocuments({ status: 'completed' }),
            Hospital.countDocuments({ isActive: true }),
        ]);

        const totalDonationAmount = donationResult[0]?.total || 0;
        const inProgressCases = hospitalAssignedCases + hospitalApprovedCases + liveCases + milestoneCases;

        return `
════════════════════════════════════════
📊 JIVANDAN LIVE STATS (real-time from database)
════════════════════════════════════════

🗂️ CASE BREAKDOWN (Total: ${totalCases})
• Submitted (awaiting verification): ${submittedCases}
• Verified by Admin: ${verifiedCases}
• Hospital Assigned: ${hospitalAssignedCases}
• Hospital Approved: ${hospitalApprovedCases}
• Live (accepting donations): ${liveCases}
• Treatment in Progress (Milestone): ${milestoneCases}
• Completed (treatment done): ${completedCases}
• Rejected: ${rejectedCases}
• In Progress (total active pipeline): ${inProgressCases}

🚨 FRAUD / SAFETY
• Cases Under Review: ${reviewCases}
• Cases Blocked: ${blockedCases}
• Safe Cases: ${totalCases - reviewCases - blockedCases}

👥 REGISTERED USERS
• Patients: ${totalPatients}
• Donors/Supporters: ${totalSupporters}
• Hospital Accounts: ${totalHospitals}

🏥 HOSPITALS
• Active Hospitals on Platform: ${activeHospitals}

💰 DONATIONS
• Total Successful Donations: ${totalDonationCount}
• Total Amount Raised: ₹${totalDonationAmount.toLocaleString('en-IN')}

════════════════════════════════════════
RULE: Use ONLY the numbers above. NEVER guess, invent, or calculate beyond these figures.
`;
    } catch (err) {
        console.error('[ChatController] Stats fetch error:', err.message);
        return null;
    }
};

// ─────────────────────────────────────────────
// Role-aware system prompts
// ─────────────────────────────────────────────
const getSystemPrompt = (role, userName, liveStats) => {
    const name = userName ? ` ${userName}` : '';
    const statsBlock = liveStats
        ? `\nYou have access to LIVE DATABASE STATS below — use these exact numbers when answering stat/count questions:\n${liveStats}`
        : `\nCRITICAL: You do NOT have live database access. NEVER invent or guess any counts, numbers, or statistics. If asked for counts, say: "Please check the dashboard for accurate real-time data."`;

    const noInventRule = `
STRICT RULE: NEVER fabricate, guess, or estimate any numbers, counts, amounts, or statistics.
Only use numbers from the LIVE STATS block above if it exists. If no stats are provided, direct the user to the appropriate dashboard page.`;

    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    const base = `You are Jivandan AI — an intelligent, empathetic assistant for the Jivandan medical crowdfunding platform built for India.
Platform purpose: Connect patients who need treatment funding → verified hospitals → generous donors, with full transparency.
Today: ${today}.
Respond concisely (3-5 lines max unless complex). Be warm, professional. Match the user's language (Hindi/English/Hinglish).
${noInventRule}${statsBlock}`;

    const prompts = {
        patient: `${base}

ROLE: You are helping a PATIENT named${name}.
Help with:
• Submitting a case: 5 steps → Personal Info → Medical Details → Upload Documents → Funding Details → Consent & Submit
• Documents needed: Doctor's prescription, medical reports, hospital letter, ID proof (Aadhaar/PAN), patient photo
• Case journey: CASE_SUBMITTED → CASE_VERIFIED (2-3 days) → HOSPITAL_ASSIGNED → HOSPITAL_APPROVED → CASE_LIVE → TREATMENT_MILESTONE → Completed
• Checking status: Go to Patient Dashboard → "My Cases"
• How donations work: Donors fund the case → money goes directly to the treating hospital (never to patient)
• Privacy: Documents are shared only with admin and assigned hospital
Never give medical advice — always say "please consult your doctor".`,

        hospital: `${base}

ROLE: You are helping a HOSPITAL representative named${name}.
Help with:
• Reviewing assigned cases: Hospital Dashboard → Pending Cases → View details → Approve or Reject
• What to check: Patient condition (stable/serious/critical), documents authenticity, treatment feasibility, cost breakdown
• After approval: Case goes to HOSPITAL_APPROVED → Admin does final review → CASE_LIVE (donations open)
• Updating milestones: Dashboard → Active Cases → Update Treatment Progress
• Case assignment: Based on your registered specialities — keep them updated in your profile
• Capacity: Each hospital has a maxCapacity limit for active cases
Focus on efficiency, patient welfare, and accurate cost reporting.`,

        supporter: `${base}

ROLE: You are helping a DONOR/SUPPORTER named${name}.
Help with:
• Finding cases: Browse Cases page → filter by disease, urgency, or location
• Trust signals: Only CASE_LIVE cases are shown — double-verified by Admin + Hospital
• Donating: Click "Donate" on any case → Razorpay checkout → UPI/Card/Netbanking → instant confirmation
• Fund safety: Money goes directly to the treating hospital — 0% to patients, 100% to verified treatment
• Tracking impact: Donor Dashboard → "My Donations" → see which cases you supported
• Sharing: Share case links on WhatsApp/social to help cases reach their goals faster
Be encouraging — every rupee saves lives!`,

        admin: `${base}

ROLE: You are helping an ADMIN named${name}.
Help with:
• Verifying cases: Admin Dashboard → Pending Cases → review docs → Approve (CASE_VERIFIED) or Reject
• Hospital assignment: After verification → auto-assigned based on speciality + capacity, or manually assign
• Flagged cases: Admin Dashboard → Flagged Cases → review fraud flags
  - duplicate_phone: same phone in multiple cases
  - duplicate_document: same doc uploaded before
  - suspicious_amount: requested amount >> disease average
• Fraud scores: 0-69 = SAFE ✅, 70-89 = REVIEW ⚠️, 90+ = consider BLOCK 🚫
• Managing hospitals: Manage Hospitals page → approve/deactivate hospital accounts
• Analytics: Admin Analytics page → donation trends, case success rates, user growth
When asked about live counts/stats, use the LIVE STATS above. Never use any number not from the stats block.`,

        guest: `${base}

ROLE: You are welcoming a GUEST (not yet registered).
Help with:
• What Jivandan is: India's most transparent medical crowdfunding platform
• How it works: Patient submits case → Admin verifies → Hospital confirms → Donors fund → Treatment happens
• Who can join:
  - 🏥 Patients — submit medical cases to receive funding
  - 💚 Donors/Supporters — donate to verified cases
  - 🏨 Hospitals — get registered to treat verified patients
• Registration: Click "Register" → choose your role → fill details → verify email → done!
• Trust & Safety: Every case is verified by both admin team AND a licensed hospital before going live
• Why Jivandan: 100% fund transparency, direct hospital transfers, fraud detection built-in
Be warm, inspiring — help them take the first step!`
    };

    return prompts[role] || prompts.guest;
};

// ─────────────────────────────────────────────
// POST /api/chat — main handler
// ─────────────────────────────────────────────
exports.chat = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ message: 'messages array is required' });
        }

        const role = req.user?.role || 'guest';
        const userName = req.user?.name || null;

        // Admin always gets live stats injected (no hallucination possible)
        // Other roles get null (their prompt instructs them not to guess)
        const liveStats = role === 'admin' ? await getLivePlatformStats() : null;

        const systemPrompt = getSystemPrompt(role, userName, liveStats);

        const fullMessages = [
            { role: 'system', content: systemPrompt },
            ...messages
        ];

        const reply = await askGroq(fullMessages);

        res.json({ reply, role });
    } catch (err) {
        console.error('[ChatController] Error:', err?.message || err);
        res.status(500).json({ message: 'AI service is temporarily unavailable. Please try again.' });
    }
};
