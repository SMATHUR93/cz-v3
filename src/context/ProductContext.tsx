import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
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
    if (!userAuthenticated) return; // Prevent fetching if not logged in
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addProduct = async (product: Product) => {
    await addDoc(collection(db, 'products'), product);
    fetchProducts();
  };

  /* const updateProduct = async (id: string, product: Product) => {
    await updateDoc(doc(db, 'products', id), product);
    fetchProducts();
  }; */

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
    fetchProducts();
  };
  
  return (
    <ProductContext.Provider value={{ products, fetchProducts, addProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
export default ProductProvider;