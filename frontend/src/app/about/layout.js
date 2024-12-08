import Navbar from "../[uname]/components/navbar"
export default function RootLayout({ children }) {
  return (
      <body>
        <header>
        </header>
        <Navbar />
        {children}
      </body>
  );
}
