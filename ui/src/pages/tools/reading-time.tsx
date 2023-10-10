import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Title } from "@/components/ui/title";
import { tools } from "@/pages/tools/index";
import { useCallback, useEffect, useRef, useState } from "react";
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

export default function ReadingTime() {
  const { title, description } = tools[1];
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [config, setConfig] = useState({
    wpm: 300,
    lang: "en" as SupportedLanguages,
  });
  const [result, setResult] = useState<ReturnType<typeof readingTime>>();

  const handleWordCount = useCallback(
    (text: string) => {
      if (text === "") return;
      const res = readingTime(text, config.wpm, config.lang);
      setResult(res);
    },
    [config]
  );

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
  };

  useEffect(() => {
    if (textareaRef.current) {
      handleWordCount(textareaRef.current.value);
    }
  }, [config]);

  return (
    <div className="container mx-auto min-h-[80vh]">
      <div className="pt-6">
        <Title className="pb-4">{title}</Title>
        <p className="text-lg text-gray-600">{description}</p>
        <Separator className="mt-4" />
      </div>
      <div className="flex py-6 gap-6">
        <div className="w-full max-w-xs">
          <div className="grid grid-cols-1 gap-4">
            <Title className="text-xl sm:text-2xl py-0">Config</Title>
            <div>
              <Label htmlFor="wpm">Words per minute</Label>
              <Input
                id="wpm"
                className="bg-white"
                placeholder="300"
                type="number"
                value={config.wpm}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    wpm: Number(e.currentTarget.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                defaultValue={config.lang}
                onValueChange={(val) =>
                  setConfig((prev) => ({
                    ...prev,
                    lang: val as SupportedLanguages,
                  }))
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((item) => (
                    <SelectItem key={item} value={item}>
                      {countryNamesObject[item]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Title className="text-xl sm:text-2xl py-0">Result</Title>
            <Card>
              <CardHeader>
                <CardTitle>Words</CardTitle>
                <CardDescription>{result?.words || 0}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Minutes</CardTitle>
                <CardDescription>{result?.minutes || 0}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        <Textarea
          ref={textareaRef}
          className="bg-white dark:bg-gray-700 flex-1"
          placeholder="Paste your text here..."
          rows={28}
          onChange={(e) => handleWordCount(e.target.value)}
        />
      </div>
    </div>
  );
}
