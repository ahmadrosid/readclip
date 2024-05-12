import os

from groq import Groq
from utils import read_file_to_string

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

messages = []
prompt = read_file_to_string("./prompts/api_generator.md") 

messages.append({"role": "system", "content": prompt})
def ask_groq(question): 
    messages.append({"role": "user", "content": question})
    chat_completion = client.chat.completions.create(
        messages=messages,
        model="llama3-70b-8192",
        stream=True,
    )
    for chunk in chat_completion:
        print(chunk.choices[0].delta.content, end="", flush=True)

ask_groq("Create an api to store notes into database!")

