/**
 * 

curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "Analyze Business Value Proposition Statement using this framework.\n\nValue Proposition Statement\n- For (target customer segments)\n- who are dissatisfied with (existing solution)\n- because it does not meet (key unmet needs),\n- (Venture name) provides a (product category)\n- that delivers (key benefits of your solution).\n\nOutput your analysis in one sentence."
    },
    {
      "role": "user",
      "content": "Instantly answer your visitors'\'' questions with a personalized chatbot trained on your website content.\n\n\nYour Own AI Chatbot\n\nEverything you need to create your own AI Chatbot\nCreating the chatbot trained on your own content\n\nis now as easy as clicking a button.\n\nWe will automatically fetch all the pages on your website and show them to you.\nSelect the pages you want the chatbot to train on and click on\n**Start Training.**You now have your own chatbot that can answer anything related to your website content.\n\nReady to take your website to the next level?\nto the next level?\n\n\n"
    },
    {
      "role": "assistant",
      "content": "For website owners who want to improve user experience and increase customer engagement, but are dissatisfied with existing solutions that require coding knowledge or external chatbot integrations, MyChatbot provides an AI chatbot platform that instantly answers visitors'\'' questions with personalized responses, trained on their own website content."
    }
  ],
  "temperature": 1,
  "max_tokens": 256,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0
}'

 * 
 */

import { handleReturnFetch } from ".";

type ApiRequest = {
  model: string;
  messages: {
    role: string;
    content: string;
  }[];
  temperature: number;
  max_tokens: number;
  //   top_p: number;
  //   frequency_penalty: number;
  //   presence_penalty: number;
};

type ApiResponse = {
  id: string;
  object: string;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: "stop";
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export async function fetchOpenai(request: ApiRequest): Promise<ApiResponse> {
  const OPENAI_API_KEY = window.localStorage.getItem("OPENAI_API_KEY");
  return handleReturnFetch(
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        ...request,
      }),
    })
  );
}
