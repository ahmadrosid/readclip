import re
import os

def create_file_if_not_exists(file_path):
    """
    Creates a file with the given path if it doesn't already exist.
    Creates the necessary directories if they don't exist.

    Args:
        file_path (str): The path of the file to be created.

    Returns:
        bool: True if the file was created, False if the file already existed.
    """
    directory = os.path.dirname(file_path)
    print(f"directory: {directory}")
    # if not os.path.exists(directory):
    #     try:
    #         os.makedirs(directory)
    #     except OSError as e:
    #         print(f"Error creating directory: {e}")
    #         return False

    if not os.path.exists(file_path):
        try:
            with open(file_path, 'w') as file:
                file.write('')  # Write an empty string to create the file
            return True
        except IOError as e:
            print(f"Error creating file: {e}")
            return False
    else:
        return False

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
    create_file_if_not_exists(file_path)
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
