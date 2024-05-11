import { Footer } from "./footer";
import { Header } from "./header";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="min-h-[93vh]">
        {children}
      </div>
      <Footer />
    </>
  );
}
