import pdfplumber
import re

# Extracts all the text from a PDF file and returns it as a string. It uses the pdfplumber library to open the PDF and extract text from each page, concatenating it into a single string. The clean_text function is used to remove extra spaces and newlines from the extracted text, ensuring that it is formatted properly for further processing.
def extract_text_from_pdf(file_path):
    text = ""

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"

    return text

# Cleans the extracted text by removing extra spaces and newlines. It replaces newline characters with spaces and then collapses multiple spaces into a single space, ensuring that the text is clean and properly formatted for further processing or analysis.
def clean_text(text):
    # Remove extra spaces
    text = text.replace("\n", " ")
    text = " ".join(text.split())
    return text

# Splits the cleaned text into clauses based on periods followed by spaces or newlines. It uses a regular expression to identify these delimiters and splits the text accordingly. The resulting list of clauses is then stripped of leading and trailing whitespace, and any empty clauses are filtered out, returning a clean list of clauses for further analysis or processing.
#def split_into_clauses(text):
#    clauses = re.split(r'\.\s+|\n', text)
#    return [clause.strip() for clause in clauses if clause.strip()]

def split_into_clauses(text):
    clauses = re.split(r'\.\s+|\n', text)

    # Filter bad clauses
    cleaned = []
    for clause in clauses:
        clause = clause.strip()
        if len(clause) > 20 and not clause.isdigit():
            cleaned.append(clause)

    return cleaned