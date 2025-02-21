import type { AppProps } from 'next/app';
import ProductProvider from '../context/ProductContext';
import AuthProvider from '../context/AuthContext';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <ProductProvider>
                <Component {...pageProps} />
            </ProductProvider>
        </AuthProvider>    
    );
  }

export default MyApp;
