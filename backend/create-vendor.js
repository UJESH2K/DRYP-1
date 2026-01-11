require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDatabase = require('./src/config/database');
const User = require('./src/models/User');

const createVendorAccount = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI not found in .env file");
    }
    
    await connectDatabase(mongoURI);
    console.log('Database connected...');

    const email = 'ujeshyadav007@gmail.com';
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.role === 'vendor') {
        console.log(`✅ Vendor account already exists with email: ${email}`);
        console.log(`   User ID: ${existingUser._id}`);
        console.log(`   Name: ${existingUser.name}`);
        return;
      } else {
        // Update existing user to vendor role
        existingUser.role = 'vendor';
        await existingUser.save();
        console.log(`✅ Updated existing user to vendor role: ${email}`);
        console.log(`   User ID: ${existingUser._id}`);
        return;
      }
    }

    // Create new vendor account
    const hashedPassword = await bcrypt.hash('vendor123', 10);
    
    const vendor = new User({
      name: 'Ujesh Yadav',
      email: email,
      passwordHash: hashedPassword,
      role: 'vendor'
    });

    await vendor.save();
    console.log('✅ Vendor account created successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Password: vendor123`);
    console.log(`   User ID: ${vendor._id}`);
    console.log(`   Name: ${vendor.name}`);
    console.log('\n🔑 You can now login with these credentials in both:');
    console.log('   - Mobile app (frontend)');
    console.log('   - Web vendor hub (website at http://localhost:3000/login)');

  } catch (error) {
    console.error('❌ Error creating vendor account:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDatabase disconnected.');
  }
};

createVendorAccount();
