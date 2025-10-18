import React from 'react';
import type { Question } from '../../data/AssessmentFunctions/assessment';

interface CorrectAnswerEditorProps {
  question: Question;
  handleCorrectAnswerChange: (answer: any) => void;
  handleMultiChoiceCorrectAnswer: (option: string, isChecked: boolean) => void;
}

const CorrectAnswerEditor: React.FC<CorrectAnswerEditorProps> = React.memo(({ 
  question, 
  handleCorrectAnswerChange, 
  handleMultiChoiceCorrectAnswer 
}) => {
  switch (question.details.type) {
    case 'single-choice':
      return (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Set Correct Answer</h4>
          <div className="space-y-2">
            {question.details.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`correct-${question.id}-${index}`}
                  name={`correct-answer-${question.id}`}
                  checked={question.correctAnswer === option}
                  onChange={() => handleCorrectAnswerChange(option)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor={`correct-${question.id}-${index}`} className="ml-2 text-sm text-gray-700">
                  {option || '(empty option)'}
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    case 'multi-choice':
      return (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Set Correct Answers</h4>
          <div className="space-y-2">
            {question.details.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`correct-${question.id}-${index}`}
                  checked={(Array.isArray(question.correctAnswer) ? question.correctAnswer : []).includes(option)}
                  onChange={(e) => handleMultiChoiceCorrectAnswer(option, e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`correct-${question.id}-${index}`} className="ml-2 text-sm text-gray-700">
                  {option || '(empty option)'}
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    case 'short-text':
    case 'long-text':
    case 'numeric':
      return (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Set Correct Answer</h4>
          <input
            type={question.details.type === 'numeric' ? 'number' : 'text'}
            value={question.correctAnswer || ''}
            onChange={(e) => handleCorrectAnswerChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type the exact correct answer..."
          />
        </div>
      );
    default:
      return null;
  }
});

export default CorrectAnswerEditor;