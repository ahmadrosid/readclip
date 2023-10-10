import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Title } from "@/components/ui/title";
import { tools } from "@/pages/tools/index";
import { useCallback, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

export default function WordCounter() {
  const { title, description } = tools[0];
  const [result, setResult] = useState({
    words: 0,
    chars: 0,
    charsNoSpace: 0,
    paragraphs: 0,
  });
  const handleWordCount = useCallback((text: string) => {
    if (text === "") return;

    let words = 0;
    let chars = text.length;
    let charsNoSpace = 0;
    let paragraphs = 0;
    let inWord = false;
    let inParagraph = false;
    let ignoredChars = 0;

    for (let i = 0; i < chars; i++) {
      const char = text[i];

      if (
        char === "#" ||
        char === "_" ||
        char === "[" ||
        char === "]" ||
        char === "*"
      ) {
        ignoredChars++;
      }

      // Counting words
      if (char === " " || char === "\t" || char === "\n" || char === "\r") {
        inWord = false;
      } else {
        if (!inWord) {
          words++;
        }
        inWord = true;
        charsNoSpace++;
      }

      // Counting paragraphs
      if (char === "\n") {
        if (inParagraph) {
          paragraphs++;
          inParagraph = false;
        }
      } else {
        inParagraph = true;
      }
    }

    // In case the text doesn't end with a newline
    if (inParagraph) {
      paragraphs++;
    }
    if (ignoredChars > 0) {
      chars = charsNoSpace - ignoredChars;
    }

    setResult({
      words: words,
      chars: chars,
      charsNoSpace: charsNoSpace,
      paragraphs: paragraphs,
    });
  }, []);

  return (
    <div className="container mx-auto min-h-[80vh]">
      <div className="pt-6">
        <Title className="pb-4">{title}</Title>
        <p className="text-lg text-gray-600">{description}</p>
        <Separator className="mt-4" />
      </div>
      <div className="grid py-6 gap-6">
        <div className="w-full">
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Words</CardTitle>
                <CardDescription>{result.words}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Characters</CardTitle>
                <CardDescription>
                  {result.chars}
                  {" / "}
                  {formatNumber(result.chars)}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Characters (no spaces)</CardTitle>
                <CardDescription>
                  {result.charsNoSpace}
                  {" / "}
                  {formatNumber(result.charsNoSpace)}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Paragraphs</CardTitle>
                <CardDescription>{result.paragraphs}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        <Separator />

        <Textarea
          className="bg-white dark:bg-gray-700"
          placeholder="Paste your text here..."
          rows={28}
          onChange={(e) => handleWordCount(e.target.value)}
        />
      </div>
    </div>
  );
}
