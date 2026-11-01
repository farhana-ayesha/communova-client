import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { memoryAdapter, type MemoryDB } from "better-auth/adapters/memory";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { isGoogleConfigured } from "@/lib/oauth";

/**
 * Better Auth owns identity: `user`, `session`, `account`, `verification`, and
 * the `jwks` table used to sign API tokens. The Express service validates those
 * tokens against `/api/auth/jwks` and never touches passwords.
 *
 * MongoDB is the production path. `AUTH_DEV_MEMORY=1` swaps in the official
 * in-memory adapter so the whole flow can be exercised on a machine without a
 * reachable mongod. The memory store resets when the server restarts, so it is
 * refused at production runtime.
 */

const isProduction = process.env.NODE_ENV === "production";
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
const isProductionRuntime = isProduction && !isBuildPhase;
const useMemory = process.env.AUTH_DEV_MEMORY === "1";

if (isProductionRuntime) {
  if (useMemory) {
    throw new Error(
      "AUTH_DEV_MEMORY cannot be used in production. Point MONGODB_URI at a persistent MongoDB deployment.",
    );
  }

  if (!process.env.BETTER_AUTH_SECRET?.trim()) {
    throw new Error("BETTER_AUTH_SECRET is required in production.");
  }

  if (!process.env.MONGODB_URI?.trim()) {
    throw new Error("MONGODB_URI is required in production.");
  }

  if (!process.env.BETTER_AUTH_URL?.trim()) {
    throw new Error("BETTER_AUTH_URL is required in production.");
  }
}

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
const googleEnabled = isGoogleConfigured();

/** Password endpoints and the field each one carries. */
const PASSWORD_FIELDS: Record<string, string> = {
  "/sign-up/email": "password",
  "/change-password": "newPassword",
  "/reset-password": "newPassword",
  "/set-password": "newPassword",
};

function assertStrongPassword(password: string) {
  if (password.length < 6) {
    throw new APIError("BAD_REQUEST", { message: "Use at least 6 characters." });
  }
  if (password.length > 128) {
    throw new APIError("BAD_REQUEST", {
      message: "Use 128 characters or fewer.",
    });
  }
  if (!/[A-Z]/.test(password)) {
    throw new APIError("BAD_REQUEST", {
      message: "Include at least one uppercase letter.",
    });
  }
  if (!/[a-z]/.test(password)) {
    throw new APIError("BAD_REQUEST", {
      message: "Include at least one lowercase letter.",
    });
  }
}

function assertDisplayName(name: unknown) {
  if (typeof name !== "string") {
    throw new APIError("BAD_REQUEST", { message: "Enter your display name." });
  }

  const trimmed = name.trim();
  if (trimmed.length < 2) {
    throw new APIError("BAD_REQUEST", {
      message: "Use at least 2 characters for your display name.",
    });
  }
  if (trimmed.length > 60) {
    throw new APIError("BAD_REQUEST", {
      message: "Use 60 characters or fewer for your display name.",
    });
  }
}

function assertPhotoUrl(image: unknown) {
  if (image === undefined || image === null) return;

  if (typeof image !== "string") {
    throw new APIError("BAD_REQUEST", { message: "Enter a valid photo URL." });
  }

  const trimmed = image.trim();
  if (trimmed.length === 0) return;

  if (trimmed.length > 2048 || !/^https?:\/\/\S+$/i.test(trimmed)) {
    throw new APIError("BAD_REQUEST", {
      message: "Use a full photo URL starting with http:// or https://.",
    });
  }
}

/**
 * Mirrors the browser-side rules in `lib/validations/auth.ts`. The form is
 * convenience; this hook is the policy every client is held to.
 */
const validateCredentials = createAuthMiddleware(async (ctx) => {
  const body = (ctx.body ?? {}) as Record<string, unknown>;

  if (ctx.path === "/sign-up/email") {
    assertDisplayName(body.name);
    assertPhotoUrl(body.image);
  }

  if (ctx.path === "/update-user") {
    if (body.name !== undefined) assertDisplayName(body.name);
    assertPhotoUrl(body.image);
  }

  const passwordField = PASSWORD_FIELDS[ctx.path];
  if (passwordField) {
    const password = body[passwordField];
    if (typeof password !== "string") {
      throw new APIError("BAD_REQUEST", { message: "Enter a password." });
    }
    assertStrongPassword(password);
  }
});

export const auth = betterAuth({
  appName: "Communova",
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [baseURL],

  database,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    requireEmailVerification: false,
    autoSignIn: true,
  },

  // The provider is only registered when real keys exist, so a placeholder
  // environment cannot send a visitor to a broken Google error page.
  ...(googleEnabled
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            prompt: "select_account" as const,
          },
        },
      }
    : {}),

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

  hooks: {
    before: validateCredentials,
  },

  rateLimit: {
    // Matches Better Auth's default: protect production, keep local work fast.
    enabled: isProduction,
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 10 },
      "/sign-up/email": { window: 60, max: 5 },
      "/change-password": { window: 60, max: 5 },
      "/reset-password": { window: 60, max: 5 },
    },
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
