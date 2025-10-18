import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCandidates } from '../hooks/CandidatesHook/useCandidates';
import type { Candidate } from '../data/CandidatesFunctions/mockCandidates';

const getStageBadgeColor = (stage: Candidate['currentStage']) => {
    switch (stage) {
        case 'Hired':
            return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300';
        case 'Rejected':
            return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300';
        case 'Interview':
            return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300';
        case 'Screening':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300';
        case 'Applied':
        default:
            return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300';
    }
};


const CandidatesList: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const numericJobId = jobId ? parseInt(jobId, 10) : undefined;

  const {
    isLoading,
    searchedCandidates,
    searchTerm,
    setSearchTerm,
    stageFilter,
    setStageFilter,
  } = useCandidates(numericJobId);

  const parentRef = React.useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: searchedCandidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, 
    overscan: 5,
  });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-6 py-12">
      
        <div className="mb-6">
            <Link to={`/jobs/${jobId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Job Details
            </Link>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 pb-5 mb-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Candidate Pipeline</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">Track and manage candidates for this job.</p>
                </div>
                <Link to={`/jobs/${jobId}/candidates/kanbanview`} className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500 transition-all text-sm">
                    <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                    Kanban View
                </Link>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm || ''}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
            </div>
            <select
                value={stageFilter || 'all'}
                onChange={(e) => setStageFilter(e.target.value)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm min-w-[180px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
                <option value="all">All Stages</option>
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Interview">Interview</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
            </select>
        </div>

        <div ref={parentRef} className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm h-[70vh] bg-white dark:bg-gray-800 overflow-auto">
          {isLoading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading candidates...</div>
          ) : searchedCandidates && searchedCandidates.length > 0 ? (
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
              {rowVirtualizer.getVirtualItems().map(virtualItem => {
                const candidate = searchedCandidates[virtualItem.index];
                return (
                  <div
                    key={virtualItem.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                    className="px-2 py-1"
                  >
                    <Link to={`/jobs/${jobId}/candidates/${candidate.id}`} className="block no-underline text-current h-full">
                      <div className="flex items-center border-b border-gray-200 dark:border-gray-700/50 p-4 h-full hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-md">
                        <div className="flex-grow">
                          <div className="font-bold text-lg text-gray-800 dark:text-gray-100">{candidate.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{candidate.email}</div>
                        </div>
                        <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStageBadgeColor(candidate.currentStage)}`}>
                          {candidate.currentStage}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
              <div className="text-center bg-transparent border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-gray-500 dark:text-gray-400 h-full flex flex-col justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  <h3 className="mt-4 font-semibold text-lg text-gray-800 dark:text-gray-200">No Candidates Found</h3>
                  <p className="mt-1">There are no candidates matching your current filters.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidatesList;