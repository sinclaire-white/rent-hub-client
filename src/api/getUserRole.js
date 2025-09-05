
import User from '../../models/User';
import { connectDB } from '../../lib/mongodb';

export async function GET(request) {
    try {
        await connectDB();
        const user = await User.findOne({ email: 'user@example.com' }); // এখানে email ডাইনামিকভাবে নিতে পারো
        if (user) {
            return new Response(JSON.stringify({ role: user.role }), {
                status: 200,
            });
        } else {
            return new Response('User not found', { status: 404 });
        }
    } catch (error) {
        return new Response('Error fetching user', { status: 500 });
    }
}
