# Exam Question Generator 📝

A full-stack web application that generates exam questions using Google's Gemini models through the Gemini API. The application supports both English🇺🇸 and Turkish🇹🇷 languages and allows users to generate different types of questions (open-ended, multiple-choice, and true/false).

See demo at: https://testly.cerenerkayiran.uk/

## Features

- Generate exam questions in English or Turkish
- Support for multiple question types:
  - Open-ended questions
  - Multiple-choice questions
  - True/False questions
- Adjustable difficulty levels
- Ability to regenerate individual questions
- Export questions and answer keys to separate Word documents
- Responsive design with custom color palette
- Bilingual interface (English/Turkish)

## Prerequisites

- Node.js 18+ and npm
- A free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd testly
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Gemini API key:
```
GEMINI_API_KEY=your_gemini_api_key_here
# Optional: override the default model (gemini-3.5-flash-lite)
# GEMINI_MODEL=gemini-3.5-flash-lite
```

4. Start the development server:
```bash
npm run dev
```

5. Open local in your browser.

## Usage

1. Select your preferred language (English or Turkish)
2. Enter the subject name
3. Enter the topics (comma-separated)
4. Select the difficulty level
5. Choose the number of questions for each type
6. Click "Generate Questions"
7. Review the generated questions
8. Regenerate individual questions if needed
9. Export questions or answer key as separate Word documents

## Technologies Used

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Google Gemini API (via the OpenAI-compatible SDK)
- docx (for Word document generation)

---
*updated with environment variable configuration*
