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
import { Input } from "@/components/ui/input";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { PlusIcon } from "lucide-react";

export default function WikiBuilderPage() {
  const editor = useBlockNote({
    onEditorContentChange: (editor) => {
      // Log the document to console on every update
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
              <div className="w-full max-w-xs p-4 border-r space-y-4">
                <Input placeholder="Sidebar label" />
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2 text-white" /> Add sidebar
                </Button>
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
