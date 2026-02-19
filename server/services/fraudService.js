const DiseaseFee = require('../models/DiseaseFee');

/**
 * Checks if the requested amount for a disease is within standard range.
 * @param {string} diseaseName - Name of the disease
 * @param {number} requestedAmount - Amount requested by fundraiser
 * @returns {Promise<Object>} - Returns { fraudScore, fraudReason, fraudStatus }
 */
const checkFraud = async (diseaseName, requestedAmount) => {
    try {
        // Find matching disease in DiseaseFee collection (case-insensitive)
        const diseaseInfo = await DiseaseFee.findOne({
            diseaseName: { $regex: new RegExp(`^${diseaseName}$`, 'i') }
        });

        if (!diseaseInfo) {
            console.log(`Disease ${diseaseName} not found in database. Flagging for manual review.`);
            return {
                fraudScore: 10,
                fraudReason: 'Unknown disease: requires manual verification of treatment costs.',
                fraudStatus: 'REVIEW'
            };
        }

        const reqAmt = Number(requestedAmount);
        const maxAmt = Number(diseaseInfo.maxCost);

        console.log(`Checking fraud for: ${diseaseName}. Requested: ${reqAmt}, Standard Max: ${maxAmt}`);

        if (reqAmt > maxAmt) {
            console.log('FRAUD DETECTED: Requested amount exceeds standard range');
            return {
                fraudScore: 30,
                fraudReason: 'Requested amount higher than standard treatment cost',
                fraudStatus: 'REVIEW'
            };
        }

        return {
            fraudScore: 0,
            fraudReason: '',
            fraudStatus: 'SAFE'
        };
    } catch (error) {
        console.error('Fraud Service Error:', error);
        return {
            fraudScore: 0,
            fraudReason: 'Error in fraud check',
            fraudStatus: 'REVIEW' // Default to review on error for safety
        };
    }
};

module.exports = { checkFraud };
