import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                await dbConnect();
                
                const user = await User.findOne({ email: credentials.email });
                if (!user) throw new Error('User not found');
                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password,
                );
                if (!isValid) throw new Error('Invalid password');
                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = user.role;
            return token;
        },
        async session({ session, token }) {
            session.user.role = token.role;
            return session;
        },
    },
});

export { handler as GET, handler as POST };
