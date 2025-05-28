export type Language = 'en' | 'tr';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuestionType = 'open-ended' | 'multiple-choice' | 'true-false';

export interface QuestionFormData {
  subject: string;
  topics: string[];
  difficulty: Difficulty;
  questionCounts: {
    'open-ended': number;
    'multiple-choice': number;
    'true-false': number;
  };
  language: Language;
}

export interface GeneratedQuestion {
  type: QuestionType;
  question: string;
  options?: string[];
  answer: string;
}

export interface Translations {
  en: {
    [key: string]: string;
  };
  tr: {
    [key: string]: string;
  };
} 