import type { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import UserProvider from '../context/UserContext';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
/* import { AuthProvider } from '../context/AuthContext'; */

function MyApp({ Component, pageProps }: AppProps) {
    return (
      <AuthProvider>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </AuthProvider>
    );
  }

export default MyApp;
