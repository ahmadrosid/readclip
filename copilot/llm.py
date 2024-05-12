import os
from groq import Groq
from together import Together

groq_client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

together_client = Together(api_key=os.environ.get("TOGETHER_API_KEY"))

def ask_groq(messages):
    chat_completion = groq_client.chat.completions.create(
        messages=messages,
        model="llama3-70b-8192",
        stream=True,
    )
    result = ""
    for chunk in chat_completion:
        result += chunk.choices[0].delta.content
        print(chunk.choices[0].delta.content, end="", flush=True)
    print("\n")
    return result

def ask_together(messages):
    response = together_client.chat.completions.create(
        messages=messages,
        # model="meta-llama/Llama-3-8b-chat-hf",
        model="mistralai/Mixtral-8x22B-Instruct-v0.1",
        stream=True,
    )
    result = ""
    for chunk in response:
        result += chunk.choices[0].delta.content
        print(chunk.choices[0].delta.content, end="", flush=True)
    print("\n")
    return result
