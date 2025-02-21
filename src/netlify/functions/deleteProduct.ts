import { Handler } from "@netlify/functions";
import { db } from "../../lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export const handler: Handler = async (event) => {
  try {
    const { id } = JSON.parse(event.body || "{}");
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing product ID" }),
      };
    }
    await deleteDoc(doc(db, "products", id));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Product deleted successfully" }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to delete product error = " + e }),
    };
  }
};
