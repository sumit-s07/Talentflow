import React, { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CandidateCard from './CandidateCard';
import type { Candidate } from '../../data/CandidatesFunctions/mockCandidates';

interface KanbanColumnProps {
  id: string;
  title: string;
  candidates: Candidate[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const getStageHeaderStyle = (stage: string) => {
    switch (stage) {
        case 'Hired': return 'border-t-4 border-green-500';
        case 'Rejected': return 'border-t-4 border-red-500';
        case 'Interview': return 'border-t-4 border-indigo-500';
        case 'Screening': return 'border-t-4 border-yellow-500';
        case 'Applied': default: return 'border-t-4 border-blue-500';
    }
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  id, 
  title, 
  candidates, 
  searchTerm, 
  onSearchChange 
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const filteredCandidates = useMemo(() => {
    if (!searchTerm) return candidates;
    const lowercasedTerm = searchTerm.toLowerCase();
    return candidates.filter(c =>
      c.name.toLowerCase().includes(lowercasedTerm) ||
      c.email.toLowerCase().includes(lowercasedTerm)
    );
  }, [candidates, searchTerm]);

  const totalCount = candidates.length;
  const filteredCount = filteredCandidates.length;

  return (
    <div className={`w-full max-w-sm md:w-1/3  flex-shrink-0 bg-gray-100 dark:bg-gray-800/50 rounded-xl flex flex-col ${getStageHeaderStyle(title)}`}>
      
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg capitalize text-gray-800 dark:text-white">{title}</h3>
          <span className="text-sm text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full font-medium">
            {searchTerm ? `${filteredCount} / ${totalCount}` : totalCount}
          </span>
        </div>
        
        <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              placeholder="Search in this column..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full p-2 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <SortableContext
          items={filteredCandidates.map(c => c.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div 
            ref={setNodeRef} 
            className={`p-4 space-y-3 min-h-full transition-colors duration-300 ${
              isOver ? 'bg-blue-50 dark:bg-blue-900/50' : ''
            }`}
          >
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map(candidate => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))
            ) : (
              <div className={`text-center py-16 border-2 border-dashed rounded-lg transition-all ${
                isOver 
                  ? 'border-blue-400 bg-blue-100 dark:border-blue-500 dark:bg-blue-900/60' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                <p className={`text-sm font-medium ${
                  isOver ? 'text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {searchTerm ? 'No matching candidates' : 'Drop candidates here'}
                </p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;