import NextAuth, { CredentialsSignin } from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { User } from "./models/userModel"
import {compare} from "bcryptjs"
import { connectToDatabase } from "./lib/utils"
 
// connect with db
// custom db

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialProvider({
        name: " credentials",
        credentials:{
            email: {
                label: "Email",
                type: "email"
            },
            password: {
                label: "Password",
                type: "password"
            }
        },
        authorize: async (credentials) => {
            const email = credentials?.email as string;
            const password = credentials?.password as string;
          
            if (!email || !password) {
              return null; // Return null if email or password is missing
            }
          
            await connectToDatabase();
          
            const user = await User.findOne({ email }).select("+password");
          
            if (!user) {
              return null; // Return null if user is not found
            }
          
            if (!user.password) {
              return null; // Return null if password is missing
            }
          
            const isMatch = await compare(password, user.password);
          
            if (!isMatch) {
              return null; // Return null if password does not match
            }
          
            return { name: user.name, email: user.email }; // Return user object if authentication is successful
          }
          
    })
  ],
  pages: {
    signIn: "/login"
  }
})

