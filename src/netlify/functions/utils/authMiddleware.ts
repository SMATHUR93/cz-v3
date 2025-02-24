import * as admin from "firebase-admin";
import { HandlerEvent } from "@netlify/functions";
import * as fs from "fs";
import * as path from "path";

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  let serviceAccount: admin.ServiceAccount;

  console.log(`process.env.NETLIFY = ${process.env.NETLIFY}`);
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // 🔹 Use Netlify Environment Variable in Production
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
  } else {
    // 🔹 Use Local JSON File in Development
    const serviceAccountPath = path.resolve(__dirname, "../../../../../../src/lib/firebase-service-account.json");
    console.log(`serviceAccountPath = ${serviceAccountPath}`);
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error("Missing firebase-service-account.json file. Make sure to add it locally.");
    }
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const authenticate = async (event: HandlerEvent) => {
  try {
    const authHeader = event.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized: No token provided" }) };
    }

    const token = authHeader.split("Bearer ")[1];
    console.log(`token response  = ${token}`);
    const response = await admin.auth().verifyIdToken(token);
    console.log(`verifyIdToken response  = ${response}`);

    return null; // ✅ Authentication successful, proceed with the request
  } catch (error) {
    return { statusCode: 403, body: JSON.stringify({ error: `Forbidden: Invalid token = ${error}` }) };
  }
};
