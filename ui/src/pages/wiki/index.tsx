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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useMutation } from "react-query";
import { fetchCreateWiki, RequestCreateWiki } from "@/lib/api/wiki";
import { Loader } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { fetchUpdateUsername } from "@/lib/api/user";

const FormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(160, {
      message: "Username must not be longer than 30 characters.",
    }),
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(160, {
      message: "Title must not be longer than 30 characters.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(255, {
      message: "Description must not be longer than 255 characters.",
    }),
});

function FormCreateWiki() {
  const createWikiMutation = useMutation({
    mutationKey: "create-wiki",
    mutationFn: async (data: RequestCreateWiki & { username: string }) => {
      await fetchUpdateUsername({ username: data.username });
      return fetchCreateWiki(data);
    },
    onSuccess: () => {
      window.location.href = "/wiki/builder";
    },
    onError: (err) => {
      console.log(err);
      if (err instanceof Error) {
        toast.error(err.message || "Failed to create wiki!");
        return;
      }
      toast.error("Failed to create wiki!");
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const defaultSidebar = {
      sections: [["Section"]],
      sidebars: [{ label: "Home", slug: "home" }],
    };
    const wiki = { ...data, sidebar: defaultSidebar };
    createWikiMutation.mutate(wiki);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="My Wiki..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username..." {...field} />
              </FormControl>
              <FormDescription>
                {`The username will be used as prefix for your wiki public url eg. https://readclip.site/wiki/{username}`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Descriptions..." {...field} />
              </FormControl>
              <FormDescription>
                The descriptions will be shown in Google search meta
                descriptions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createWikiMutation.isLoading}>
          {createWikiMutation.isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default function WikiBuilderPage() {
  useAuth();

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
              <DialogTitle>Create new wiki</DialogTitle>
              <DialogDescription>
                Let's create a new wiki to share your links with the world!
              </DialogDescription>
            </DialogHeader>
            <div>
              <FormCreateWiki />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
