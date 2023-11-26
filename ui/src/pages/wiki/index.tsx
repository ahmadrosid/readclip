import { Title } from "@/components/ui/title";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function WikiBuilderPage() {
  return (
    <div className="px-4 sm:px-8 pb-16 min-h-[80vh]">
      <div className="pb-4 border-b mb-4">
        <Title as="h2" className="pb-2">
          Wiki Builder
        </Title>
        <p className="text-lg tracking-tight text-gray-600">
          Create public wiki from your bookmarked links.
        </p>
      </div>
      <div className="pb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Wiki</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
