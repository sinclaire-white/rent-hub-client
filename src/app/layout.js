
import { authOptions } from '@/lib/authOptions';
import SessionProviderWrapper from '@/Providers/SessionProvider';
import { getServerSession } from 'next-auth';
import LayoutWrapper from './components/LayoutWrapper';
import './globals.css';
export const metadata = {
  title: "RentHub",
  description: "Rental platform for all kinds of assets",
};

export default async function RootLayout({ children }) {
    const session = await getServerSession(authOptions);
    const safeSession = session
        ? {
              ...session,
              user: {
                  ...session.user,
                  id: session?.user?.id ? session.user.id.toString() : null,
              },
          }
        : null;
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <SessionProviderWrapper session={safeSession}>
                    <LayoutWrapper>{children}</LayoutWrapper>
                </SessionProviderWrapper>
            </body>
        </html>
    );
}