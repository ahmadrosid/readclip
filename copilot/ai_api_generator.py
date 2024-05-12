import os
import sys
from groq import Groq
from utils import read_file_to_string
from llm import ask_groq
from prompt_toolkit import prompt as get_input

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

messages = []

def reset_messages():
    prompt = read_file_to_string("./prompts/api_generator.md") 
    messages.append({"role": "system", "content": prompt})

def ask(question): 
    messages.append({"role": "user", "content": question})
    response = ask_groq(messages)
    messages.append({"role": "assistant", "content": response})

reset_messages()

try:
    while True:
        user_input = get_input("Ask ai: ")
        if user_input.lower() == 'exit' or user_input.lower() == 'q':
            print("")
            break
        if user_input.lower() == 'reset':
            reset_messages()
            print("cleared...")
            continue
        if user_input == '':
            continue
        ask(question=user_input)
except KeyboardInterrupt:
    print("")
except:
    print("Unexpected error:", sys.exc_info()[0])
