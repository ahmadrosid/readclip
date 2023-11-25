import React, { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormSidebarProps {
  setSidebar: React.Dispatch<React.SetStateAction<string[]>>;
}

const FormSidebar: React.FC<FormSidebarProps> = ({ setSidebar }) => {
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

    setSidebar((prev) => [...prev, label]);
    setLabel('');
    setError(false);
  };

  const inputClassName = error ? "border-rose-500" : "";

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center border-b p-4">
      <Input
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
};

export default FormSidebar;
