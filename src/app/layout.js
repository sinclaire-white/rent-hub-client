import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ModeToggle";
import Navbar from "@/components/Navbar";
import Banner from "@/components/ui/Banner";



export const metadata = {
  title: "Rent Hub",
  description: "Your go-to rent website",
};

export default function RootLayout({ children }) {
  return (
<<<<<<< HEAD
  <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
           <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <Navbar></Navbar>
          <Banner></Banner>
            {children}
          </ThemeProvider>
=======
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
>>>>>>> 7db84cfb1e1d7b6938acfe1b8ded1d51ae861f8f
      </body>
    </html>
  );
}
