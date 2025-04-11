import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { useMutation } from "react-query";
import { fetchExportClips } from "@/lib/api/api";
import { toast } from "sonner";

function DownloadButton({ format }: { format: "csv" | "json" }) {
  const exportMutation = useMutation("export", fetchExportClips, {
    retry: 2,
    onSuccess: () => {
      toast.success("Exported successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return (
    <Button
      disabled={exportMutation.isLoading}
      variant="outline"
      className="dark:bg-gray-700/70 dark:border-gray-600/70"
      onClick={() => exportMutation.mutate(format)}
    >
      {exportMutation.isLoading
        ? "Exporting..."
        : `Export to ${format === "csv" ? "CSV" : "JSON"}`}
    </Button>
  );
}

export function ExportSetting() {
  return (
    <div className="bg-white  dark:bg-gray-800/75 dark:border shadow rounded-lg p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-bold tracking-tight">Export</h3>
        <p className="text-muted-foreground">
          Export you bookmarks data into CSV or JSON.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="space-x-4">
        <DownloadButton format="csv" />
        <DownloadButton format="json" />
      </div>
    </div>
  );
}
