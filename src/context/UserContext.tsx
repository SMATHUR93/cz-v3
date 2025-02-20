import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from '@/types';

interface UserContextType {
  users: User[];
  addUser: (user: User) => Promise<void>;
  // updateUser: (id: string, user: User) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUsers must be used within a UserProvider");
  return context;
};

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(typeof window !== "undefined" ? [] : []);

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent running on the server
    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, 'users'));
        setUsers(querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
            } as unknown as User)
        ));
    };
    fetchUsers();
  }, []);
  
  const addUser = async (user: User) => {
    const docRef = await addDoc(collection(db, 'users'), user);
    setUsers([...users, { 
            id: docRef.id, 
            name: user.name, 
            email: user.email 
        } as unknown as User
    ]);
  };
  
  /* const updateUser = async (id: string, user: User) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, user);
    setUsers(users.map(u => (u.id === id ? { ...u, ...user } : u)));
  }; */
  
  const deleteUser = async (id: number) => {
    await deleteDoc(doc(db, 'users', id.toString()));
    setUsers(users.filter(user => user.id !== id));
  };
  
  return (
    <UserContext.Provider value={{ users, addUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
