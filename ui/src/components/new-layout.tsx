import { Link } from "@/router";
import { Home, Bookmark, Rows, Rss, Wrench, Cog, PanelLeft } from "lucide-react";
import { UserPopover } from "@/components/user-popover";
import { useState, useEffect } from "react";

export function NewLayout({ children }: { children: React.ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(() => {
      const stored = localStorage.getItem("showSidebar");
      return stored === "true" ? true : false;
  });

  useEffect(() => {
      localStorage.setItem("showSidebar", showSidebar.toString());
  }, [showSidebar]);

  return (
    <div className="h-screen bg-gray-100 flex dark:bg-gray-900/75 dark:border-gray-800">
      <div className={`h-full w-full ${showSidebar ? "w-[260px] max-w-[260px]" : "w-[55px]"} flex-col hidden sm:flex transition-width duration-300`}>
        <div className="flex justify-between p-3">
          {showSidebar && (
            <Link to="/" className="text-lg flex items-center gap-2">
              <span className="font-semibold hidden sm:block dark:text-gray-300">
                ReadClip
              </span>
            </Link>)}
          <button onClick={() => setShowSidebar(!showSidebar)} className="hover:bg-gray-50/75 dark:hover:bg-gray-800/40 p-1.5 rounded">
            <PanelLeft className="size-4 opacity-75" />
          </button>
        </div>
        <div className="px-2 flex-1">
          <ul className="text-sm">
            <li>
              <Link to="/clip">
                <div className="hover:bg-white dark:hover:bg-gray-800 dark:hover:text-gray-100 text-gray-500 p-2 rounded-sm cursor-pointer flex gap-2 items-center">
                  <Home className="size-5" />
                  {showSidebar && <span className="hidden sm:block">Home</span>}
                </div>
              </Link>
            </li>
            <li>
              <Link to="/clips">
                <div className="hover:bg-white dark:hover:bg-gray-800 dark:hover:text-gray-100 text-gray-500 p-2 rounded-sm cursor-pointer flex gap-2 items-center">
                  <Bookmark className="size-5" />
                  {showSidebar && <span className="hidden sm:block">Clips</span>}
                </div>
              </Link>
            </li>
            <li>
              <Link to="/collections">
                <div className="hover:bg-white dark:hover:bg-gray-800 dark:hover:text-gray-100 text-gray-500 p-2 rounded-sm cursor-pointer flex gap-2 items-center">
                  <Rows className="size-5" />
                  {showSidebar && <span className="hidden sm:block">Collections</span>}
                </div>
              </Link>
            </li>
            <li>
              <Link to="/feed-deck">
                <div className="hover:bg-white dark:hover:bg-gray-800 dark:hover:text-gray-100 text-gray-500 p-2 rounded-sm cursor-pointer flex gap-2 items-center">
                  <Rss className="size-5" />
                  {showSidebar && <span className="hidden sm:block">Feeds</span>}
                </div>
              </Link>
            </li>
            <li>
              <Link to="/tools">
                <div className="hover:bg-white dark:hover:bg-gray-800 dark:hover:text-gray-100 text-gray-500 p-2 rounded-sm cursor-pointer flex gap-2 items-center">
                  <Wrench className="size-5" />
                  {showSidebar && <span className="hidden sm:block">Tools</span>}
                </div>
              </Link>
            </li>
            <li>
              <Link to="/setting">
                <div className="hover:bg-white dark:hover:bg-gray-800 dark:hover:text-gray-100 text-gray-500 p-2 rounded-sm cursor-pointer flex gap-2 items-center">
                  <Cog className="size-5" />
                  {showSidebar && <span className="hidden sm:block">Settings</span>}
                </div>
              </Link>
            </li>
          </ul>
        </div>

        <UserPopover showSidebar={showSidebar} />
      </div>
      <div className="py-2 pr-2 flex-1">
        <div className="rounded-md bg-white/75 dark:bg-gray-800/35 w-full h-full border dark:border-gray-700/50 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
