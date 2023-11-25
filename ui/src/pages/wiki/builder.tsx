import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import FormSidebar from "@/components/form-sidebar";

export default function WikiBuilderPage() {
  const [sidebars, setSidebar] = useState<string[]>([]);
  const editor = useBlockNote({
    onEditorContentChange: (editor) => {
      console.log(editor);
    },
  });

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
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create wiki</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[80vw]">
            <DialogHeader>
              <DialogTitle>Create new Wiki</DialogTitle>
              <DialogDescription>
                Create public wiki add sidebar and page.
              </DialogDescription>
            </DialogHeader>
            <div className="flex border rounded-md overflow-hidden">
              <div className="w-full max-w-xs border-r space-y-4">
                <FormSidebar setSidebar={setSidebar} />
                <ul className="list-disc list-inside px-4">
                  {sidebars.map((item) => (
                    <li
                      key={item}
                      className="flex justify-between items-center group"
                    >
                      <p className="hover:bg-gray-100 cursor-pointer rounded-md flex-1 p-2">
                        {item}
                      </p>
                      <div className="inline-flex gap-2">
                        <Button size="sm" variant="ghost" className="px-2">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => {
                          setSidebar(prev => [...prev].filter(current => current !== item))
                        }} size="sm" variant="ghost" className="px-2">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 pb-4 space-y-4 h-[75vh] overflow-y-auto">
                <input
                  placeholder="Page name"
                  className="p-4 text-2xl font-bold w-full focus:outline-none"
                  defaultValue="Page name"
                />
                <BlockNoteView editor={editor} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
