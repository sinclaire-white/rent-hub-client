import mongoose from 'mongoose';

let isConnected = false;

export default async function dbConnect() {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('✅ MongoDB Connected');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
    }
}
