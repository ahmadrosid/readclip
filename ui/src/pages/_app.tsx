import { Outlet, useRouteError } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "sonner";
import { MainLayout } from "@/components/main-layout";

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
  // const path = window.location.pathname;

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {/* {path === "/404" ? null : <Header />} */}
        <MainLayout>
          <Outlet />
        </MainLayout>
        <Toaster richColors />
        {/* {["/feed-deck",'/404'].includes(path) ? null : <Footer />} */}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
