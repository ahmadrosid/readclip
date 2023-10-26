import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { formatFileSize } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";

type FileInfo = File & { path: string; size: number };

export function ImportSetting() {
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "multipart/form-data": [".html"] },
    onDropAccepted: (files: File[]) => {
      if (files.length == 0) return;
      const file = files[0];
      setSelectedFile(file as FileInfo);
    },
  });

  const files =
    selectedFile === null
      ? []
      : [selectedFile].map((file) => {
          return (
            <li key={(file as FileInfo).path}>
              {file.path} - {formatFileSize(file.size as number)}
            </li>
          );
        });

  return (
    <div className="bg-white dark:bg-gray-700 dark:border shadow rounded-lg p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-bold tracking-tight">Import</h3>
        <p className="text-muted-foreground">
          Import bookmarks links from chrome.
        </p>
      </div>
      <Separator className="my-6" />
      <div>
        <Dialog
          onOpenChange={(open) => {
            if (!open) {
              setSelectedFile(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="dark:text-white">Upload file</Button>
          </DialogTrigger>
          <DialogContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!selectedFile) return;

                const data = new FormData();
                data.append("document", selectedFile);
                type Response = {
                  data: {
                    status: string;
                    error?: string;
                    data: { Title: string; URL: string }[];
                  };
                };
                axios
                  .post("/api/bookmarks/import/chrome", data, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: window.localStorage.getItem("token"),
                    },
                  })
                  .then((res: Response) => {
                    if (res.data.status === "error") {
                      toast.error(res.data.error);
                    } else {
                      toast.success("File uploaded successfully!");
                      setSelectedFile(null);
                    }
                  })
                  .catch((err) => {
                    toast.error("Something went wrong!" + `\n${err.message}`);
                  });
              }}
              encType="multipart/form-data"
            >
              <DialogHeader>
                <DialogTitle>Upload file</DialogTitle>
                <DialogDescription>
                  Export you bookmark data from chrome and html file here.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-4">
                <div
                  {...getRootProps()}
                  className="cursor-pointer py-8 px-4 rounded-md border-dashed bg-gray-50 h-52 border border-gray-300 dark:border-gray-600 text-center w-full grid place-content-center"
                >
                  <div>
                    <input name="document" {...getInputProps()} />
                    {files.length === 0 ? (
                      <>
                        <p className="w-full block text-gray-500">
                          <strong>Click to upload</strong> or drag and drop
                          here!
                        </p>
                        <p className="w-full block text-gray-500 text-sm">
                          HTML, (MAX. 1 MB)
                        </p>
                      </>
                    ) : (
                      <>
                        <ul className="pb-4 text-gray-500">{files}</ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
                <Button>Submit</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
