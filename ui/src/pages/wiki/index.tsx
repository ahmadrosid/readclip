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

export function TextareaForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.error(
      <div>
        <p>You submitted the following values:</p>
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
    );
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
                <Input
                  placeholder="My Wiki..."
                  className="resize-none"
                  {...field}
                />
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
                <Input
                  placeholder="Username..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {`The username will be previx for you wiki url eg. https://readclip.site/wiki/{username}`}
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
                <Textarea
                  placeholder="Descriptions..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The descriptions will be shown in Google search meta
                descriptions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

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
              <DialogTitle>Create new wiki</DialogTitle>
              <DialogDescription>
                Let's create a new wiki to share your links with the world!
              </DialogDescription>
            </DialogHeader>
            <div>
              <TextareaForm />
              {/* <form onSubmit={handleCreateWiki} className="space-y-4">
                <div>
                  <label>
                    <span>Username: </span>
                    <Input name="username" placeholder="eg. jhon_doe" />
                  </label>
                </div>
                <div>
                  <label>
                    <span>Title: </span>
                    <Input
                      name="title"
                      placeholder="eg. Things i've learn oneline"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <span>Descriptions: *</span>
                    <Textarea
                      name="description"
                      placeholder="The descriptions will be shown in Google search meta descriptions."
                    />
                  </label>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="reset" variant={"secondary"}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form> */}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
