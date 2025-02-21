import { Handler } from "@netlify/functions";
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
