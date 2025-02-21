import React, { createContext, useContext, useState, ReactNode } from 'react';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within an AuthProvider");
	return context;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);

	const register = async (email: string, password: string) => {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		setUser(userCredential.user);
	};

	const login = async (email: string, password: string) => {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		setUser(userCredential.user);
	};

	const logout = async () => {
		await signOut(auth);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
export default AuthProvider;