import { Handler } from "@netlify/functions";
import { db } from "../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const handler: Handler = async (event) => {
  try {
    const { id, name, price } = JSON.parse(event.body || "{}");

    if (!id || !name || !price) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    await updateDoc(doc(db, "products", id), { name, price });

    return {
      statusCode: 200,
      body: JSON.stringify({ id, name, price }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update product = " + e }),
    };
  }
};
