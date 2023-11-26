import React, { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarAndSectionsState } from '@/pages/wiki/builder';
import { slugify } from '@/lib/utils';

interface FormSidebarProps {
  setSidebar: React.Dispatch<React.SetStateAction<SidebarAndSectionsState>>;
}

export function FormSidebar({ setSidebar }: FormSidebarProps) {
  const [label, setLabel] = useState('');
  const [error, setError] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
    setError(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!label) {
      setError(true);
      toast.error("Sidebar label is required!");
      return;
    }

    setSidebar((prevState) => {
      const newSection = [...prevState.sections, ["Section"]];
      const newSidebar = [...prevState.sidebars, {
        label,
        slug: slugify(label)
      }];
      return {
        sections: newSection,
        sidebars: newSidebar
      };
    });

    setLabel('');
    setError(false);
  };

  const inputClassName = error ? "border-rose-500" : "";

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center border-b p-4">
      <Input
        autoComplete='off'
        name="label"
        type="text"
        placeholder="Sidebar label"
        value={label}
        onChange={handleInputChange}
        className={inputClassName}
      />
      <Button type="submit">Add</Button>
    </form>
  );
}
