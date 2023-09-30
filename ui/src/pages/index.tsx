import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto pt-8">
      <div className="max-w-lg pt-16 pb-8">
        <p>ReadClip</p>
        <p className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-black sm:text-5xl sm:leading-[3.5rem] dark:text-white">
          Bookmark manager for organizing your links from internet.
        </p>
      </div>
      <Button size="lg" className="items-center justify-between h-11 bg-black">
        Start bookmarking <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}
