from utils import read_file_to_string
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

reset_messages()

ask(question="Create a new module for the blog. The blog post content will not be stored in the database; instead, it will be stored in a folder called 'posts' as a markdown file. This module will not accept post requests from users since it will only read the markdown files and compile them into HTML.")

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
