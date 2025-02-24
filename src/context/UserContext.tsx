import React from "react";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { User } from "@/types";

interface UserContextType {
  users: User[];
  fetchUsers: () => Promise<void>;
  addUser: (user: User) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within an UserProvider");
  }
  return context;
}

console.log(`useUserContext  = ${useUserContext}`);

const UserProvider = ({ children }: { children: ReactNode }) => {

  const [users, setUsers] = useState<User[]>([]);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const API_BASE = process.env.NODE_ENV === "development" ? "http://localhost:8888" : "";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserAuthenticated(!!user);
      if (user) {
        fetchUsers();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUsers = async () => {
    if (!userAuthenticated) {
      return; // Prevent fetching if not logged in
    }
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const token = await user.getIdToken();

    try {
      const response = await fetch(`${API_BASE}/.netlify/functions/fetchUsers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const addUser = async (user: User) => {
    try {
      await fetch(`${API_BASE}/.netlify/functions/addUser`, {
        method: "POST",
        body: JSON.stringify(user),
      });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  /* const updateUser = async (id: string, user: User) => {
    try {
      await fetch(`${API_BASE}/.netlify/functions/updateUser`, {
        method: "PUT",
        body: JSON.stringify({ id, ...user }),
      });
      fetchProducts();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }; */

  const deleteUser = async (id: string) => {
    try {
      await fetch(`${API_BASE}/.netlify/functions/deleteUser`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <UserContext.Provider value={{ users, fetchUsers, addUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;