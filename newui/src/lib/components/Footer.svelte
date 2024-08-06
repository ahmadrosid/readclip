<script>
  import ModeToggle from "./ui/ModeToggle.svelte";
</script>

<footer class="py-0 border-t bg-white dark:bg-transparent">
  <div
    class="px-8 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row"
  >
    <p
      class="text-center text-sm leading-loose text-muted-foreground md:text-left"
    >
      Built by{" "}
      <a
        href="https://twitter.com/_ahmadrosid"
        target="_blank"
        rel="noreferrer"
        class="font-medium underline underline-offset-4"
      >
        ahmadrosid
      </a>{" "}
      ©2023 All rights reserved.
    </p>
    <div class="flex items-center gap-4">
      <a
        class="font-medium text-muted-foreground hover:underline hover:text-primary text-sm"
        href="/tools"
      >
        Free tools
      </a>
      <a
        class="font-medium text-muted-foreground hover:underline hover:text-primary text-sm"
        href="https://readclip.features.vote/board"
      >
        Roadmap
      </a>
      <a
        class="font-medium text-muted-foreground hover:underline hover:text-primary text-sm"
        href="mailto:alahmadrosid@gmail.com"
      >
        Contact
      </a>
      <ModeToggle />
    </div>
  </div>
</footer>
