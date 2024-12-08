import Navbar from "./[uname]/components/navbar";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
        </header>
        {children}
      </body>
    </html>
  );
}
