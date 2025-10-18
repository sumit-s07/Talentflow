import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as jobsApi from '../api/JobsApi/JobsApi';
import type { Job } from '@/data/JobsData/Jobs.types';
import { Briefcase, MapPin, Calendar, ArrowLeft, Users, FileText, Trash2, AlertTriangle } from 'lucide-react';
//  better if we use useJobs here rather than direct api calls. so i might update this small inconsistency

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      setIsLoading(true);
      try {
        const numericJobId = parseInt(jobId, 10);
        const fetchedJob = await jobsApi.fetchJobById(numericJobId);
        setJob(fetchedJob);
      } catch (error) {
        console.error("Failed to fetch job:", error);
        setJob(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleDelete = async () => {
    if (!jobId) return;
    try {
      await jobsApi.deleteJob(parseInt(jobId));
      // Consider a more robust notification system than alert
      navigate('/jobs/jobsList'); 
    } catch (error) {
      console.error("Failed to delete job:", error);
      // Handle deletion error state in UI
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          Loading job details...
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <div className="p-8 text-center">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <AlertTriangle size={48} className="mx-auto mb-2" />
            Job not found.
          </div>
          <Link 
            to="/jobs/jobsList" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft size={16} /> Back to All Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-6 py-12 text-gray-900 dark:text-gray-100 transition-colors">
        <div className="mb-6">
          <Link 
            to="/jobs/jobsList" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={16} /> Back to All Jobs
          </Link>
        </div>

        {/* Job Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-5 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
            {job.title}
          </h1>
          <div className="mt-3 flex items-center flex-wrap gap-x-4 gap-y-2 text-gray-600 dark:text-gray-300">
            <span className="flex items-center">
              <Briefcase size={14} className="mr-1.5 text-gray-500 dark:text-gray-400" />
              {job.company}
            </span>
            <span className="flex items-center">
              <MapPin size={14} className="mr-1.5 text-gray-500 dark:text-gray-400" />
              {job.location}
            </span>
            <span className="flex items-center">
              <Calendar size={14} className="mr-1.5 text-gray-500 dark:text-gray-400" />
              Posted on {new Date(job.postedDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Job Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Salary Range</p>
            <p className="font-bold text-lg text-gray-800 dark:text-gray-100">
              {job.salary ? `$${Math.round(job.salary.min/1000)}k - $${Math.round(job.salary.max/1000)}k` : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Job Type</p>
            <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{job.jobType}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Experience</p>
            <p className="font-bold text-lg text-gray-800 dark:text-gray-100">
              {job.experience ? `${job.experience.min}-${job.experience.max} years` : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
            <p className="font-bold text-lg text-gray-800 dark:text-gray-100 capitalize">{job.status}</p>
          </div>
        </div>
      
        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg dark:hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group">
            <h2 className="text-xl font-semibold mb-1 text-gray-800 dark:text-gray-100 flex items-center">
              <Users size={20} className="mr-2 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors" />
              Candidates
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              View and manage candidates for this role.
            </p>
            <Link 
              to={`/jobs/${jobId}/candidates`} 
              className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              View Pipeline &rarr;
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg dark:hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 group">
            <h2 className="text-xl font-semibold mb-1 text-gray-800 dark:text-gray-100 flex items-center">
              <FileText size={20} className="mr-2 text-purple-500 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors" />
              Assessments
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              Manage skills assessments for this role.
            </p>
            <Link 
              to={`/jobs/${jobId}/assessment-builder`} 
              className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline transition-colors"
            >
              Manage Assessments &rarr;
            </Link>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-16 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-4">
            Danger Zone
          </h3>
          {!showDeleteConfirm ? (
            <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-300">
                Permanently delete this job and all associated data.
              </p>
              <button 
                onClick={() => setShowDeleteConfirm(true)} 
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Trash2 size={16} className="mr-2" /> Delete Job
              </button>
            </div>
          ) : (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-grow">
                  <h4 className="font-bold text-red-800 dark:text-red-300">
                    Confirm Deletion
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1 mb-4">
                    Are you sure? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleDelete} 
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      Yes, delete job
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(false)} 
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 text-sm font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;