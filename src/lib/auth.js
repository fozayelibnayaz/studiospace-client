import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

/** Shared mongo client with the Express API — same studiospaceDB.
 * (client.db() is synchronous; the driver connects lazily on first use) */
const client = globalThis.__mongoClient || new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017");
globalThis.__mongoClient = client;
const db = client.db(process.env.DB_NAME || "studiospaceDB");

export const auth = betterAuth({
  appName: "StudioSpace",
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  database: mongodbAdapter(db, {
    client,
    usePlural: true,
    // Standalone local MongoDB has no replica set → no transactions.
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId:
        process.env.GOOGLE_CLIENT_ID ||
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // seconds — light DB caching of session lookups
    },
  },
});
