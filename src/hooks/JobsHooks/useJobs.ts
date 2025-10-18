import { useState, useEffect, useCallback } from 'react';
import * as jobsApi from '../../api/JobsApi/JobsApi';
import { useDragAndDrop } from './useDragAndDrop';
import type { Job, JobType, JobStatus } from '@/data/JobsData/Jobs.types';

const JOBS_PER_PAGE = 5;

export const useJobs = (refreshTrigger: number = 0) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalJobsCount, setTotalJobsCount] = useState<number>(0);

  type JobFilters = {
    search: string;
    status: JobStatus | 'all';
    tags: string[];
    jobType: JobType[];
    experience: string;
  };

  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    status: 'all',
    tags: [],
    jobType: [],
    experience: 'all',
  });

  const [sortBy, setSortBy] = useState('order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [showCreatePopup, setShowCreatePopup] = useState(false);

  const fetchAndSetJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const jobsResponse = await jobsApi.fetchJobs({
        page: currentPage,
        pageSize: JOBS_PER_PAGE,
        ...filters,
        sortBy,
        sortOrder,
      });
      const tagsResponse = await jobsApi.fetchTags();

      setJobs(jobsResponse.data);
      setTotalPages(Math.ceil(jobsResponse.totalCount / JOBS_PER_PAGE));
      setTotalJobsCount(jobsResponse.totalCount);
      setAllTags(tagsResponse);
    } catch (err) {
      console.error('Failed to fetch jobs or tags:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters, sortBy, sortOrder, refreshTrigger]);

  useEffect(() => {
    fetchAndSetJobs();
  }, [fetchAndSetJobs]);

  const refetchJobs = useCallback(() => {
    fetchAndSetJobs();
  }, [fetchAndSetJobs]);

  const handleCreateJob = useCallback(async (formData: Omit<Job, 'id'>) => {
    setIsSubmitting(true); // Start loading
    try {
      await jobsApi.createJob(formData);
      setCurrentPage(1);
      setFilters({ search: '', status: 'all', tags: [], jobType: [], experience: 'all' });
      refetchJobs();
      setShowCreatePopup(true);
    } catch (error) {
      console.error("Failed to create job:", error);
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  }, [refetchJobs]);

  const handleUpdateJob = useCallback(async (formData: Job) => {
    setIsSubmitting(true); // Start loading
    try {
      await jobsApi.updateJob(formData.id, formData);
      refetchJobs();
    } catch (error) {
      console.error("Failed to update job:", error);
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  }, [refetchJobs]);

  const handleFilterChange = useCallback(<K extends keyof JobFilters>(
    filterName: K,
    value: JobFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  }, [totalPages, currentPage]);

  const handleSortChange = useCallback((newSortBy: string) => {
    if(sortBy === newSortBy) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  }, [sortBy]);

  const handleReorderJobs = useCallback(async (reorderedList: Job[]) => {
    const originalJobs = [...jobs];
    const updatedListWithOrder = reorderedList.map((job, index) => ({ ...job, order: index }));
    setJobs(updatedListWithOrder); // UI updates instantly
    try {
      await jobsApi.saveJobOrder(updatedListWithOrder);
    } catch (error) {
      console.error("Failed to save new order:", error);
      alert((error as Error).message);
      setJobs(originalJobs);
    }
  }, [jobs]);

  const { handleDragStart, handleDragEnter, handleDragOver, handleDrop, handleDragEnd } =
    useDragAndDrop(jobs, handleReorderJobs);

  const handleArchive = useCallback(async (id: number, currentStatus: JobStatus) => {
    const originalJobs = [...jobs];
    const newStatus: JobStatus = currentStatus === 'active' ? 'archived' : 'active';

    const updatedJobs = jobs.map(job =>
      job.id === id ? { ...job, status: newStatus } : job
    );
    setJobs(updatedJobs); // UI updates instantly

    try {
      await jobsApi.patchJob(id, { status: newStatus });
    } catch (error) {
      console.error("Failed to update job status:", error);
      alert((error as Error).message);
      setJobs(originalJobs);
    }
  }, [jobs]);

  return {
    jobs,
    isLoading,
    isSubmitting, 
    currentPage,
    totalPages,
    totalJobsCount,
    filters,
    allTags,
    sortBy,
    sortOrder,
    refetchJobs,
    handleFilterChange,
    handlePageChange,
    handleCreateJob,
    handleUpdateJob,
    handleArchive,
    handleSortChange,
    handleDragStart,
    handleDragEnter,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    showCreatePopup,
    setShowCreatePopup
  };
};