import "@/styles/globals.css";
import { AuthProvider } from '@/core/context/AuthContext';

export const metadata = {
  title: "Elevate Your English Campus",
  description: "Campus de aprendizaje de inglés",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
