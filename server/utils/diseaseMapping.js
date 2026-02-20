// Disease to Medical Speciality Mapping
// This ensures automatic assignment to the correct hospital department

const diseaseToSpecialityMap = {
    // Cardiology
    "Coronary Artery Disease": "Cardiology",
    "Heart Failure": "Cardiology",
    "Congenital Heart Defect": "Cardiology",

    // Oncology
    "Leukemia": "Oncology",
    "Breast Cancer": "Oncology",
    "Lung Cancer": "Oncology",
    "Brain Tumor": "Oncology",

    // Endocrinology
    "Type 1 Diabetes": "Endocrinology",
    "Type 2 Diabetes": "Endocrinology",

    // Nephrology
    "Chronic Kidney Disease": "Nephrology",
    "Kidney Stones": "Nephrology",

    // Gastroenterology
    "Liver Cirrhosis": "Gastroenterology",
    "Hepatitis": "Gastroenterology",
    "Appendicitis": "General Surgery",

    // Neurology
    "Alzheimer's": "Neurology",
    "Parkinson's": "Neurology",
    "Multiple Sclerosis": "Neurology",

    // Rheumatology
    "Osteoarthritis": "Rheumatology",
    "Rheumatoid Arthritis": "Rheumatology",

    // Pulmonology
    "COPD": "Pulmonology",
    "Asthma": "Pulmonology",
    "Tuberculosis": "Pulmonology",
    "Pneumonia": "Pulmonology",

    // Ophthalmology
    "Cataract": "Ophthalmology",
    "Glaucoma": "Ophthalmology",

    // Psychiatry
    "Schizophrenia": "Psychiatry",
    "Bipolar Disorder": "Psychiatry",
    "Depression": "Psychiatry",

    // Infectious Diseases / Emergency Medicine
    "Septicemia": "Critical Care (ICU)",
    "Dengue / Malaria": "Infectious Diseases",

    // Default fallback
    "Other": "General Surgery"
};

/**
 * Get the required medical speciality for a disease
 * @param {string} disease - The disease name
 * @returns {string} - The medical speciality needed
 */
function getSpecialityForDisease(disease) {
    if (!disease) return "General Surgery";

    // Direct match
    if (diseaseToSpecialityMap[disease]) {
        return diseaseToSpecialityMap[disease];
    }

    // Partial match (case-insensitive)
    const diseaseLower = disease.toLowerCase();
    for (const [key, value] of Object.entries(diseaseToSpecialityMap)) {
        if (key.toLowerCase().includes(diseaseLower) || diseaseLower.includes(key.toLowerCase())) {
            return value;
        }
    }

    // Default fallback
    return "General Surgery";
}

module.exports = {
    diseaseToSpecialityMap,
    getSpecialityForDisease
};
