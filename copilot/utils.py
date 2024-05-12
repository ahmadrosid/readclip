import re

def read_file_to_string(file_path):
    """
    Reads the contents of a file into a string.

    Args:
        file_path (str): The path to the file to be read.

    Returns:
        str: The contents of the file as a string.
    """
    try:
        with open(file_path, "r") as file:
            file_contents = file.read()
        return file_contents
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
    except Exception as e:
        print(f"Error: {e}")

def write_file(file_path, data):
    try:
        with open(file_path, 'a') as file:
            file.write(data)
    except IOError:
        print(f"An error occurred while writing to {file_path}.")

def parse_go_code_snippets(text):
    pattern = r'\*\*(.+?):\*\*\s*```go(.*?)```'
    matches = re.findall(pattern, text, re.DOTALL)
    
    code_snippets = []
    for match in matches:
        file_path, code = match
        code_snippets.append({
            'file_path': file_path.strip(),
            'code': code.strip()
        })
    
    return code_snippets
