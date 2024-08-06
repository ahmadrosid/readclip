<script lang="ts">
  import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
</script>

<Dialog>
  <DialogTrigger class="px-6 flex items-center underline">
    See Demo
  </DialogTrigger>
  <DialogContent class="max-w-lg sm:max-w-3xl">
    <DialogTitle>Demo</DialogTitle>
    <div class="aspect-video">
      <iframe
        class="w-full h-full overflow-hidden rounded-md"
        src="https://www.youtube.com/embed/PZbvBXEPvFk?si=9EW0yHgN10Q3GVY_"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
    </div>
  </DialogContent>
</Dialog>
