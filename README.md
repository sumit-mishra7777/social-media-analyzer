# Social Media Content Analyzer

This is a full-stack web application designed to analyze social media content from uploaded PDF or image files. It extracts the text and uses an AI model to provide actionable suggestions for improving engagement.

**Live Demo URL:** (Will be added after deployment)

---

## Features
- **File Upload:** Supports PDF and image files (PNG, JPG, etc.) with a drag-and-drop interface.
- **Text Extraction:**
    - Parses text from PDF documents.
    - Uses Optical Character Recognition (OCR) for image-based content.
- **AI-Powered Analysis:** Leverages the Google Gemini API to analyze the extracted text.
- **Engagement Suggestions:** Provides actionable recommendations to enhance the content's performance on social media.
- **Modern & Responsive UI:** A clean, animated, and professional user interface built with Tailwind CSS and Framer Motion.

---

## Technical Stack

- **Frontend:**
    - React (with Vite)
    - Tailwind CSS (v3)
    - Framer Motion (for animations)
    - Lucide React (for icons)
    - Axios (for API calls)
    - React Dropzone
- **Backend:**
    - Node.js
    - Express.js
    - `multer` for file handling
    - `pdf-parse` for PDF text extraction
    - `tesseract.js` for OCR
    - Google Gemini API (`@google/generative-ai`) for AI analysis

---

## Local Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-link>
    cd social-media-analyzer
    ```
2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    ```
    - Create a `.env` file in the `backend` directory.
    - Add your Google Gemini API key: `GEMINI_API_KEY=YOUR_API_KEY_HERE`
    - Run the backend server:
    ```bash
    npm run dev
    ```
3.  **Setup Frontend:**
    - Open a new terminal.
    ```bash
    cd frontend
    npm install
    ```
    - Run the frontend application:
    ```bash
    npm run dev
    ```
The application will be available at `https://social-media-analyzer-peqt.vercel.app/`.
