import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

/** Shared mongo client with the Express API — same studiospaceDB. */
let clientPromise = globalThis.__mongoClientPromise;

if (!clientPromise) {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
  clientPromise = new MongoClient(uri).connect();
  globalThis.__mongoClientPromise = clientPromise;
}

export const auth = betterAuth({
  appName: "StudioSpace",
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  database: mongodbAdapter(clientPromise, { usePlural: true }),
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
