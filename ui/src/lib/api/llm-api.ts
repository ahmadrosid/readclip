import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

interface Choice {
  index: number;
  delta: {
    content: string;
  };
  finish_reason: null;
  content_filter_results: {
    hate: {
      filtered: boolean;
    };
    self_harm: {
      filtered: boolean;
    };
    sexual: {
      filtered: boolean;
    };
    violence: {
      filtered: boolean;
    };
  };
}

interface TextCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  system_fingerprint: string;
}

type LLMRequest = {
  model: string;
  messages: { role: string; content: string }[];
};

interface FetchStreamingOptions {
  body: LLMRequest;
  token?: string;
  onParsed: (result: TextCompletion) => void;
}

/**
 * Fetch streaming data from the server and parse it using the provided callback function.
 * @param {FetchStreamingOptions} options - The options for the streaming fetcher.
 * @returns void
 */
export async function fetchLlmProxy({ body, token, onParsed }: FetchStreamingOptions) {
  const url = "/api/proxy/anyscale";
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `${token}` } : {}),
    },
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  // This data is a ReadableStream
  const data = response.body;
  if (!data) {
    return;
  }
  
  const onParse = (event: ParsedEvent | ReconnectInterval) => {
    if (event.type === 'event') {
      const data = event.data;
      try {
        const result = JSON.parse(data)
        console.log(result);
        onParsed(result);
      } catch (e) {
        console.error(e);
      }
    }
  };

    // https://web.dev/streams/#the-getreader-and-read-methods
    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);
    let done = false; 
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }
}