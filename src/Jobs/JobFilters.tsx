import React from 'react';
import type { JobStatus, JobType } from '@/data/JobsData/Jobs.types';

const JOB_TYPE_OPTIONS: JobType[] = ['Full-Time', 'Part-Time', 'Contract', 'Internship'];
const EXPERIENCE_RANGES = {
  'all': 'All Experience Levels',
  '0-2': '0-2 Years',
  '3-5': '3-5 Years',
  '6-9': '6-9 Years',
  '10+': '10+ Years',
};

interface JobFiltersProps {
  filters: {
    search: string;
    status: JobStatus | 'all';
    tags: string[];
    jobType: JobType[];
    experience: string; 
  };
  allTags: string[];
  onFilterChange: (filterName: keyof JobFiltersProps['filters'], value: any) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ filters, allTags, onFilterChange }) => {

  const handleTagClick = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onFilterChange('tags', newTags);
  };
  
  const handleJobTypeChange = (type: JobType) => {
    const newJobTypes = filters.jobType.includes(type)
      ? filters.jobType.filter((t) => t !== type)
      : [...filters.jobType, type];
    onFilterChange('jobType', newJobTypes);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by title, company..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value as JobStatus | 'all')}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        
        </select>
        <select
          value={filters.experience}
          onChange={(e) => onFilterChange('experience', e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {Object.entries(EXPERIENCE_RANGES).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>
      </div>

      {/* Checkbox filters: Job Type */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Job Type</h4>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {JOB_TYPE_OPTIONS.map((type) => (
            <label key={type} className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.jobType.includes(type)}
                onChange={() => handleJobTypeChange(type)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter by Tags</h4>
           {filters.tags.length > 0 && (
             <button
               onClick={() => onFilterChange('tags', [])}
               className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
             >
               Clear Tags
             </button>
           )}
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isSelected = filters.tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white border-transparent'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JobFilters;