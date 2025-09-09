import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "./mongodb";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("RentHub");
        const users = db.collection("users");

        const user = await users.findOne({ email: credentials.email });
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const client = await clientPromise;
        const db = client.db("RentHub");
        const users = db.collection("users");

        const existingUser = await users.findOne({ email: user.email });
        if (!existingUser) {
          await users.insertOne({
            firstName: user.name?.split(" ")[0] || "",
            lastName: user.name?.split(" ").slice(1).join(" ") || "",
            email: user.email,
            image: user.image || null,
            role: "renter",
            createdAt: new Date(),
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.phone = user.phone;
        token.gender = user.gender;
        token.image = user.image;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.email = token.email;
        session.user.phone = token.phone;
        session.user.gender = token.gender;
        session.user.image = token.image;
        session.user.role = token.role;

        // Optionally fetch bookmarks
        const client = await clientPromise;
        const db = client.db("RentHub");
        const bookmarks = await db.collection("bookmarks")
          .find({ userId: new ObjectId(token.id) })
          .toArray();
        session.user.bookmarks = bookmarks.map(b => b.listingId.toString());
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
};