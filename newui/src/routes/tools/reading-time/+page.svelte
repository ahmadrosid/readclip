<script lang="ts">
  import { Separator } from "@/components/ui/separator";
  import { Textarea } from "@/components/ui/textarea";
  import { Title } from "@/components/ui/title";
  import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import {
    readingTime,
    supportedLanguages,
    type SupportedLanguages,
  } from "reading-time-estimator";
  import { Label } from "@/components/ui/label";
  import { Input } from "@/components/ui/input";

  let tool = {
    slug: "reading-time",
    title: "Reading time estimator",
    description: "Estimate the reading time of your text",
    link: "/tools/reading-time",
  };
  let textareaValue = "";
  let config = {
    wpm: 300,
    lang: "en" as SupportedLanguages,
  };
  let result: ReturnType<typeof readingTime> | undefined;

  const countryNamesObject = {
    en: "English",
    fr: "French",
    es: "Spanish",
    cn: "Chinese",
    ja: "Japanese",
    de: "German",
    "pt-br": "Portuguese (Brazil)",
    tr: "Turkish",
    ro: "Romanian",
    bn: "Bengali",
    sk: "Slovak",
    cs: "Czech",
  };

  function handleWordCount(text: string) {
    if (text === "") return;
    result = readingTime(text, config.wpm, config.lang);
  }

  $: handleWordCount(textareaValue);
</script>

<div class="container mx-auto min-h-[80vh]">
  <div class="pt-6">
    <Title class="pb-4">{tool?.title}</Title>
    <p class="text-lg text-gray-600">{tool?.description}</p>
    <Separator class="mt-4" />
  </div>
  <div class="flex py-6 gap-6">
    <div class="w-full max-w-xs">
      <div class="grid grid-cols-1 gap-4">
        <Title class="text-xl sm:text-2xl py-0 font-normal">Config</Title>
        <div>
          <Label for="wpm">Words per minute</Label>
          <Input
            id="wpm"
            class="bg-white dark:bg-gray-800"
            placeholder="300"
            type="number"
            bind:value={config.wpm}
          />
        </div>
        <div class="space-y-2">
          <Label>Language</Label>
          <Select>
            <SelectTrigger class="bg-white dark:bg-gray-800">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {#each supportedLanguages as item}
                <SelectItem value={item}>
                  {countryNamesObject[item]}
                </SelectItem>
              {/each}
            </SelectContent>
          </Select>
        </div>
        <Title class="text-xl sm:text-2xl pb-0 pt-4 font-normal">Result</Title>
        <Card class="dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Words</CardTitle>
            <CardDescription>{result?.words || 0}</CardDescription>
          </CardHeader>
        </Card>

        <Card class="dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Minutes</CardTitle>
            <CardDescription>{result?.minutes || 0}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>

    <Textarea
      bind:value={textareaValue}
      class="bg-white dark:bg-gray-800 flex-1 border dark:border-gray-700/50 "
      placeholder="Paste your text here..."
      rows={28}
    />
  </div>
</div>
