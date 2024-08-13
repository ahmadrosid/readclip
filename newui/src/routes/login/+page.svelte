<script lang="ts">
  import { GoogleSignIn } from "@/components/ui/google-login";
  import { buttonVariants } from "@/components/ui/button";
  import { onMount } from "svelte";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Separator } from "@/components/ui/separator";
  import { toast } from "svelte-sonner";
  import { cn } from "$lib/utils.js";
  import type { UserCredential } from "firebase/auth";
//   import { DialogCreateAccount } from "@/components/dialog-create-account";
  import { createMutation } from "@tanstack/svelte-query";
  import { fetchLogin } from "$lib/api/api";
  import { getAuth } from "firebase/auth";
  import app from "$lib/firebase";

  let user = {
    name: "",
    email: "",
  };
  let open = false;

  const loginMutation = createMutation({
    mutationKey: ["login"],
    mutationFn: fetchLogin,
    onError: (err: Error) => {
      if (err.message === "user not found") {
        open = true;
        return;
      }
      toast.error(err.message);
    },
  });

  function handleOnAuthenticated(credential: UserCredential) {
    user = {
      name: credential.user.displayName ?? "",
      email: credential.user.email ?? "",
    };
    $loginMutation.mutate();
  }

  onMount(() => {
    const unsubscribe = getAuth(app).onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        console.log({token, user});
        window.localStorage.setItem("token", token);
        window.location.href = "/app";
      }
    });

    return () => unsubscribe();
  });
</script>

<div class="grid p-8 py-16 place-content-center min-h-[80vh]">
  <!-- <DialogCreateAccount
    email={user.email}
    name={user.name}
    {open}
    onOpenChange={(value) => open = value}
  /> -->
  <div class="max-w-md w-full">
    <Card class="overflow-hidden">
      <CardHeader class="space-y-1 text-center">
        <CardTitle class="text-2xl">Sign in to ReadClip</CardTitle>
        <CardDescription>
          Start your reading journey by logging in to your account.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent class="grid gap-4 pt-4 pb-2 bg-gray-100/75 dark:bg-gray-200">
        <GoogleSignIn
          label="Continue with Google"
          setError={(error) => {
            if (error == "") return;
            toast.error(error);
          }}
          onAuthenticated={handleOnAuthenticated}
        />
      </CardContent>
      <CardFooter class="bg-gray-100/75 dark:bg-gray-200">
        <div class="flex justify-center text-sm w-full">
          <span class="px-2 text-muted-foreground">
            <a
              class={cn(
                buttonVariants({
                  variant: "link",
                  className: "text-muted-foreground dark:text-gray-600",
                })
              )}
              href="/register"
            >
              Or create new account!
            </a>
          </span>
        </div>
      </CardFooter>
    </Card>
  </div>
</div>
