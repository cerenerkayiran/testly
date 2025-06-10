# Exam Question Generator 📝

A full-stack web application that generates exam questions using OpenAI's GPT models through GitHub Models API. The application supports both English🇺🇸 and Turkish🇹🇷 languages and allows users to generate different types of questions (open-ended, multiple-choice, and true/false).

See demo at: https://testly-cyan.vercel.app/

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
- GitHub Personal Access Token with access to GitHub Models

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

3. Create a `.env.local` file in the root directory and add your GitHub PAT:
```
GITHUB_PAT=your_github_personal_access_token_here
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
- GitHub Models API (OpenAI GPT-4o)
- docx (for Word document generation)

---
*updated with environment variable configuration*
