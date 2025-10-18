import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Candidate } from '../../data/CandidatesFunctions/mockCandidates';
import { Link } from 'react-router-dom';

interface CandidateCardProps {
  candidate: Candidate;
  isDragOverlay?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, isDragOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: candidate.id.toString(),
    disabled: isDragOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms ease',
  };

  const cardContent = (
    <div className="flex items-center  justify-between w-full">
      <div>
        <p className="font-semibold text-gray-800 dark:text-gray-100">{candidate.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.email}</p>
      </div>
      {!isDragOverlay && (
        <div
          className="drag-handle cursor-grab active:cursor-grabbing p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          {...listeners}
          {...attributes}
        >
          <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
        </div>
      )}
    </div>
  );

  const cardClasses = `bg-white dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 ${
    isDragging ? 'opacity-50 shadow-lg' : ''
  } ${isDragOverlay ? 'rotate-2 shadow-xl cursor-grabbing' : ''}`;

  return (
    <div
      ref={!isDragOverlay ? setNodeRef : undefined}
      style={style}
      className={cardClasses}
    >
      {isDragOverlay ? (
        <div className="p-3 flex">{cardContent}</div>
      ) : (
        <Link
          to={`/jobs/${candidate.jobId}/candidates/${candidate.id}`}
          className="block no-underline text-current p-3"
        >
          {cardContent}
        </Link>
      )}
    </div>
  );
};

export default CandidateCard;