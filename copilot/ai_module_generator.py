import sys
from utils import read_file_to_string, write_file, parse_go_code_snippets
from llm import ask_groq, ask_together
from prompt_toolkit import prompt as get_input
from dotenv import load_dotenv

load_dotenv()

messages = []

def reset_messages():
    prompt = read_file_to_string("./prompts/module_generator_prompt.md")  
    messages.append({"role": "system", "content": prompt})

def ask(question): 
    messages.append({"role": "user", "content": question})
    # response = ask_groq(messages)
    response = ask_together(messages)
    messages.append({"role": "assistant", "content": response})
    return response

reset_messages()

args = sys.argv[1:]
if len(args) > 0:
    prompt_file_path = args[0]
    output = ask(read_file_to_string(prompt_file_path)) 
    write_file("example_output_prompt.md", output.strip())
    print("Output written to example_output_prompt.md")

    text = read_file_to_string("example_output_prompt.md")
    code_snippets = parse_go_code_snippets(text)
    for snippet in code_snippets:
        print(f"File path: {snippet['file_path']}")
        # print(snippet['code'])
        print()
elif len(sys.argv) == 0:
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
