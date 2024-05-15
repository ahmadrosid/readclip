import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/ui/title";
import { tools } from "@/pages/tools/index";

export default function BlogPostGenerator() {
  const tool = tools.find((item) => item.slug === "blog-title-generator");

  return (
    <div className="container mx-auto min-h-[80vh]">
      <div className="pt-6">
        <Title className="pb-4">{tool?.title}</Title>
        <p className="text-lg text-gray-600">{tool?.description}</p>
        <Separator className="mt-4" />
      </div>
      <div className="grid py-6 gap-6">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <Input placeholder="Enter your idea" />
            <Button>Generate</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
