import Navbar from "../../components/navbar"
export default function RootLayout({ children }) {
  return (
      <>
        <Navbar />
        {children}
      </>
  );
}
