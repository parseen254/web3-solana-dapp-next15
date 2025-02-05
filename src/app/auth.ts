import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { type User } from "next-auth";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

// Rate limiting map
const attemptsByIP = new Map<string, { count: number; firstAttempt: number }>();

export const { handlers, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/", // Use home page as the signin page
    signOut: "/", // Redirect to home after signout
    error: "/", // Show errors on home page
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (trigger === "signIn" && user) {
        token.publicKey = user.id;
        token.lastRefresh = Date.now();
      }
      // Refresh token if it's older than 23 hours
      if (token.lastRefresh && Date.now() - token.lastRefresh > 23 * 60 * 60 * 1000) {
        token.lastRefresh = Date.now();
      }
      // Always return the token to keep the public key between refreshes
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.publicKey) {
        // Add the public key to the session user object
        session.user.id = token.publicKey as string;
        session.user.email = `${token.publicKey}@solana`;
        session.user.name = `Solana User (${token.publicKey.slice(0, 4)}...${token.publicKey.slice(-4)})`;
        session.expires = new Date(token.lastRefresh + (30 * 24 * 60 * 60 * 1000)).toISOString();
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Solana Wallet",
      credentials: {
        publicKey: { label: "Public Key", type: "text" },
        signature: { label: "Signature", type: "text" },
        message: { label: "Message", type: "text" },
        csrfToken: { label: "CSRF Token", type: "text" },
      },
      async authorize(
        credentials: Partial<
          Record<"publicKey" | "signature" | "message", unknown>
        >,
        request: Request
      ): Promise<User | null> {
        try {
          // Security validations using request
          const clientIp = request.headers.get("x-forwarded-for") || "unknown";
          const origin = request.headers.get("origin");

          // Rate limiting (5 attempts per 15 minutes)
          const now = Date.now();
          const attempts = attemptsByIP.get(clientIp) || {
            count: 0,
            firstAttempt: now,
          };

          if (now - attempts.firstAttempt > 900000) {
            // 15 minutes
            attempts.count = 1;
            attempts.firstAttempt = now;
          } else if (attempts.count >= 5) {
            throw new Error("Too many login attempts. Please try again later.");
          } else {
            attempts.count++;
          }
          attemptsByIP.set(clientIp, attempts);

          // Allowed origins check
          const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
          if (origin && !allowedOrigins.includes(origin)) {
            throw new Error("Invalid request origin");
          }

          const { publicKey, signature, message } = credentials;

          if (!publicKey || !signature || !message) {
            throw new Error("Missing authentication data");
          }

          // Convert data for verification
          const publicKeyBytes = new PublicKey(publicKey.toString()).toBytes();
          const messageBytes = new TextEncoder().encode(message.toString());
          const signatureBytes = Buffer.from(signature.toString(), "base64");

          // Verify signature
          const isValid = nacl.sign.detached.verify(
            messageBytes,
            signatureBytes,
            publicKeyBytes
          );

          if (!isValid) {
            throw new Error("Invalid signature");
          }

          return {
            id: publicKey.toString(),
            name: `Solana User`,
            email: `${publicKey.toString()}@solana`,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  events: {
    async signIn({ user, isNewUser }) {
      console.log("Successful sign in", {
        user,
        timestamp: new Date().toISOString(),
        isNewUser,
      });
    },
    async signOut(message) {
      const data = "token" in message ? message.token : message.session;
      const timestamp = new Date().toISOString();

      console.log("Sign out", {
        data,
        timestamp,
      });
    },
  },
});

// Add type declarations
declare module "next-auth/jwt" {
  interface JWT {
    publicKey: string;
    lastRefresh?: number;
  }
}
