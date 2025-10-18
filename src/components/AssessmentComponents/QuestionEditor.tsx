import React, { useState, useCallback } from 'react';
import type { Question, QuestionDetails } from '../../data/AssessmentFunctions/assessment';

const CorrectAnswerEditor: React.FC<{
  question: Question;
  handleCorrectAnswerChange: (answer: any) => void;
  handleMultiChoiceCorrectAnswer: (option: string, isChecked: boolean) => void;
}> = React.memo(({ question, handleCorrectAnswerChange, handleMultiChoiceCorrectAnswer }) => {
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

interface QuestionEditorProps {
  question: Question;
  allQuestions: Question[];
  updateQuestion: (updatedQuestion: Question) => void;
  deleteQuestion: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, allQuestions, updateQuestion, deleteQuestion }) => {

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isConditionEnabled, setIsConditionEnabled] = useState<boolean>(!!question.condition);

  const handleCorrectAnswerChange = useCallback((answer: any) => {
    updateQuestion({ ...question, correctAnswer: answer });
  }, [question, updateQuestion]);

  const handleMultiChoiceCorrectAnswer = useCallback((option: string, isChecked: boolean) => {
    const currentAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
    const newAnswers = isChecked
      ? [...currentAnswers, option]
      : currentAnswers.filter(a => a !== option);
    updateQuestion({ ...question, correctAnswer: newAnswers });
  }, [question, updateQuestion]);

  const handleTextChange = (newText: string) => updateQuestion({ ...question, text: newText });
  const handleRequiredChange = (isRequired: boolean) => updateQuestion({ ...question, isRequired });

  const handleTypeChange = (newType: QuestionDetails['type']) => {
    let newDetails: QuestionDetails;
    if (newType === 'single-choice' || newType === 'multi-choice') {
      newDetails = { type: newType, options: [''] };
    } else {
      newDetails = { type: newType };
    }
    const { correctAnswer, ...rest } = question;
    updateQuestion({ ...rest, details: newDetails });
  };
  
  const handleOptionChange = (index: number, value: string) => {
    if (question.details.type !== 'single-choice' && question.details.type !== 'multi-choice') return;
    const newOptions = [...(question.details.options || [])];
    newOptions[index] = value;
    updateQuestion({ ...question, details: { ...question.details, options: newOptions } });
  };

  const handleAddOption = () => {
    if (question.details.type !== 'single-choice' && question.details.type !== 'multi-choice') return;
    const newOptions = [...(question.details.options || []), ''];
    updateQuestion({ ...question, details: { ...question.details, options: newOptions } });
  };

  const handleDeleteOption = (index: number) => {
    if (question.details.type !== 'single-choice' && question.details.type !== 'multi-choice') return;
    const newOptions = (question.details.options || []).filter((_, i) => i !== index);
    updateQuestion({ ...question, details: { ...question.details, options: newOptions } });
  };
  
   const handleDetailChange = (key: string, value: any) => {
     updateQuestion({ ...question, details: { ...question.details, [key]: value }});
   };

   const handleConditionToggle = (enabled: boolean) => {
    setIsConditionEnabled(enabled);
    if (!enabled) {
      const { condition, ...rest } = question;
      updateQuestion(rest);
    } else {
      updateQuestion({ ...question, condition: { questionId: '', value: '' } });
    }
  };

  const handleConditionChange = (key: 'questionId' | 'value', value: any) => {
    updateQuestion({ ...question, condition: { ...question.condition!, [key]: value } });
  };
return (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm relative group transition-shadow hover:shadow-md">
    <div className="flex items-center p-2 border-b border-gray-100 dark:border-gray-700">
      <div className="drag-handle cursor-move text-gray-300 dark:text-gray-500 hover:text-gray-500 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16">
          <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        </svg>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`p-2 rounded-md transition-colors ${
          isCollapsed
            ? 'text-gray-700 dark:text-gray-200 bg-blue-200 dark:bg-blue-900'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        aria-label={isCollapsed ? 'Expand question' : 'Collapse question'}
      >
        {isCollapsed ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        )}
      </button>

      <div className="flex-grow mx-2">
        {isCollapsed && (
          <p className="text-gray-800 dark:text-gray-100 font-medium truncate">
            {question.text || '(Question is empty)'}
          </p>
        )}
      </div>

      <button
        onClick={deleteQuestion}
        className="p-2 rounded-full text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-500 opacity-100 group-hover:opacity-100 transition-all"
        aria-label="Delete question"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    {!isCollapsed && (
      <div className="p-4 space-y-4">
        <textarea
          value={question.text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Type your question here..."
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
          rows={2}
        />

        <div className="flex items-center justify-between">
          <select
            value={question.details.type}
            onChange={(e) => handleTypeChange(e.target.value as QuestionDetails['type'])}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="short-text">Short Text</option>
            <option value="long-text">Long Text</option>
            <option value="single-choice">Single Choice</option>
            <option value="multi-choice">Multi-choice</option>
            <option value="numeric">Numeric</option>
            <option value="file-upload">File Upload</option>
          </select>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`required-${question.id}`}
              checked={question.isRequired}
              onChange={(e) => handleRequiredChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor={`required-${question.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Required
            </label>
          </div>
        </div>

        {(question.details.type === 'single-choice' || question.details.type === 'multi-choice') && (
          <div>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Options</h4>
            <div className="space-y-2">
              {(question.details.options || []).map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <button
                    onClick={() => handleDeleteOption(index)}
                    className="p-2 text-gray-400 dark:text-gray-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-500 transition-colors"
                    aria-label="Delete option"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddOption}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2 text-sm text-blue-600 dark:text-blue-400 font-semibold border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all"
            >
              + Add Option
            </button>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-900/80 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
          <CorrectAnswerEditor 
            question={question}
            handleCorrectAnswerChange={handleCorrectAnswerChange}
            handleMultiChoiceCorrectAnswer={handleMultiChoiceCorrectAnswer}
          />
          
          {(question.details.type === 'short-text' || question.details.type === 'long-text') && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Validation</label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Max Length:</span>
                <input type="number" value={question.details.maxLength || ''} onChange={e => handleDetailChange('maxLength', e.target.value ? parseInt(e.target.value) : undefined)} className="w-24 p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
            </div>
          )}
          
          {question.details.type === 'numeric' && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Validation</label>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Min:</span>
                  <input type="number" value={question.details.min || ''} onChange={e => handleDetailChange('min', e.target.value ? parseInt(e.target.value) : undefined)} className="w-24 p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Max:</span>
                  <input type="number" value={question.details.max || ''} onChange={e => handleDetailChange('max', e.target.value ? parseInt(e.target.value) : undefined)} className="w-24 p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Conditional Logic</label>
            <div className="flex items-center gap-2 mt-1">
              <input type="checkbox" id={`cond-${question.id}`} checked={isConditionEnabled} onChange={e => handleConditionToggle(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500" />
              <label htmlFor={`cond-${question.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-400">Show this question based on another answer</label>
            </div>
            {isConditionEnabled && (
              <div className="p-3 mt-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 space-y-2">
                <select value={question.condition?.questionId || ''} onChange={e => handleConditionChange('questionId', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">Select a question...</option>
                    {allQuestions.filter(q => q.id !== question.id).map(q => (
                      <option key={q.id} value={q.id}>
                        {q.text || `(Untitled Question)`}
                      </option>
                    ))}
                </select>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">if it equals:</span>
                  <input type="text" value={question.condition?.value || ''} onChange={e => handleConditionChange('value', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default React.memo(QuestionEditor);

