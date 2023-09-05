import { Button } from "@/components/ui/button";
import { BookMarkedIcon } from "lucide-react";
import { Link } from "@/router";
import { ModeToggle } from "./mode-toggle";
import { useAuth } from "@/context/auth-context";

export function Header() {
  const { currentUser, logout } = useAuth();

  const rawLink = `<a href="javascript:window.location='${window.location.origin}?url='+encodeURIComponent(document.location)">
    Add to Readclip
  </a>`;

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur dark:bg-gray-900/75 dark:border-gray-800">
      <div className="pl-8 pr-8 flex h-14 items-center">
        <div className="mr-4 flex flex-1">
          <nav className="flex items-center space-x-2">
            <p className="font-bold flex items-center gap-3">
              <BookMarkedIcon className="w-5 h-5" />
              <Link to="/" className="text-lg">
                ReadClip
              </Link>
            </p>

            <Link to="/clips">
              <Button className="dark:text-white text-gray-800" variant="link">
                Saved
              </Button>
            </Link>

            <Link to="/setting">
              <Button
                className="dark:text-white text-gray-800 px-0"
                variant="link"
              >
                Setting
              </Button>
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            {currentUser ? (
              <div className="flex gap-4 items-center">
                <div
                  className="flex-shrink-0 hover:underline cursor-pointer text-sm"
                  dangerouslySetInnerHTML={{ __html: rawLink }}
                />
                <ModeToggle />
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="link" className="text-gray-600">
                    Sign in
                  </Button>
                </Link>
                <Button variant="outline">Sign up</Button>
              </>
            )}
          </nav>
        </div>

        <div className="px-4 block md:hidden">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
