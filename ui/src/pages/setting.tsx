import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ImportSetting } from "@/components/setting/import-setting";
import app from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "@/router";
import { useAuthState } from "react-firebase-hooks/auth";

function NavItem({
  pathname,
  activePath,
  children,
  onClick,
}: {
  pathname: string;
  activePath: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        pathname === activePath
          ? "bg-white hover:border-muted-foreground"
          : "hover:bg-muted hover:border-muted-foreground border-transparent",
        "justify-start cursor-pointer border"
      )}
    >
      {children}
    </div>
  );
}

export default function SettingPage() {
  const [activePath, setActivePath] = useState("general");
  const navigate = useNavigate();
  useAuthState(getAuth(app), {
    onUserChanged: async (user) => {
      if (!user) {
        navigate("/login");
      }
    },
  });

  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and import or export your bookmarks data.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            <NavItem
              pathname="general"
              activePath={activePath}
              onClick={() => setActivePath("general")}
            >
              General
            </NavItem>
            <NavItem
              pathname="import"
              activePath={activePath}
              onClick={() => setActivePath("import")}
            >
              Import
            </NavItem>
            <NavItem
              pathname="export"
              activePath={activePath}
              onClick={() => setActivePath("export")}
            >
              Export
            </NavItem>
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-3xl">
          {activePath === "general" && (
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold tracking-tight">General</h3>
                <p className="text-muted-foreground">
                  Manage your general information.
                </p>
              </div>
              <Separator className="my-6" />
              <div>
                <label className="block text-sm text-gray-500">
                  Cooming soon!
                </label>
              </div>
            </div>
          )}
          {activePath === "import" && <ImportSetting />}
          {activePath === "export" && (
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold tracking-tight">Export</h3>
                <p className="text-muted-foreground">
                  Export you bookmarks data into sqlite format.
                </p>
              </div>
              <Separator className="my-6" />
              <div>
                <label className="block text-sm text-gray-500">
                  Cooming soon!
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
