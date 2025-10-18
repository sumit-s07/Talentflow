import React, { useState } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import { MENTIONABLE_USERS } from '../../data/CandidatesFunctions/mockUsers';
import './mentionStyles.css'; 

interface NoteInputProps {
  onSave: (noteText: string) => void;
}

const NoteInput: React.FC<NoteInputProps> = ({ onSave }) => {
  const [text, setText] = useState('');

  const handleSave = () => {
    if (text.trim()) {
      onSave(text);
      setText('');
    }
  };

  const userSuggestions = MENTIONABLE_USERS.map(user => ({
    id: user.id,
    display: user.name,
  }));

  return (
    <div className="flex items-start gap-4 p-4">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1">
          HR
        </div>
        <div className="flex-grow flex items-start gap-2">
            <div className="flex-grow bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <MentionsInput
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Add a note... mention a user with @"
                  className="mentions" 
                >
                  <Mention
                    trigger="@"
                    data={userSuggestions}
                    markup="@[__display__](__id__)"
                    displayTransform={(_id, display) => `@${display}`}
                  />
                </MentionsInput>
            </div>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-md shadow-sm hover:shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all flex-shrink-0 mt-1"
            >
              Save
            </button>
        </div>
    </div>
  );
};

export default NoteInput;