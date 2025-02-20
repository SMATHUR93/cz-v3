import { Handler } from "@netlify/functions";
import { db } from "../../lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const handler: Handler = async (event) => {
  if (event.httpMethod === "GET") {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  }

  if (event.httpMethod === "POST") {
    const { name, email } = JSON.parse(event.body || "{}");
    const newUserRef = await addDoc(collection(db, "users"), { name, email });
    return {
      statusCode: 201,
      body: JSON.stringify({ id: newUserRef.id, name, email }),
    };
  }
  
  return { 
    statusCode: 405, 
    body: "Method Not Allowed" 
  };
};

export { handler };


/* import { Context } from '@netlify/functions'

export default (request: Request, context: Context) => {
  try {
    const url = new URL(request.url)
    const subject = url.searchParams.get('name') || 'World'

    return new Response(`Hello ${subject}`)
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    })
  }
} */
