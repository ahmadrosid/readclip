import { useState } from "react";
import { FormSidebar } from "@/components/form-sidebar";
import { SidebarItem } from "@/components/sidebar-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EyeIcon, Trash2Icon } from "lucide-react";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export function SectionCategory() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select tags..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandEmpty>No tags found.</CommandEmpty>
          <CommandGroup>
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                {framework.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === framework.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export type SidebarAndSectionsState = {
  sidebars: { label: string; slug: string }[];
  sections: string[][];
};

export default function WikiBuilderPage() {
  const [selectedSidebar, setSelectedSidebar] = useState(0);
  const [sidebars, setSidebar] = useState<SidebarAndSectionsState>({
    sidebars: [{ label: "Home", slug: "home" }],
    sections: [["Section"]],
  });

  return (
    <div className="px-4 sm:px-8 py-8 min-h-[80vh]">
      <div className="flex border rounded-md overflow-hidden bg-white">
        <div className="w-full max-w-xs border-r">
          <FormSidebar setSidebar={setSidebar} />
          <ul className="list-disc list-inside space-y-1">
            {sidebars.sidebars.map((item, idx) => (
              <SidebarItem
                key={idx}
                item={item}
                idx={idx}
                setSelectedSidebar={setSelectedSidebar}
                setSidebar={setSidebar}
              />
            ))}
          </ul>
        </div>
        <div className="flex-1 pb-4 space-y-4 h-[75vh] overflow-y-auto">
          {selectedSidebar === -1 ? null : (
            <div className="px-2">
              <input
                key={selectedSidebar}
                placeholder="Page name"
                className="p-4 text-2xl font-bold w-full focus:outline-none"
                defaultValue={sidebars.sidebars[selectedSidebar].label}
              />
              <div className="p-4 space-y-4">
                {sidebars.sections[selectedSidebar].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 border rounded-md overflow-hidden"
                  >
                    <div className="bg-gray-50 px-2 py-1 border-b flex items-center">
                      <div className="flex-1">Section</div>
                      <div className="flex gap-1">
                        <Button variant="ghost" className="px-2">
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="px-2"
                          onClick={() => {
                            setSidebar((prev) => {
                              const newSections = [...prev.sections];
                              newSections[selectedSidebar] = newSections[
                                selectedSidebar
                              ].filter((_, sectionIdx) => sectionIdx !== idx);
                              return {
                                ...prev,
                                sections: newSections,
                              };
                            });
                          }}
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <label className="space-y-1">
                        <span>{item}</span>
                        <Input placeholder="Section name" />
                      </label>
                      <label className="space-y-1 grid">
                        <span>Select tags</span>
                        <SectionCategory />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4">
                <Button
                  size="sm"
                  onClick={() => {
                    setSidebar((prev) => {
                      const next = { ...prev };
                      next.sections[selectedSidebar].push("Section");
                      return next;
                    });
                  }}
                >
                  Add section
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
