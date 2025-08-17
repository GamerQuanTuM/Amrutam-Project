import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Navbar isDashboard={false} />
      <div>{children}</div>
      <Footer />
    </main>
  );
}
