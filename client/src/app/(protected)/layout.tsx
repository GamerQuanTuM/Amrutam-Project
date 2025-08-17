import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="h-1/4">
        <Navbar />
      </div>
      <div className="flex-grow">{children}</div>
      <div className="h-1/4">
        <Footer />
      </div>
    </main>
  );
}
