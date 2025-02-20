import { Handler } from '@netlify/functions';
import { db } from '../../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';

const handler: Handler = async (event) => {
  try {
    const { name, email } = JSON.parse(event.body || '{}');
    if (!name || !email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }) };
    }
    const docRef = await addDoc(collection(db, 'users'), { name, email });
    return { statusCode: 200, body: JSON.stringify({ id: docRef.id }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
export { handler };