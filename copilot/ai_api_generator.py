import sys
from utils import parse_go_code_snippets
from utils import write_file
from utils import read_file_to_string
from llm import ask_together
from prompt_toolkit.shortcuts import confirm

messages = []

def reset_messages():
    prompt = read_file_to_string("./prompts/api_generator_prompt.md") 
    messages.append({"role": "system", "content": prompt})

def ask(question): 
    messages.append({"role": "user", "content": question})
    # response = ask_groq(messages)
    response = ask_together(messages)
    messages.append({"role": "assistant", "content": response})

reset_messages()

args = sys.argv[1:]
if len(args) > 0:
    prompt_file_path = args[0]
    output = ask(read_file_to_string(prompt_file_path)) 
    code_snippets = parse_go_code_snippets(output.strip())
    for snippet in code_snippets:
        print(f"Create file: {snippet['file_path']}")
        answer = confirm(f"Do you want to create file {snippet['file_path']}?")
        if answer:
            print(f"Create file: {snippet['file_path']}")
        # write_file("../" +snippet['file_path'], snippet['code'])


# ask(question="create api to store notes, the notes will be belong for some url.")

# try:
#     while True:
#         user_input = get_input("Ask ai: ")
#         if user_input.lower() == 'exit' or user_input.lower() == 'q':
#             print("")
#             break
#         if user_input.lower() == 'reset':
#             reset_messages()
#             print("cleared...")
#             continue
#         if user_input == '':
#             continue
#         ask(question=user_input)
# except KeyboardInterrupt:
#     print("")
# except:
#     print("Unexpected error:", sys.exc_info()[0])
