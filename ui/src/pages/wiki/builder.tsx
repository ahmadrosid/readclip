import { Title } from "@/components/ui/title";
import "@blocknote/core/style.css";
import { useState } from "react";
import FormSidebar from "@/components/form-sidebar";
import SidebarItem from "@/components/sidebar-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
("use client");

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
import { EyeIcon, Pencil } from "lucide-react";

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
            : "Select framework..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandEmpty>No framework found.</CommandEmpty>
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

export default function WikiBuilderPage() {
  const [sidebars, setSidebar] = useState<string[]>(["Home"]);
  const [sections, setSections] = useState<string[]>(["Section name"]);
  const [selectedSidebar, setSelectedSidebar] = useState(0);

  return (
    <div className="px-4 sm:px-8 pb-16 min-h-[80vh]">
      <div className="pb-4 border-b mb-4">
        <Title as="h2" className="pb-2">
          Wiki Builder
        </Title>
        <p className="text-lg tracking-tight text-gray-600">
          Build public wiki from your bookmarked links.
        </p>
      </div>
      <div>
        <div className="flex border rounded-md overflow-hidden bg-white">
          <div className="w-full max-w-xs border-r space-y-4">
            <FormSidebar setSidebar={setSidebar} />
            <ul className="list-disc list-inside px-3 space-y-1">
              {sidebars.map((item, idx) => (
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
                  defaultValue={sidebars[selectedSidebar]}
                />
                <div className="p-4 space-y-4">
                  {sections.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-2 border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-2 border-b flex items-center">
                        <div className="flex-1">Section</div>
                        <div className="flex gap-1">
                          <Button variant="ghost" className="px-2"><Pencil className="w-4 h-4" /></Button>
                          <Button variant="ghost" className="px-2"><EyeIcon className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    <div className="p-4 flex flex-col gap-2">
                      <label className="space-y-1">
                        <span>{item}</span>
                        <Input placeholder="Section name" />
                      </label>
                      <label className="space-y-1 grid">
                        <span>Select category</span>
                        <SectionCategory />
                      </label>
                    </div>
                    </div>
                  ))}
                  </div>
                <div className="px-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setSections((prev) => [...prev, `Section name`])
                    }
                  >
                    Add section
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
