<script>
  import { ArrowRight } from "lucide-svelte";
  import { Badge } from "@/components/ui/badge";
  import { Card, CardContent, CardTitle } from "@/components/ui/card";
  import DialogDemo from "@/components/DialogDemo.svelte";
</script>

<svelte:head>
  <title>
	ReadClip - Your Personal Knowledge Library: Save, Organize, and Enjoy.
  </title>
</svelte:head>

<div>
  <div class="py-0 sm:py-16 relative">
    <div
      class="absolute inset-0 -z-10 h-full w-full bg-gray-50 dark:bg-gray-900 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]"
    ></div>
    <div
      class="max-w-4xl py-0 sm:py-16 mx-auto text-left sm:text-center px-4 sm:px-0"
    >
      <div class="py-6 max-w-4xl">
        <Badge
          variant="secondary"
          class="py-2 px-4 rounded-full border border-gray-200 dark:border-gray-500"
        >
          Read, Save, Organize and Enjoy
        </Badge>
        <h1
          class="py-4 sm:py-8 text-3xl font-extrabold tracking-[-0.04em] text-black sm:text-7xl sm:leading-[4.5rem] dark:text-gray-200"
        >
          Curate Your Own Clutter-Free Content Library
        </h1>
        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
          Your one-stop solution for bookmarking, tagging, and enjoying online
          content.
        </p>
      </div>
      <div class="flex justify-start sm:justify-center gap-2 items-center py-6">
        <a
          href="/clip"
          class="inline-flex items-center justify-between h-10 px-5 py-2 text-sm font-medium text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:bg-gray-700 dark:hover:bg-gray-800 dark:text-gray-100"
        >
          Getting started
          <ArrowRight class="w-4 h-4 ml-3" />
        </a>
        <DialogDemo />
      </div>
    </div>
  </div>

  <div class="p-4 sm:p-8 dark:bg-gray-800">
    <div class="max-w-4xl mx-auto space-y-4 py-12 mb-2">
      <h2
        class="text-3xl font-extrabold tracking-[-0.04em] text-gray-800 sm:text-5xl sm:leading-[3.5rem] dark:text-white"
      >
        The Better Way to Bookmark and Read
      </h2>
    </div>
    <div class="max-w-5xl mx-auto mb-16">
      <div class="grid sm:grid-cols-2 gap-6">
        <Card class="bg-red-200 dark:bg-red-900/50">
          <CardContent class="p-6">
            <CardTitle class="pb-4 text-xl"
              >😩 Reading Without ReadClip</CardTitle
            >
            <ul class="list-disc sm:list-inside px-4 space-y-4 py-4">
              <li>Constant distractions from ads & widgets</li>
              <li>Easily lose track of interesting reads</li>
              <li>Links break when sites go down</li>
              <li>Content gets removed or paywalled</li>
            </ul>
          </CardContent>
        </Card>
        <Card class="bg-green-200 dark:bg-green-900/50">
          <CardContent class="p-6">
            <CardTitle class="pb-4 text-xl">😎 Reading With ReadClip</CardTitle>
            <ul class="list-disc sm:list-inside px-4 space-y-4 py-4">
              <li>Strip away ads for uninterrupted focus</li>
              <li>Build a personal library of saved articles</li>
              <li>Access content even if original link breaks</li>
              <li>Easily find & rediscover reads with tagging</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>

  <div class="bg-gray-100 dark:bg-gray-900">
    <div class="max-w-4xl mx-auto space-y-4 py-12 px-4">
      <h2
        class="text-3xl font-extrabold tracking-[-0.04em] text-gray-800 sm:text-5xl sm:leading-[3.5rem] dark:text-white"
      >
        Features
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 pb-16">
        <Card>
          <CardContent class="p-6">
            <div class="text-[50px] h-20 w-20">💾</div>
            <CardTitle class="pb-4 text-xl">Content Saving</CardTitle>
            <p class="text-gray-600 dark:text-gray-300">
              Save Any Online Article: Readclip lets you save articles, blog
              posts, news, and more from the web with a single click.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-6">
            <div class="text-[57px] h-20 w-20">📖</div>
            <CardTitle class="pb-4 text-xl">Distraction-Free Reading</CardTitle>
            <p class="text-gray-600 dark:text-gray-300">
              Readclip downloads saved links' HTML content, removing ads,
              widgets, and distractions for clean, easy reading.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-6">
            <div class="text-[57px] h-20 w-20">🏷️</div>
            <CardTitle class="pb-4 text-xl"
              >Tagging and Categorization</CardTitle
            >
            <p class="text-gray-600 dark:text-gray-300">
              Easily organize saved links with customizable tags. Quickly find
              what you need by topic, source, or other criteria.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-6">
            <div class="text-[57px] h-20 w-20">💡</div>
            <CardTitle class="pb-4 text-xl">Feeds</CardTitle>
            <p class="text-gray-600 dark:text-gray-300">
              Setup news feeds from popular media like Reddit, Hacker News, and
              YouTube channels you like to get the latest updates with a single
              click.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>

  <div class="p-8 dark:bg-gray-800">
    <div
      id="how-to"
      class="max-w-4xl mx-auto space-y-4 py-12 mb-8"
    >
      <h2
        class="text-3xl font-extrabold tracking-[-0.04em] text-gray-800 sm:text-5xl sm:leading-[3.5rem] dark:text-white"
      >
        How it works?
      </h2>
      <p class="text-lg font-normal py-2">
        You can use Readclip in two simple ways: bookmarklet or submit a link.
      </p>
      <div class="space-y-4 pt-8">
        <h3
          class="text-2xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-gray-700 dark:text-gray-300"
        >
          Submit link.
        </h3>
        <div class="text-lg font-normal">
          <p class="pb-4">
            Got to to <a href="/clip" class="underline">Clip</a> page and submit
            your link there.
          </p>
          <div class="py-2 block">
            <img
              src="https://res.cloudinary.com/dr15yjl8w/image/upload/v1696700714/submit-readclip_hszpvj.png"
              alt="clip"
              class="w-full border rounded-md"
            />
          </div>
        </div>
        <div>
          <h3
            class="text-2xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-gray-700 dark:text-gray-300"
          >
            Bookmarklet
          </h3>
          <div class="text-lg font-normal">
            <p class="py-4">
              You also can use bookmarklet to save your link. Drag and drop the
              bookmarklet link into you bookmark bar.
            </p>
            <div class="py-2">
              <img
                src="https://res.cloudinary.com/dr15yjl8w/image/upload/v1696700583/bookmarklet-readclip_scghdf.png"
                alt="clip"
                class="w-full border rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="p-8 bg-gray-100 dark:bg-gray-900">
    <div class="max-w-4xl mx-auto space-y-4 py-8 mb-2 px-4">
      <h2
        class="text-3xl font-extrabold tracking-[-0.04em] text-gray-800 sm:text-5xl sm:leading-[3.5rem] dark:text-white text-center"
      >
        Start Building Your Distraction-Free Library Today
      </h2>
    </div>
    <div class="max-w-4xl mx-auto mb-16">
      <div class="flex justify-start sm:justify-center gap-2 items-center py-2">
        <a
          href="/clip"
          class="inline-flex items-center justify-between h-10 px-5 py-2 text-sm font-medium text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:bg-gray-700 dark:hover:bg-gray-800 dark:text-gray-100"
        >
          Getting started
        </a>
        <!-- <DialogDemo /> -->
      </div>
    </div>
  </div>
</div>
