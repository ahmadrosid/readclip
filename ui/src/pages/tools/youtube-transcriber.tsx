import { Separator } from "@/components/ui/separator";
import { tools } from ".";
import { Title } from "@/components/ui/title";
import { useState } from "react";
import { Copy } from "lucide-react";
export default function YoutubeTranscriber() {
  const { title, description } = tools[3];

  // @ts-ignore
  const [link, setLink] = useState<string>("");
  // @ts-ignore
  const [transcribe, setTranscribe] = useState<string>("");

  const [videoId, setVideoId] = useState<string | RegExpMatchArray>("");

  const getVideoId = (link: string): string | RegExpMatchArray => {
    const pattern = /v=([A-Za-z0-9_-]+)/;
    const match = link.match(pattern);
    if (match) return match;
    return "";
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    const videoId = getVideoId(link);

    setLink(link);
    setVideoId(videoId);
  };

  const getTranscribe = () => {
    const url = "http://localhost:8000/api/youtube/transcript";
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "Insomnia/2023.5.7",
      // Authorization: "Bearer YOUR_AUTH_TOKEN_HERE",
    };

    const data = {
      url: "https://www.youtube.com/watch?v=Rzlr2tNSl0U",
    };

    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
              <button
                onClick={getTranscribe}
                className="bg-blue-400 px-5 py-2 rounded-lg text-white"
              >
                Transcribe
              </button>
            </div>
            {videoId ? (
              <div>
                <div className="p-4">
                  <iframe
                    className="m-auto"
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="flex-1 p-4">
            <div>
              <button className="flex gap-2 border bg-yellow-500 px-4 py-2 text-white rounded-lg">
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
