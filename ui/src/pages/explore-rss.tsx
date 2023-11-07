import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { blogRss } from "@/lib/data/rss";
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
      <div className="flex flex-wrap justify-center items-center gap-2">
        {blogRss.map((item) => (
          <Card className="shadow-none p-2 flex-1 sm:flex-auto">
            <div className="flex gap-1 items-center">
              <div>
                <Button
                  onClick={() => handleCopy(item)}
                  variant={"ghost"}
                  className="px-2"
                  size="sm"
                >
                  <CopyIcon className="w-4 h-4 text-black" />
                </Button>
              </div>
              <p className="whitespace-break-spaces text-sm sm:text-base">
                {item}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
