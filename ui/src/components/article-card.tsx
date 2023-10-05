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
import { Separator } from "@/components/ui/separator";
import {
  CalendarCheck,
  DownloadIcon,
  ExternalLink,
  ExternalLinkIcon,
  Loader2,
  MoreVertical,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDistance } from "date-fns";
import { type Article, fetchDeleteClip, fetchDownloadClip } from "@/lib/api";
import { toast } from "sonner";
import { useMutation } from "react-query";

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

export function DownloadMenuItem({ clipId, setOpenDropdown }: MenuItemProps) {
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
        <DownloadIcon className="mr-2 h-4 w-4" /> Download
      </DropdownMenuItem>
    </>
  );
}

export function DeleteMenuItem({ clipId, setOpenDropdown }: MenuItemProps) {
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
          deleteMutation.mutate(clipId);
        }}
        className="cursor-pointer"
      >
        {deleteMutation.isLoading ? (
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
        ) : (
          <TrashIcon className="mr-2 h-4 w-4" />
        )}{" "}
        Delete
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
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);

  const handleDeleteArticle = async () => {
    if (!controller) {
      const controller = new AbortController();
      setController(controller);
    } else {
      controller.abort();
    }
    const res = await fetchDeleteClip(article.Id);
    if (res.status === "success") {
      setOpenConfirmDelete(false);
      onDeleteCallback(article.Id);
    } else {
      alert("Failed to delete article");
    }
    setController(null);
  };

  const formatDate = (date: string, currentDate: string) => {
    return formatDistance(new Date(date), new Date(currentDate), {
      addSuffix: false,
    });
  };

  return (
    <Card className="grid dark:bg-gray-800/40">
      <CardHeader className="grid grid-cols-[1fr_80px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <a
            href={"/clip?url=" + encodeURIComponent(article.Url)}
            className="hover:underline"
          >
            <CardTitle className="dark:text-gray-200">
              {article.Title}
            </CardTitle>
          </a>
          <CardDescription>
            {article.Description.slice(0, 100)}
            {article.Description.length > 100 ? "..." : ""}
          </CardDescription>
        </div>
        <div className="flex items-center rounded-md bg-secondary text-secondary-foreground">
          <Popover open={openConfirmDelete} onOpenChange={setOpenConfirmDelete}>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                onClick={() => setOpenConfirmDelete(true)}
                className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <div className="grid gap-2">
                <div>
                  <p>Delete this clip?</p>
                </div>
                <div className="flex gap-2 ml-auto">
                  <Button
                    onClick={() => setOpenConfirmDelete(false)}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleDeleteArticle} size="sm">
                    {controller ? "Deleting..." : "Yes!"}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Separator orientation="vertical" className="h-[20px]" />
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
              {/* <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem> */}
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
      <CardContent className="mt-auto">
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
