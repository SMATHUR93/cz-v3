import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../types";

interface UserContextType {
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  deleteUser: (id: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<User[]>([]);
    const addUser = (user: User) => setUsers([...users, user]);
    const deleteUser = (id: number) => setUsers(users.filter(user => user.id !== id));
    return (
        <UserContext.Provider value={{ 
            users, 
            setUsers,
            addUser, 
            deleteUser 
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be inside a UserProvider");
    }
    return context;
};
