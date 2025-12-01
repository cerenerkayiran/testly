'use client';

import { useState } from 'react';
import { Inter } from "next/font/google";
import { QuestionFormData, GeneratedQuestion, Language } from '@/types';
import { translations } from '@/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import ExportButtons from '@/components/ExportButtons';

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [formData, setFormData] = useState<QuestionFormData>({
    subject: '',
    topics: [],
    difficulty: 'medium',
    questionCounts: {
      'open-ended': 2,
      'multiple-choice': 2,
      'true-false': 2,
    },
    language: 'en',
  });
  const [topicsInput, setTopicsInput] = useState('');

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.subject.trim()) {
      setError(t.subjectRequired);
      setLoading(false);
      return;
    }

    if (formData.topics.length === 0) {
      setError(t.topicsRequired);
      setLoading(false);
      return;
    }

    const totalQuestions = formData.questionCounts['open-ended'] + 
                          formData.questionCounts['multiple-choice'] + 
                          formData.questionCounts['true-false'];
    
    if (totalQuestions === 0) {
      setError(t.questionsRequired);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      setError(error instanceof Error ? error.message : t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (index: number) => {
    setLoading(true);
    setError('');

    try {
      const currentQuestion = questions[index];
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          language,
          regenerateIndex: index,
          regenerateQuestionType: currentQuestion.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to regenerate question');
      }

      const data = await response.json();
      const newQuestions = [...questions];
      newQuestions[index] = data.questions[0];
      setQuestions(newQuestions);
    } catch (error) {
      setError(error instanceof Error ? error.message : t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 py-6 sm:py-12 px-3 sm:px-4 ${inter.className}`}>
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8 gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{t.title}</h1>
              <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                <SelectTrigger className="w-24 sm:w-32 border-gray-200 text-xs sm:text-sm h-9 sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en" className="text-xs sm:text-sm">🇺🇸 English</SelectItem>
                  <SelectItem value="tr" className="text-xs sm:text-sm">🇹🇷 Türkçe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                  {t.subject}
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={language === 'en' ? "Enter subject name" : "Konu adını girin"}
                />
              </div>

              {/* Topics */}
              <div className="space-y-2">
                <Label htmlFor="topics" className="text-sm font-medium text-gray-700">
                  {t.topics}
                </Label>
                <Textarea
                  id="topics"
                  value={topicsInput}
                  onChange={(e) => {
                    setTopicsInput(e.target.value);
                    const topics = e.target.value
                      .split(',')
                      .map(topic => topic.trim())
                      .filter(topic => topic.length > 0);
                    setFormData(prev => ({
                      ...prev,
                      topics
                    }));
                  }}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[60px] sm:min-h-[80px] resize-none"
                  placeholder={language === 'en' ? "Enter topics separated by commas" : "Konuları virgülle ayırarak girin"}
                />
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">{t.difficulty}</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData({
                  ...formData,
                  difficulty: value as QuestionFormData['difficulty']
                })}>
                  <SelectTrigger className="border border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500 shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-md">
                    <SelectItem value="easy">{t.easy}</SelectItem>
                    <SelectItem value="medium">{t.medium}</SelectItem>
                    <SelectItem value="hard">{t.hard}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Question Types */}
              <div className="space-y-3 sm:space-y-4">
                <Label className="text-sm font-medium text-gray-700">{t.questionTypes}</Label>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="open-ended" className="text-xs font-medium text-gray-600 block truncate">
                      {t.openEnded}
                    </Label>
                    <Input
                      id="open-ended"
                      type="number"
                      min="0"
                      value={formData.questionCounts['open-ended'] === 0 ? '' : formData.questionCounts['open-ended']}
                      onChange={(e) => {
                        const val = e.target.value.replace(/^0+(\d)/, '$1');
                        setFormData({
                          ...formData,
                          questionCounts: {
                            ...formData.questionCounts,
                            'open-ended': val === '' ? 0 : parseInt(val)
                          }
                        });
                      }}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-center h-10"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="multiple-choice" className="text-xs font-medium text-gray-600 block truncate">
                      {t.multipleChoice}
                    </Label>
                    <Input
                      id="multiple-choice"
                      type="number"
                      min="0"
                      value={formData.questionCounts['multiple-choice'] === 0 ? '' : formData.questionCounts['multiple-choice']}
                      onChange={(e) => {
                        const val = e.target.value.replace(/^0+(\d)/, '$1');
                        setFormData({
                          ...formData,
                          questionCounts: {
                            ...formData.questionCounts,
                            'multiple-choice': val === '' ? 0 : parseInt(val)
                          }
                        });
                      }}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-center h-10"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="true-false" className="text-xs font-medium text-gray-600 block truncate">
                      {t.trueFalse}
                    </Label>
                    <Input
                      id="true-false"
                      type="number"
                      min="0"
                      value={formData.questionCounts['true-false'] === 0 ? '' : formData.questionCounts['true-false']}
                      onChange={(e) => {
                        const val = e.target.value.replace(/^0+(\d)/, '$1');
                        setFormData({
                          ...formData,
                          questionCounts: {
                            ...formData.questionCounts,
                            'true-false': val === '' ? 0 : parseInt(val)
                          }
                        });
                      }}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-center h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#333446] via-[#7F8CAA] to-[#B8CFCE] hover:from-[#2a2d3a] hover:via-[#6f7a96] hover:to-[#a8bfbe] text-white py-2.5 sm:py-3 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] border-0"
                size="lg"
              >
                {loading ? t.loading : t.generate}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {questions.length > 0 && (
          <Card className="mt-4 sm:mt-6 border-0 shadow-sm">
            <CardContent className="p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{t.questions}</h2>
                <ExportButtons 
                  examData={{ subject: formData.subject, questions }} 
                  translations={{
                    saveQuestions: t.saveQuestions,
                    saveAnswerKey: t.saveAnswerKey,
                    true: t.true,
                    false: t.false,
                    subjectLabel: t.subjectLabel,
                    answerKey: t.answerKey,
                    questionsFileName: t.questionsFileName,
                    answerKeyFileName: t.answerKeyFileName
                  }}
                />
              </div>
              <div className="space-y-4 sm:space-y-6">
                {questions.map((q, index) => (
                  <div key={index} className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="flex-1 space-y-2 sm:space-y-3 w-full">
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-[#333446] text-sm font-medium rounded-full flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <p className="text-sm sm:text-base font-medium text-gray-900 leading-relaxed">{q.question}</p>
                        </div>
                        {q.options && (
                          <div className="ml-8 sm:ml-9 space-y-1.5 sm:space-y-2">
                            {q.options.map((opt, i) => (
                              <div key={i} className="flex items-start space-x-2">
                                <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full flex-shrink-0 mt-0.5">
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {q.type === 'true-false' && (
                          <div className="ml-8 sm:ml-9 space-y-1.5 sm:space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full flex-shrink-0">
                                A
                              </span>
                              <span className="text-xs sm:text-sm text-gray-700">{t.true}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full flex-shrink-0">
                                B
                              </span>
                              <span className="text-xs sm:text-sm text-gray-700">{t.false}</span>
                            </div>
                          </div>
                        )}
                        <div className="ml-8 sm:ml-9 mt-3 sm:mt-4 p-2.5 sm:p-3 bg-[#B8CFCE] border border-gray-200 rounded-md">
                          <p className="text-xs sm:text-sm text-gray-800">
                            <span className="font-medium">{t.answer}:</span> {q.answer}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleRegenerate(index)}
                        variant="ghost"
                        size="sm"
                        className="text-[#333446] hover:text-[#2a2d3a] hover:bg-blue-50 sm:ml-4 flex-shrink-0 text-xs sm:text-sm self-end sm:self-start"
                      >
                        {t.regenerate}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
