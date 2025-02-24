import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Product } from '@/types';

interface ProductContextType {
  products: Product[];
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  /* updateProduct: (id: string, product: Product) => Promise<void>; */
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProduct must be used within a ProductProvider");
  return context;
};

const ProductProvider = ({ children }: { children: ReactNode }) => {

  const [products, setProducts] = useState<Product[]>([]);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const API_BASE = process.env.NODE_ENV === "development" ? "http://localhost:8888" : "";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserAuthenticated(!!user);
      if (user) {
        fetchProducts();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProducts = async () => {
    if (!userAuthenticated) {
      return; // Prevent fetching if not logged in
    }
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const token = await user.getIdToken();
    try {
      const response = await fetch(`${API_BASE}/.netlify/functions/fetchProducts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addProduct = async (product: Product) => {
    if (!userAuthenticated) {
      return; // Prevent fetching if not logged in
    }
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const token = await user.getIdToken();
    try {
      await fetch(`${API_BASE}/.netlify/functions/addProduct`, {
        method: "POST",
        body: JSON.stringify(product),
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  /* const updateProduct = async (id: string, product: Product) => {
    if (!userAuthenticated) {
      return; // Prevent fetching if not logged in
    }
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const token = await user.getIdToken();
    try {
      await fetch(`${API_BASE}/.netlify/functions/updateProduct`, {
        method: "PUT",
        body: JSON.stringify({ id, ...product }),
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  }; */

  const deleteProduct = async (id: string) => {
    if (!userAuthenticated) {
      return; // Prevent fetching if not logged in
    }
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const token = await user.getIdToken();
    try {
      await fetch(`${API_BASE}/.netlify/functions/deleteProduct`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <ProductContext.Provider value={{ products, fetchProducts, addProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
export default ProductProvider;