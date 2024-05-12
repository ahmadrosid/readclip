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