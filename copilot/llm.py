import os
from groq import Groq

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def ask_groq(messages):
    chat_completion = client.chat.completions.create(
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
