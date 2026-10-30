import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { memoryAdapter, type MemoryDB } from "better-auth/adapters/memory";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

/**
 * Better Auth owns identity: `user`, `session`, `account`, `verification`, and
 * the `jwks` table used to sign API tokens. The Express service validates those
 * tokens against `/api/auth/jwks` and never touches passwords.
 *
 * MongoDB is the production path. `AUTH_DEV_MEMORY=1` swaps in the official
 * in-memory adapter so the whole flow can be exercised on a machine without a
 * reachable mongod. The memory store resets when the server restarts.
 */

const useMemory = process.env.AUTH_DEV_MEMORY === "1";

const globalForAuth = globalThis as typeof globalThis & {
  __communovaAuthMongo?: { client: MongoClient; db: ReturnType<MongoClient["db"]> };
  __communovaAuthMemory?: MemoryDB;
};

function authDatabase() {
  if (!globalForAuth.__communovaAuthMongo) {
    const client = new MongoClient(process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/communova", {
      appName: "communova-web",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5_000,
    });

    globalForAuth.__communovaAuthMongo = {
      client,
      db: client.db(process.env.MONGODB_DB ?? "communova"),
    };
  }

  return globalForAuth.__communovaAuthMongo;
}

/**
 * Kept on `globalThis` so the route handler and server components share one
 * store even when Next.js evaluates this module in separate bundles.
 */
const memoryDb = (globalForAuth.__communovaAuthMemory ??= {
  user: [],
  session: [],
  account: [],
  verification: [],
  jwks: [],
});

const database = useMemory
  ? memoryAdapter(memoryDb)
  : (() => {
      const { client, db } = authDatabase();
      // Local standalone mongod cannot run transactions; Atlas replica sets can.
      return mongodbAdapter(db, { client, transaction: false });
    })();

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export const auth = betterAuth({
  appName: "Communova",
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,

  database,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    requireEmailVerification: false,
    autoSignIn: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      prompt: "select_account",
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  user: {
    // `image` is Better Auth's built-in field — the UI labels it "Photo URL".
    changeEmail: { enabled: false },
  },

  plugins: [
    jwt({
      jwt: {
        issuer: baseURL,
        audience: "communova-api",
        expirationTime: "15m",
      },
    }),
    // Must stay last: it forwards Set-Cookie headers from server actions.
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = Session["user"];
