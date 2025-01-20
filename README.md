# Document Summarization Tool

A web application that extracts text from uploaded PDF or image files, generates summaries, and identifies key points. This tool leverages modern technologies to simplify document analysis and improve productivity.

## Features

- **File Upload**: Drag-and-drop or manually upload PDF and image files.
- **Text Extraction**: Extracts textual data from uploaded documents.
- **Summarization**: Generates concise summaries of extracted text.
- **Key Points**: Highlights important points from the text.
- **File Preview**: Provides a preview of the uploaded file (PDF or image).
- **Responsive Design**: Optimized for both desktop and mobile devices.

---

## Demo

### User Workflow:
1. Upload a file via the drag-and-drop interface or manual selection.
2. Adjust the summary length using the slider.
3. Click "Upload and Summarize" to process the file.
4. View results:
   - Original text.
   - Summary.
   - Key points.

---

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: Node.js with Express.js
- **File Processing**: `multer` for file uploads, OCR for text extraction (e.g., `tesseract.js`), and text summarization techniques.

---

## Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- npm (comes with Node.js)
- A modern web browser (for testing the frontend)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/Sumit2997/document-summarization-tool/.git
   cd document-summarization-tool
2. Install dependencies:
    ```bash
    npm install
3. Start the server:

    ```bash
    npm start
4. Open the application in your browser at:
    http://localhost:3000