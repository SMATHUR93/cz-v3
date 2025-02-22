import { Handler } from "@netlify/functions";
import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  let serviceAccount: admin.ServiceAccount;

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

const db = admin.firestore();

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const { name, price } = JSON.parse(event.body || "{}");
    if (!name || !price) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }
    const docRef = await db.collection("products").add({ name, price })
    return {
      statusCode: 201,
      body: JSON.stringify({ id: docRef.id, name, price }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error }) };
  }
};
