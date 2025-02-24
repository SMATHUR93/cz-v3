import * as admin from "firebase-admin";
import { HandlerEvent } from "@netlify/functions";

// Ensure Firebase Admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

export const authenticate = async (event: HandlerEvent) => {
  try {
    const authHeader = event.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized: No token provided" }) };
    }

    const token = authHeader.split("Bearer ")[1];
    await admin.auth().verifyIdToken(token);

    return null; // ✅ Authentication successful, proceed with the request
  } catch (error) {
    return { statusCode: 403, body: JSON.stringify({ error: "Forbidden: Invalid token" }) };
  }
};
