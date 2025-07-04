import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { QuestionFormData, GeneratedQuestion, QuestionType } from '@/types';

interface RegenerateRequest extends QuestionFormData {
  regenerateIndex?: number;
  regenerateQuestionType?: QuestionType;
}

export async function POST(request: Request) {
  try {
    const data: RegenerateRequest = await request.json();
    const { subject, topics, difficulty, questionCounts, language, regenerateIndex, regenerateQuestionType } = data;

    let prompt: string;

    // Check if this is a regeneration request
    if (regenerateIndex !== undefined && regenerateQuestionType) {
      // Generate a single question of the specific type
      const questionTypeDescription = regenerateQuestionType === 'multiple-choice' 
        ? 'multiple-choice question (with 4 options)' 
        : regenerateQuestionType === 'true-false' 
        ? 'true/false question' 
        : 'open-ended question';

      prompt = `Generate a single ${questionTypeDescription} for the following specifications:\nSubject: ${subject}\nTopics: ${topics.join(', ')}\nDifficulty: ${difficulty}\nLanguage: ${language}\n\nGenerate exactly 1 ${regenerateQuestionType} question.\n\nFormat the response as a JSON array with a single object with the following structure:\n{\n  "type": "${regenerateQuestionType}",\n  "question": "the question text",\n  "options": ["option1", "option2", "option3", "option4"] (only for multiple-choice),\n  "answer": "the correct answer"\n}\n\nIMPORTANT: Make sure all questions and answers are in ${language === 'en' ? 'English' : 'Turkish'}. ${language === 'tr' ? 'For true/false questions in Turkish, use "Doğru" for true answers and "Yanlış" for false answers. Never use "True" or "False" for Turkish questions.' : 'For true/false questions, use "True" or "False" as answers.'}`;
    } else {
      // Original generation logic
      prompt = `Generate exam questions for the following specifications:\nSubject: ${subject}\nTopics: ${topics.join(', ')}\nDifficulty: ${difficulty}\nLanguage: ${language}\n\nPlease generate:\n- ${questionCounts['open-ended']} open-ended questions\n- ${questionCounts['multiple-choice']} multiple-choice questions (with 4 options each)\n- ${questionCounts['true-false']} true/false questions\n\nFormat the response as a JSON array of objects with the following structure:\n{\n  "type": "open-ended" | "multiple-choice" | "true-false",\n  "question": "the question text",\n  "options": ["option1", "option2", "option3", "option4"] (only for multiple-choice),\n  "answer": "the correct answer"\n}\n\nIMPORTANT: Make sure all questions and answers are in ${language === 'en' ? 'English' : 'Turkish'}. ${language === 'tr' ? 'For true/false questions in Turkish, use "Doğru" for true answers and "Yanlış" for false answers. Never use "True" or "False" for Turkish questions.' : 'For true/false questions, use "True" or "False" as answers.'}`;
    }

    const token = process.env.GITHUB_PAT || '';
    const endpoint = "https://models.inference.ai.azure.com";
    const modelName = "gpt-4o";

    const client = new OpenAI({
      baseURL: endpoint,
      apiKey: token,
    });

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "" },
        { role: "user", content: prompt }
      ],
      model: modelName,
      temperature: 1,
      max_tokens: 4096,
      top_p: 1
    });

    const text = response.choices[0].message.content;
    let questions: GeneratedQuestion[] = [];
    try {
      const cleaned = (text || '').replace(/```json|```/g, '').trim();
      questions = JSON.parse(cleaned);
    } catch (_) {
      throw new Error('Failed to parse model response: ' + text);
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
} 