require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const updateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const hashedPassword = await bcrypt.hash('admin786', 12);

        const result = await User.findOneAndUpdate(
            { email: 'inamdarsahil708@gmail.com' },
            { password: hashedPassword },
            { new: true }
        );

        if (result) {
            console.log('Admin password updated successfully to admin786');
        } else {
            console.log('Admin user not found. Creating new admin...');
            const admin = new User({
                name: 'Admin',
                email: 'inamdarsahil708@gmail.com',
                password: hashedPassword,
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created successfully');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error updating admin:', err);
        process.exit(1);
    }
};

updateAdmin();
