# Readclip AI Copilot 

This copilot is a tool that will help you working wth readclip codebase. It will help you to create API endpoints, create a database, and more.

## Technology

The readclip AI Copilot is built using the following technologies:

- Python: The main programming language used for the readclip AI Copilot.
- Together AI: A platform that provides LLM services to developers.
- Markdown: To store the prompts and documentation for the readclip AI Copilot.

## Installation

Requirements:

- Python 3.10 or higher

Install python dependencies:

```bash
pip install -r requirements.txt
```

## Usage

1. Generate API endpoints:

```bash
python ai_api_generator.py --prompt "Create an API endpoint for a YouTube service"
```

2. Create a database:

```bash
python ai_create_database.py --prompt "Create a database for a notes api"
```

## Features

- Generate API endpoints: The readclip AI Copilot can generate API endpoints based on the provided prompts and documentation. It will create a new file in the `api` folder with the API resource name and the necessary code to handle the endpoint.
- Create a database: The readclip AI Copilot can create a database based on the provided prompts and documentation. It will create a new file in the `db` folder with the database structure and the necessary code to interact with the database.
