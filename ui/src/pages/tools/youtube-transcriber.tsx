import { Separator } from "@/components/ui/separator";
import { tools } from ".";
import { Title } from "@/components/ui/title";
import { useState } from "react";
import { Copy } from "lucide-react";
export default function YoutubeTranscriber() {
  const { title, description } = tools[2];

  // https://www.youtube.com/watch?v=Pzl1B7nB9Kc

  const [link, setLink] = useState<string>("");
  const [videoId, setVideoId] = useState<string>("");

  /*
   *caesar@linuxbox  ~  node
  Welcome to Node.js v20.7.0.
  Type ".help" for more information.
  > const link = "https://www.youtube.com/watch?v=Pzl1B7nB9Kc"
  undefined
  > link.indexOf("=");
  31
  > const pattern  = /v=([A-Za-z0-9_-]+)/;
  undefined
  > const match = link.match(pattern);
  undefined
  > match;
  [
    'v=Pzl1B7nB9Kc',
    'Pzl1B7nB9Kc',
    index: 30,
    input: 'https://www.youtube.com/watch?v=Pzl1B7nB9Kc',
    groups: undefined
  ]
  >
  
   * */
  const getVideoId = (link: string) => {
    const pattern = /v=([A-Za-z0-9_-]+)/;
    const match = link.match(pattern);
    if (match) return match;
    return "";
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    console.log(link);
  };

  return (
    <div className="container mx-auto min-h-[80vh]">
      <div className="pt-6">
        <Title>{title}</Title>
        <p className="text-lg text-gray-600">{description}</p>

        <Separator className="mt-4" />
      </div>
      <div className="grid py-6 gap-6">
        <div className="flex gap-4 items-start">
          <div className="flex-1 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste your video link here"
                className="border rounded-lg flex-1 p-4 focus:outline-blue-100"
                onChange={handleUrlChange}
              />
              <button className="bg-blue-400 px-5 py-2 rounded-lg text-white">
                Transcribe
              </button>
            </div>
            <div>
              <div className="p-4">
                <iframe
                  className="m-auto"
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/Pzl1B7nB9Kc"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
          <div className="flex-1 p-4">
            <div>
              <button className="flex gap-2 rounded border bg-yellow-500 px-4 py-2 text-white rounded-lg">
                <Copy />
                <span>Copy</span>
              </button>
            </div>
            <div>
              Lorem ipsum dolor sit amet, officia excepteur ex fugiat
              reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit
              ex esse exercitation amet. Nisi anim cupidatat excepteur officia.
              Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet
              voluptate voluptate dolor minim nulla est proident. Nostrud
              officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex
              occaecat reprehenderit commodo officia dolor Lorem duis laboris
              cupidatat officia voluptate. Culpa proident adipisicing id nulla
              nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua
              reprehenderit commodo ex non excepteur duis sunt velit enim.
              Voluptate laboris sint cupidatat ullamco ut ea consectetur et est
              culpa et culpa duis.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
