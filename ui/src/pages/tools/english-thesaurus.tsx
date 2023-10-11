import { Title } from "@/components/ui/title";
import { tools } from ".";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";

interface WordInterface {
  word: string;
  example?: string;
  style?: string;
}

const synonyms: WordInterface[] = [
  {
    word: "transparent",
    example:
      "The secondhand shop was selling a vintage serving tray made of transparent red plastic.",
  },
  {
    word: "diaphanous",
    style: "literary",
    example: "She wore a diaphanous gown and a circlet of gold on her brow.",
  },
  {
    word: "see-through",
    example: "Make sure the shirt isn't see-through when it gets wet.",
  },
  {
    word: "sheer",
    example: "The model wore a sheer blouse under the jacket",
  },
  {
    word: "crystal clear",
    example: "The lake was crystal clear.",
  },
  {
    word: "translucent",
    style: "often approving",
    example: "Cook the onions until they are translucent.",
  },
];

const antonyms: WordInterface[] = [
  {
    word: "frosted",
    example: " The shower doors are made of frosted glass.",
  },
  {
    word: "opaque",
    example: "I need a pair of black opaque tights.",
  },
  {
    word: "murky",
    example: "No one knows what lives in the murky depths of the lake.",
  },
  {
    word: "cloudy",
    example: "I didn't expect the water coming out of the tap to be cloudy.",
  },
  {
    word: "turbid",
    style: "formal",
    example: "This species of fish survives best in turbid water.",
  },
];

const relatedWords: WordInterface[] = [
  { word: "transparent" },
  { word: "see-through" },
  { word: "sheer" },
  { word: "diaphanous", style: "literary" },
  { word: "crystal clear" },
  { word: "translucent", style: "often approving" },
  { word: "sunny" },
  { word: "fair" },
  { word: "fine", style: "mainly UK" },
  { word: "good" },
  { word: "nice" },
  { word: "mild" },
  { word: "clement", style: "formal" },
  { word: "temperate" },
];

export default function EnglishThesaurus() {
  const { title, description } = tools[3];

  return (
    <div className="px-8 min-h-[80vh]">
      <div className="pt-6">
        <Title>{title}</Title>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {description}
        </p>
        <Separator className="mt-4" />
      </div>

      <div>
        <div className="flex gap-2 justify-center items-center">
          <input className="border border-gray-400 p-4 py-3 rounded-lg focus:outline-blue-100" />
          <button className="flex bg-blue-500 p-4 py-3 rounded-lg text-white">
            <Search />
            <span>Search</span>
          </button>
        </div>

        <div>
          <h3 className="text-3xl">clear</h3>
          <p>
            These are words and phrases related to <strong>clear</strong>. Click
            on any word or phrase to go to its thesaurus page. Or, go to the
            definition of clear.
          </p>
          <Separator />

          <p className="uppercase">easy to see through</p>
          <ul className="list-disc list-inside">
            <li className="italic">
              The water in the bay was so clear I could see the bottom.
            </li>
          </ul>

          <div className="my-6">
            <h4 className="text-xl font-bold">Synonyms and examples</h4>

            <div className="grid grid-cols-2">
              {synonyms.map(({ word, style, example }, idx) => (
                <div key={idx}>
                  <p>
                    <span className="underline">{word}</span>
                    {style ? <span className="text-xs"> {style}</span> : ""}
                  </p>
                  <p className="italic ps-2">{example} </p>
                </div>
              ))}
            </div>
          </div>

          <div className="my-6">
            <h4 className="text-xl font-bold">Antonyms and examples</h4>

            <div className="grid grid-cols-2">
              {antonyms.map(({ style, word, example }, idx) => (
                <div key={idx}>
                  <p>
                    <span className="underline">{word}</span>
                    {style ? <span className="text-xs"> {style}</span> : ""}
                  </p>
                  <p className="italic ps-2">{example} </p>
                </div>
              ))}
            </div>
          </div>

          <div className="my-6">
            <h4 className="text-xl font-bold">See words related to clear</h4>

            <div className="grid grid-cols-2">
              {relatedWords.map(({ word, style }, idx) => (
                <div key={idx}>
                  <span className="underline">{word}</span>
                  {style ? <span className="text-xs ms-2">{style}</span> : ""}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
