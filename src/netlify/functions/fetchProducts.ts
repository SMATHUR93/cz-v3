import { Handler } from "@netlify/functions";
import * as admin from "firebase-admin";
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

const db = admin.firestore();

const handler: Handler = async (event, context) => {
    console.log(`event is ${event}`);
    console.log(`context is ${context}`);
    try {
        const snapshot = await db.collection("products").get();
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return {
            statusCode: 200,
            body: JSON.stringify(products),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error }) };
    }
};

export { handler };



/* import { Handler } from "@netlify/functions";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const handler: Handler = async (event, context) => {
    const user = context.clientContext?.user;
    if (!user) {
        return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
    }
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        return {
            statusCode: 200,
            body: JSON.stringify(products)
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch products = " + e }),
        };
    }
};
 */