import { BookMarkedIcon } from "lucide-react";
import { Link } from "@/router";
import { Home, Bookmark, Rows, Rss, Wrench, Cog } from "lucide-react";
import { UserPopover } from "@/components/user-popover";

export function NewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-gray-100 flex dark:bg-gray-900/75 dark:border-gray-800">
      <div className="h-full w-full max-w-[50px] sm:min-w-[260px] sm:max-w-[260px] flex-col hidden sm:flex">
        <div className="p-4">
          <Link to="/" className="text-lg flex items-center gap-2">
            <BookMarkedIcon className="w-5 h-5 block sm:hidden" />
            <span className="font-semibold hidden sm:block dark:text-gray-300">
              ReadClip
            </span>
          </Link>
        </div>
        <div className="px-2 flex-1">
          <ul className="text-sm">
            <li>
              <Link to="/clip">
                <div className="hover:bg-white dark:hover:bg-gray-800 p-2 rounded-sm cursor-pointer flex gap-2 items-center">
                  <Home className="text-gray-500 w-5 h-5" />
                  <span className="hidden sm:block">Home</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/clips">
                <div className="hover:bg-white dark:hover:bg-gray-800 p-2 rounded-sm cursor-pointer flex gap-2 items-center">
                  <Bookmark className="text-gray-500 w-5 h-5" />
                  <span className="hidden sm:block">Clips</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/collections">
                <div className="hover:bg-white dark:hover:bg-gray-800 p-2 rounded-sm cursor-pointer flex gap-2 items-center">
                  <Rows className="text-gray-500 w-5 h-5" />
                  <span className="hidden sm:block">Collections</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/feed-deck">
                <div className="hover:bg-white dark:hover:bg-gray-800 p-2 rounded-sm cursor-pointer flex gap-2 items-center">
                  <Rss className="text-gray-500 w-5 h-5" />
                  <span className="hidden sm:block">Feeds</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/tools">
                <div className="hover:bg-white dark:hover:bg-gray-800 p-2 rounded-sm cursor-pointer flex gap-2 items-center">
                  <Wrench className="text-gray-500 w-5 h-5" />
                  <span className="hidden sm:block">Tools</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/setting">
                <div className="hover:bg-white dark:hover:bg-gray-800 p-2 rounded-sm cursor-pointer flex gap-2 items-center">
                  <Cog className="text-gray-500 w-5 h-5" />
                  <span className="hidden sm:block">Settings</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>

        <UserPopover />
      </div>
      <div className="py-2 pr-2 flex-1">
        <div className="rounded-md bg-white/75 dark:bg-gray-800/35 w-full h-full border dark:border-gray-700/50 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
