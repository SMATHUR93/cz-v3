import { Handler } from "@netlify/functions";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export const handler: Handler = async (event) => {
  try {
    const { name, price } = JSON.parse(event.body || "{}");
    if (!name || !price) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }
    const docRef = await addDoc(collection(db, "products"), { name, price });
    return {
      statusCode: 201,
      body: JSON.stringify({ id: docRef.id, name, price }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to add product error = " + e }),
    };
  }
};
