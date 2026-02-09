const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/Donation');
const MedicalCase = require('../models/MedicalCase');

let razorpay = null;

const getRazorpayInstance = () => {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        if (!razorpay) {
            razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });
        }
        return razorpay;
    }
    throw new Error('Razorpay credentials are not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file');
};

exports.createOrder = async (req, res) => {
    try {
        const razorpay = getRazorpayInstance();
        const { amount, caseId } = req.body;
        const options = {
            amount: amount * 100, // amount in paisa
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Find the case to get the patientId (caseId in Donation model seems to refer to MedicalCase)
        const medicalCase = await MedicalCase.findById(caseId);
        if (!medicalCase) return res.status(404).json({ message: 'Medical case not found' });

        const donation = new Donation({
            supporterId: req.user.id,
            caseId: medicalCase._id,
            amount,
            razorpayOrderId: order.id,
        });
        await donation.save();

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ message: 'Razorpay credentials are not configured' });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        const donation = await Donation.findOne({ razorpayOrderId: razorpay_order_id });
        if (!donation) return res.status(404).json({ message: 'Donation record not found' });

        donation.razorpayPaymentId = razorpay_payment_id;
        donation.status = 'completed';
        await donation.save();

        // Update case collected amount
        const medicalCase = await MedicalCase.findById(donation.caseId);
        if (medicalCase) {
            medicalCase.amountCollected += donation.amount;
            if (medicalCase.amountCollected >= medicalCase.amountRequired) {
                medicalCase.status = 'completed';
            }
            await medicalCase.save();
        }

        res.json({ success: true, message: 'Payment verified and donation completed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

