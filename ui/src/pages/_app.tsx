import { Outlet, useLocation, useRouteError } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "sonner";
import { MainLayout } from "@/components/main-layout";
import { NewLayout } from "@/components/new-layout";
import {isMobile} from 'react-device-detect';

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
  const location = useLocation();

  const shouldNotNavigateToNewLayout = (pathname: string) => {
    return pathname === "/" || pathname === "/login" || pathname === "/register";
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {isMobile || shouldNotNavigateToNewLayout(location.pathname) ? (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ) : (
          <NewLayout>
            <Outlet />
          </NewLayout>
        )}
        <Toaster richColors />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
