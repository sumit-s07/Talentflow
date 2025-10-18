import React, { useState } from 'react';
import { useJobs } from '../hooks/JobsHooks/useJobs';
import { useAppOutletContext } from '../Layout'; 
import JobItem from '../components/JobComponents/JobItem';
import Pagination from '../components/pagination';
import JobFilters from '../Jobs/JobFilters';
import { Search, Filter, Briefcase } from 'lucide-react';

const JobsList: React.FC = () => {
  // Get the refreshTrigger and edit modal handler from the Layout's context
  const { refreshTrigger, handleOpenEditModal } = useAppOutletContext();
  
  const {
    jobs,
    isLoading,
    currentPage,
    totalPages,
    totalJobsCount,
    filters,
    allTags,
    sortBy,
    handleFilterChange,
    handleArchive,
    handleDragStart,
    handleDragEnter,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handlePageChange,
    handleSortChange
  } = useJobs(refreshTrigger);

  const [showFilters, setShowFilters] = useState(false);

  const handleClearAllFilters = () => {
    handleFilterChange('search', '');
    handleFilterChange('status', 'all');
    handleFilterChange('tags', []);
    handleFilterChange('jobType', []);
    handleFilterChange('experience', 'all');
  };

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === 'active').length,
    archived: jobs.filter(j => j.status === 'archived').length
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
    
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-600 dark:text-white mb-4">
            Manage your company jobs
          </h1>
          <p className="text-2xl font-semibold text-gray-800 dark:text-white mb-10 max-w-3xl mx-auto text-center">
            Track, edit and optimize your job postings. Monitor applications and manage your hiring pipeline.
          </p>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search job titles, departments, or skills..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-6 py-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </span>
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
         
          {showFilters && (
            <div className="xl:w-96">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 mb-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-xl">Filters</h3>
                  <button 
                    onClick={handleClearAllFilters}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  <JobFilters
                    filters={filters}
                    allTags={allTags}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>

              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-8 text-xl">Job Statistics</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Total Jobs</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{totalJobsCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Active</span>
                      </div>
                      <span className="font-bold text-green-600 text-lg">{stats.active}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Archived</span>
                      </div>
                      <span className="font-bold text-gray-600 text-lg">{stats.archived}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

       
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {totalJobsCount} job{totalJobsCount !== 1 ? 's' : ''} found
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Manage your company's job postings and applications
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sort by:
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="ml-2 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="order">Default Order</option>
                      <option value="title">Title</option>
                      <option value="status">Status</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

           
            {isLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading jobs...</p>
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job, idx) => (
                  <div key={job.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <JobItem
                      job={job}
                      index={idx}
                      onArchive={handleArchive}
                      onEdit={handleOpenEditModal}
                      onDragStart={handleDragStart}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onDragEnd={handleDragEnd}
                    />
                  </div>
                ))}
                
                
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    isLoading={isLoading}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                <Briefcase className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  No jobs match your current filters. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsList;