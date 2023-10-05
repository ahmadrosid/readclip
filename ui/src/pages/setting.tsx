import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ImportSetting } from "@/components/setting/import-setting";
import { ExportSetting } from "@/components/setting/export-setting";
import GeneralSetting from "@/components/setting/general-setting";
import TagSetting from "@/components/setting/tag-setting";
import { useAuth } from "@/hooks/useAuth";

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
        "justify-start cursor-pointer border",
        "dark:bg-transparent"
      )}
    >
      {children}
    </div>
  );
}

type Path = "general" | "tags" | "import" | "export";

export default function SettingPage() {
  const [activePath, setActivePath] = useState<Path>("general");
  useAuth();

  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block min-h-[80vh]">
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
              pathname="tags"
              activePath={activePath}
              onClick={() => setActivePath("tags")}
            >
              Tags
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
          {activePath === "general" && <GeneralSetting />}
          {activePath === "tags" && <TagSetting />}
          {activePath === "import" && <ImportSetting />}
          {activePath === "export" && <ExportSetting />}
        </div>
      </div>
    </div>
  );
}
