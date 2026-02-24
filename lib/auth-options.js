import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "./mongodb"
import bcrypt from "bcryptjs"

export const authOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("Auth failed: Missing email or password");
                    throw new Error('Invalid credentials');
                }

                const email = credentials.email.toLowerCase();
                const client = await clientPromise;
                const user = await client.db("bitlinks").collection("users").findOne({
                    email: email
                });

                if (!user || !user?.password) {
                    console.log(`Auth failed: User not found for ${email}`);
                    throw new Error('No user found');
                }

                const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordCorrect) {
                    console.log(`Auth failed: Incorrect password for ${email}`);
                    throw new Error('Invalid password');
                }

                console.log(`Auth successful for ${email}`);
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                };
            }

        })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
            }
            return session;
        }
    }
}
