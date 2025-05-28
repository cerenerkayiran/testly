import React from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { Button } from "@/components/ui/button";

interface ExportButtonsProps {
  examData: {
    subject: string;
    questions: Array<{
      type: string;
      question: string;
      answer: string;
      options?: string[];
    }>;
  };
  translations: {
    saveQuestions: string;
    saveAnswerKey: string;
    true: string;
    false: string;
    subjectLabel: string;
    answerKey: string;
    questionsFileName: string;
    answerKeyFileName: string;
  };
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ examData, translations }) => {
  // Export only subject and questions (no answers, no difficulty)
  const handleSaveQuestions = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${translations.subjectLabel}: ${examData.subject}`,
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: { after: 400 },
            }),
            ...examData.questions.flatMap((q, idx) => {
              const paragraphs = [];
              
              // Question with bold number
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${idx + 1}. `,
                      bold: true,
                      size: 24,
                    }),
                    new TextRun({
                      text: q.question,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                })
              );

              // Add options for multiple choice
              if (q.type === 'multiple-choice' && q.options) {
                q.options.forEach((option, optIdx) => {
                  paragraphs.push(
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${String.fromCharCode(65 + optIdx)}. ${option}`,
                          size: 22,
                        }),
                      ],
                      spacing: { after: 100 },
                    })
                  );
                });
              }

              // Add True/False options for true-false questions
              if (q.type === 'true-false') {
                paragraphs.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `A. ${translations.true}`,
                        size: 22,
                      }),
                    ],
                    spacing: { after: 100 },
                  })
                );
                paragraphs.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `B. ${translations.false}`,
                        size: 22,
                      }),
                    ],
                    spacing: { after: 100 },
                  })
                );
              }

              // Add extra spacing after each question
              paragraphs.push(
                new Paragraph({
                  children: [new TextRun({ text: "", size: 12 })],
                  spacing: { after: 300 },
                })
              );

              return paragraphs;
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${examData.subject}-${translations.questionsFileName}.docx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Export only answers as an answer key
  const handleSaveAnswerKey = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${translations.answerKey}:`,
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: { after: 400 },
            }),
            ...examData.questions.map((q, idx) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${idx + 1}. `,
                    bold: true,
                    size: 24,
                  }),
                  new TextRun({
                    text: q.answer,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              })
            ),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${examData.subject}-${translations.answerKeyFileName}.docx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-4">
      <Button
        onClick={handleSaveQuestions}
        className="bg-gradient-to-r from-[#333446] via-[#7F8CAA] to-[#B8CFCE] hover:from-[#2a2d3a] hover:via-[#6f7a96] hover:to-[#a8bfbe] text-white py-2 px-4 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] border-0"
        size="sm"
      >
        {translations.saveQuestions}
      </Button>
      <Button
        onClick={handleSaveAnswerKey}
        className="bg-gradient-to-r from-[#333446] via-[#7F8CAA] to-[#B8CFCE] hover:from-[#2a2d3a] hover:via-[#6f7a96] hover:to-[#a8bfbe] text-white py-2 px-4 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] border-0"
        size="sm"
      >
        {translations.saveAnswerKey}
      </Button>
    </div>
  );
};

export default ExportButtons; 