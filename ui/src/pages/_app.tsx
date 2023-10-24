import { Header } from "@/components/header";
import { Outlet, useRouteError } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "sonner";
import Footer from "@/components/footer";

export const Catch = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex justify-center p-8">🥺 Something went wrong...!</div>
  );
};

export const Pending = () => <div>Loading from _app...</div>;

export default function App() {
  const queryClient = new QueryClient();
  const path = window.location.pathname;

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Header />
        <main>
          <Outlet />
        </main>
        <Toaster richColors />
        {path !== "/feed-deck" ? <Footer /> : null}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
