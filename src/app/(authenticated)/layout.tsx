import Navbar from "@/app/components/nav";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
