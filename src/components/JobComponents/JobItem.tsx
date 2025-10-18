import React from 'react';
import { Link } from 'react-router-dom';
import type { Job, JobStatus } from '@/data/JobsData/Jobs.types';
import { MapPin, Clock, DollarSign, BarChart2 } from 'lucide-react';

interface JobItemProps {
  job: Job;
  index: number;
  onArchive: (id: number, currentStatus: JobStatus) => void;
  onEdit: (job: Job) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

const JobItem: React.FC<JobItemProps> = ({
  job,
  index,
  onArchive,
  onEdit,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDrop,
  // Destructure the new prop
  onDragEnd,
}) => {
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    e.preventDefault();
    action();
  };

  const statusStyles: Record<JobStatus, string> = {
    active: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    inactive: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    archived: 'bg-gray-50 dark:bg-gray-700/20 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600',
  };

  const getJobInitial = (title: string): string => {
    return title ? title.charAt(0).toUpperCase() : '?';
  };

  const getJobColor = (title: string): string => {
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500',
      'bg-indigo-500', 'bg-pink-500', 'bg-yellow-500', 'bg-teal-500'
    ];
    if (!title) return colors[0];
    const charCodeSum = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-move ${
        job.status === 'archived' ? 'opacity-60' : 'hover:-translate-y-1'
      }`}
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart(index);
      }}
      onDragEnter={(e) => {
        e.stopPropagation();
        onDragEnter(index);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragOver(e);
      }}
      onDrop={(e) => {
        e.stopPropagation();
        onDrop();
      }}
      // Attach the onDragEnd handler to the draggable element
      onDragEnd={onDragEnd}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl ${getJobColor(job.title)} flex items-center justify-center text-white font-bold text-xl shadow-sm`}>
            {getJobInitial(job.title)}
          </div>
          <div>
            <Link to={`/jobs/${job.id}`} className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <h3 className="hover:underline">
                {job.title}
              </h3>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                {job.location}
              </span>
            </p>
          </div>
        </div>
        
        <div className="relative">
            <button
                onClick={(e) => handleActionClick(e, () => onEdit(job))}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md shadow-sm transition-colors duration-200 ease-in-out group opacity-100 group-hover:opacity-100"
                aria-label="Edit Job"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.313l-4.5 1.125 1.125-4.5L16.862 3.487z" />
                </svg>
                Edit
            </button>
        </div>
      </div>

      <div className="space-y-4">
        {job.salary && (
          <div className="flex items-center space-x-2 text-lg font-bold text-gray-900 dark:text-white">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span>${Math.round(job.salary.min / 1000)}k - ${Math.round(job.salary.max / 1000)}k</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/ year</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5">
                    <BarChart2 className="w-4 h-4" />
                    <span>{`${(job.experience as any)?.min ?? 'N/A'}-${(job.experience as any)?.max ?? 'N/A'} Years`}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{job.jobType}</span>
                </span>
            </div>
             <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[job.status] || 'border-gray-200'}`}>
                {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : 'No Status'}
            </div>
        </div>

        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {job.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full">
                +{job.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Posted {(job as any).createdAt ? new Date((job as any).createdAt).toLocaleDateString() : 'recently'}
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => handleActionClick(e, () => onArchive(job.id, job.status))}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 ${
                job.status === 'active' 
                  ? 'bg-orange-500 hover:bg-orange-600 hover:shadow-md' 
                  : 'bg-green-500 hover:bg-green-600 hover:shadow-md'
              }`}
            >
              {job.status === 'active' ? 'Archive' : 'Activate'}
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10"></div>
    </div>
  );
};

export default JobItem;