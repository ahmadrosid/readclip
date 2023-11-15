import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Markdown } from "./markdown";

export function SummaryCard({ summaryContent }: { summaryContent: string }) {
  const [showSummary, setShowSummary] = useState(false);

  if (summaryContent === "") return null;
  if (summaryContent === "NULL") return null;

  return (
    <>
      <div className="absolute top-8 w-full max-w-[300px]">
        <div className={cn("fixed max-w-[300px]", showSummary ? "w-full" : "")}>
          <div className="bg-white shadow-sm border rounded-md sticky top-0">
            <div
              className={cn(
                "flex items-center gap-1",
                showSummary ? "p-2 border-b" : "p-0"
              )}
            >
              <Button
                onClick={() => setShowSummary((prev) => !prev)}
                variant="ghost"
                className="px-2 py-1"
              >
                {showSummary ? (
                  <ChevronsLeft className="w-5 h-5" />
                ) : (
                  <ChevronsRight className="w-5 h-5" />
                )}
              </Button>
              {showSummary && <h3 className="font-bold text-lg">Summary</h3>}
            </div>
            {showSummary && (
              <div className="max-h-[65vh] overflow-y-auto scrollbar-thin py-4">
                <Markdown className="prose-sm">{summaryContent}</Markdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
