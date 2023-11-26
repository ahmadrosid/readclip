import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Pencil, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { SidebarAndSectionsState } from "@/pages/wiki/builder";

interface SidebarItemProps {
  item: string;
  idx: number;
  setSelectedSidebar: (idx: number) => void;
  setSidebar: React.Dispatch<React.SetStateAction<SidebarAndSectionsState>>;
}

export function SidebarItem({
  item,
  idx,
  setSelectedSidebar,
  setSidebar,
}: SidebarItemProps) {
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');
  const handleSaveEdit = () => {
    setEditMode(false);
    setSidebar((prev) => {
      const next = {...prev};
      next.sidebars[idx] = editValue;
      return next;
    });
  };
  
  return (
    <li key={item} className="p-1 bg-gray-50 rounded-lg flex justify-between items-center group gap-1">
      {editMode ? (
        <Input defaultValue={item} onChange={(e) => setEditValue(e.currentTarget.value)} />
      ) : (
        <p
          onClick={() => setSelectedSidebar(idx)}
          className="cursor-pointer hover:underline rounded-md flex-1 p-2"
        >
          {item}
        </p>
      )}
      <div className="inline-flex gap-2">
        {editMode ? (
          <Button
            onClick={handleSaveEdit}
            size="sm"
            variant="ghost"
            className="px-2"
          >
            <Check className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={() => {
                setEditValue(item);
                setEditMode(true);
            }}
            size="sm"
            variant="ghost"
            className="px-2"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
        <Button
          onClick={() => {
            setSelectedSidebar(-1);
            setSidebar((prev) => {
                const next = {...prev}
                next.sidebars = next.sidebars.filter((_, sidebarIdx) => sidebarIdx !== idx);
                next.sections = next.sections.filter((_, sectionIdx) => sectionIdx !== idx);
                return next;
            });
          }}
          size="sm"
          variant="ghost"
          className="px-2"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </li>
  );
}
