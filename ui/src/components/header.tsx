import { Button } from "@/components/ui/button";
import { BookMarkedIcon } from "lucide-react";
import { Link } from "@/router";
import { ModeToggle } from "./mode-toggle";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { auth } from "@/lib/firebase";

export function Header() {
  const navigate = useNavigate();

  const rawLink = `<a href="javascript:window.location='${window.location.origin}/clip?url='+encodeURIComponent(document.location)">
    Add to Readclip
  </a>`;

  const hasToken = window.localStorage.getItem("token");

  const handleLogout = useCallback(async () => {
    await auth.signOut();
    window.localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur dark:bg-gray-900/75 dark:border-gray-800">
      <div className="px-4 sm:px-8 flex h-14 items-center">
        <div className="mr-4 flex flex-1">
          <nav className="flex items-center space-x-2">
            <Link to="/" className="text-lg flex items-center gap-2">
              <BookMarkedIcon className="w-5 h-5" />
              <span className="font-bold hidden sm:block dark:text-gray-300">
                ReadClip
              </span>
            </Link>

            <Link to="/clip">
              <Button
                className="dark:text-gray-300 text-gray-800 px-2"
                variant="link"
              >
                Home
              </Button>
            </Link>

            <Link to="/clips">
              <Button
                className="dark:text-gray-300 text-gray-800 px-2"
                variant="link"
              >
                Clips
              </Button>
            </Link>

            <Link to="/feed-deck">
              <Button
                className="dark:text-gray-300 text-gray-800 px-2"
                variant="link"
              >
                Feeds
              </Button>
            </Link>

            {/* <Link to="/wiki">
              <Button
                className="dark:text-gray-300 text-gray-800 px-2"
                variant="link"
              >
                Wiki <span className="text-rose-400 pl-2">(beta)</span>
              </Button>
            </Link> */}

            <Link to="/tools" className="hidden sm:block">
              <Button
                className="dark:text-gray-300 text-gray-800 px-2"
                variant="link"
              >
                Tools
              </Button>
            </Link>

            {hasToken && (
              <Link to="/setting">
                <Button
                  className="dark:text-gray-300 text-gray-800 px-2"
                  variant="link"
                >
                  Settings
                </Button>
              </Link>
            )}

          </nav>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            {hasToken ? (
              <div className="flex gap-4 items-center">
                <div
                  className="flex-shrink-0 hover:underline cursor-pointer text-sm"
                  dangerouslySetInnerHTML={{ __html: rawLink }}
                />
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="link"
                    className="text-gray-600 dark:text-gray-300"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline">Sign up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="px-0 sm:pr-2 sm:pl-4 block md:hidden">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
