
import sys
import anthropic
from dotenv import load_dotenv
load_dotenv()
from prompt_toolkit import prompt as get_input

client = anthropic.Anthropic()

messages = []

def ask_claude(question): 
    messages.append({"role": "user", "content": question})
    with client.messages.stream(
        max_tokens=1024,
        messages=messages,
        # model="claude-3-opus-20240229",
        model="claude-3-sonnet-20240229",
    ) as stream:
        result = ""
        for text in stream.text_stream:
            result += text
            print(text, end="", flush=True)
        messages.append({"role": "assistant", "content": result})
        print("")

try:
    while True:
        user_input = get_input("Ask ai: ")
        if user_input.lower() == 'exit' or user_input.lower() == 'q':
            print("")
            break
        if user_input.lower() == 'reset':
            messages = []
            print("cleared...")
            continue
        if user_input == '':
            continue
        ask_claude(question=user_input)
except KeyboardInterrupt:
    print("")
except:
    print("Unexpected error:", sys.exc_info()[0])
