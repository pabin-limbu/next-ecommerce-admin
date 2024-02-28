// For authentication.
// This contains the dynamic route handler for NextAuth.js which will also contain all of your global NextAuth.js configurations.
// /All requests to /api/auth/* (signIn, callback, signOut, etc.) will automatically be handled by NextAuth.js.

import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const adminEmail = ["limbupabin337@gmail.com", "changsu.pabin337@gmail.com"];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ session, token, user }) => {
      if (adminEmail.includes(session?.user?.email)) return session; // authorize the valid email to login the admin page.
      return false;
    },
  },
  secret: process.env.JWT_SECRET,
  
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!adminEmail.includes(session?.user?.email)) {
    res.status(401).json({ message: "not an admmin" });
    throw new Error("not an admin");
  }
}
