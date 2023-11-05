import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarCheck,
  Check,
  DownloadIcon,
  ExternalLink,
  ExternalLinkIcon,
  Loader2,
  MoreVertical,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import {
  type Article,
  fetchDeleteClip,
  fetchDownloadClip,
} from "@/lib/api/api";
import { toast } from "sonner";
import { useMutation } from "react-query";
import { formatDate } from "@/lib/utils";
import { getToken } from "@/lib/api";

type Props = {
  article: Article;
  current_datetime: string;
  onDeleteCallback: (id: string) => void;
  onAddTagCallback: (article: Article) => void;
};

type MenuItemProps = {
  clipId: string;
  setOpenDropdown: (state: boolean) => void;
};

function DownloadMenuItem({ clipId, setOpenDropdown }: MenuItemProps) {
  const downloadMutation = useMutation({
    mutationFn: fetchDownloadClip,
    mutationKey: "downloadClip",
    onSuccess: () => setOpenDropdown(false),
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    },
  });

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          downloadMutation.mutate(clipId);
        }}
        className="cursor-pointer"
      >
        {downloadMutation.isLoading ? (
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
        ) : (
          <DownloadIcon className="mr-2 h-4 w-4" />
        )}{" "}
        Download
      </DropdownMenuItem>
    </>
  );
}

function DeleteMenuItem({ clipId, setOpenDropdown }: MenuItemProps) {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const deleteMutation = useMutation({
    mutationKey: "deleteClip",
    mutationFn: fetchDeleteClip,
    onSuccess(data) {
      if (data.status === "success") {
        toast.success("Clip deleted!");
      } else {
        toast.error("Failed to delete article");
      }
      setOpenDropdown(false);
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    },
  });

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
        }}
        className="cursor-pointer"
      >
        {deleteMutation.isLoading ? (
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
        ) : (
          <TrashIcon className="mr-2 h-4 w-4" />
        )}
        <span
          className="flex-1 cursor-pointer"
          onClick={() => setOpenConfirmDelete(true)}
        >
          Delete
        </span>
        {openConfirmDelete && (
          <span className="inline-flex gap-2">
            <Check
              className="w-4 h-4 hover:text-green-500 cursor-pointer"
              onClick={async () => {
                const token = getToken();
                deleteMutation.mutate({ id: clipId, token });
              }}
            />
            <XIcon
              onClick={() => setOpenConfirmDelete(false)}
              className="w-4 h-4 hover:text-primary cursor-pointer"
            />
          </span>
        )}
      </DropdownMenuItem>
    </>
  );
}

export function ArticleCard({
  article,
  current_datetime,
  onDeleteCallback,
  onAddTagCallback,
}: Props) {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <Card className="grid shadow-none">
      <CardHeader className="grid grid-cols-[1fr_25px] items-start gap-4 space-y-0 p-4 pr-6">
        <div className="space-y-1">
          <a
            href={"/clip?url=" + encodeURIComponent(article.Url)}
            className="hover:underline"
          >
            <CardTitle className="dark:text-gray-200">
              {article.Title.slice(0, 50)}
              {article.Title.length > 50 ? "..." : ""}
            </CardTitle>
          </a>
          <CardDescription>
            {article.Description.slice(0, 100)}
            {article.Description.length > 100 ? "..." : ""}
          </CardDescription>
        </div>
        <div className="flex items-center rounded-md bg-secondary text-secondary-foreground">
          <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600"
              >
                <MoreVertical className="h-4 w-4 text-secondary-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              alignOffset={-5}
              className="w-[200px]"
              forceMount
            >
              <DropdownMenuLabel>Action</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => onAddTagCallback(article)}
                className="cursor-pointer"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add tags
              </DropdownMenuItem>
              <DownloadMenuItem
                clipId={article.Id}
                setOpenDropdown={setOpenDropdown}
              />
              <DeleteMenuItem
                clipId={article.Id}
                setOpenDropdown={(state) => {
                  setOpenDropdown(state);
                  onDeleteCallback(article.Id);
                }}
              />
              <DropdownMenuSeparator />
              <a
                className="w-full cursor-pointer"
                href={article.Url}
                target="_blank"
              >
                <DropdownMenuItem className="cursor-pointer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Visit link
                </DropdownMenuItem>
              </a>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="mt-auto p-4">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarCheck className="mr-1 h-3 w-3" />
            {formatDate(article.CreatedAt, current_datetime)} ago
          </div>
          <a href={article.Url} target="_blank" className="hover:text-gray-800">
            <div className="flex items-center">
              <ExternalLinkIcon className="mr-1 h-3 w-3" />
              {article.Hostname}
            </div>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
