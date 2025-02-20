import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const UserContext = createContext<any>(null);

export const useUsers = () => useContext(UserContext);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUsers();
  }, []);
  
  const addUser = async (user: { name: string; email: string }) => {
    const docRef = await addDoc(collection(db, 'users'), user);
    setUsers([...users, { id: docRef.id, ...user }]);
  };
  
  const updateUser = async (id: string, user: { name: string; email: string }) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, user);
    setUsers(users.map(u => (u.id === id ? { ...u, ...user } : u)));
  };
  
  const deleteUser = async (id: string) => {
    await deleteDoc(doc(db, 'users', id));
    setUsers(users.filter(user => user.id !== id));
  };
  
  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;