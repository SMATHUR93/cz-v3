import type { AppProps } from 'next/app';
import UserProvider from '../context/UserContext';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
/* import { AuthProvider } from '../context/AuthContext'; */

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    );
  }

export default MyApp;
