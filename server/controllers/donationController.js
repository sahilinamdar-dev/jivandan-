const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/Donation');
const MedicalCase = require('../models/MedicalCase');
const Donor = require('../models/Donor');

let razorpay = null;

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials are not configured');
  }

  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpay;
};



// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  try {
    const { amount, caseId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid donation amount' });
    }

    // find medical case
    const medicalCase = await MedicalCase.findById(caseId);
    if (!medicalCase) {
      return res.status(404).json({ message: 'Medical case not found' });
    }

    if (medicalCase.status === 'completed') {
      return res.status(400).json({ message: 'Case already completed' });
    }

    // find donor profile of logged-in supporter
    const donor = await Donor.findOne({ user: req.user.id });
    if (!donor) {
      return res.status(400).json({ message: 'Donor profile not found' });
    }

    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // create pending donation
    await Donation.create({
      donor: donor._id,
      supporterUser: req.user.id,
      medicalCase: medicalCase._id,
      amount,
      razorpayOrderId: order.id,
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ================= VERIFY PAYMENT =================
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const donation = await Donation.findOne({ razorpayOrderId: razorpay_order_id });
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // update donation
    donation.razorpayPaymentId = razorpay_payment_id;
    donation.status = 'completed';
    await donation.save();

    // update case collected amount
    const medicalCase = await MedicalCase.findById(donation.medicalCase);
    if (medicalCase) {
      medicalCase.amountCollected += donation.amount;

      if (medicalCase.amountCollected >= medicalCase.amountRequired) {
        medicalCase.status = 'completed';
      }

      await medicalCase.save();
    }

    // update donor stats
    const donor = await Donor.findById(donation.donor);
    if (donor) {
      donor.totalDonatedAmount += donation.amount;
      donor.donationCount += 1;
      await donor.save();
    }

    res.json({ success: true, message: 'Payment verified successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
