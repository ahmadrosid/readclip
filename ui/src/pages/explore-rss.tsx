import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { rssCategories } from "@/lib/data/rss-categories";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

export default function ExploreRss() {
  const handleCopy = (data: string) => {
    if (!data) return;
    navigator.clipboard.writeText(data).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="px-1 grid sm:flex gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Explore RSS Urls</h2>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-4 py-6">
        {rssCategories.map((item) => (
          <Card className="shadow-none p-2 flex-1 sm:flex-auto">
            <div>
              <p className="whitespace-break-spaces text-sm sm:text-base">
                <Button
                  onClick={() => handleCopy(item.link)}
                  variant={"ghost"}
                  className="px-2"
                  size="sm"
                >
                  <CopyIcon className="w-4 h-4 text-black" />
                </Button>
                {item.link}
              </p>
              <div className="whitespace-break-spaces text-xs sm:text-xs pb-2 px-2">
                {item.category
                  .map((item) => {
                    if (item === "") return;
                    return `- ${item.trim()}`;
                  })
                  .join("\n")}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
