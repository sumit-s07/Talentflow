import type { Job, JobType } from "@/data/JobsData/Jobs.types";


interface NetworkSimulationConfig {
  
  errorRate?: number;
  /** Minimum latency in milliseconds. */
  minLatency?: number;
  /** Maximum latency in milliseconds. */
  maxLatency?: number;
}


const simulateNetwork = async (config: NetworkSimulationConfig = {}) => {
  const { errorRate = 0, minLatency = 200, maxLatency = 1200 } = config;

  //  add Artificial Latency
  const delay = Math.random() * (maxLatency - minLatency) + minLatency;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Simulate Potential Errors
  if (errorRate > 0 && Math.random() < errorRate) {
    console.warn(`--- ⚠️ SIMULATING ${errorRate * 100}% API ERROR ---`);
    throw new Error('failed! intentional 5% error to test roll back features');
  }
};

interface FetchJobsParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  tags?: string[];
  jobType?: JobType[];
  experience?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}


export async function fetchJobs(params: FetchJobsParams): Promise<{ data: Job[]; totalCount: number }> {
  // await simulateNetwork(); 

  const queryParams = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });
  if (params.search) queryParams.append('search', params.search);
  if (params.status && params.status !== 'all') queryParams.append('status', params.status);
  if (params.tags && params.tags.length > 0) params.tags.forEach(tag => queryParams.append('tags', tag));
  if (params.jobType && params.jobType.length > 0) params.jobType.forEach(type => queryParams.append('jobType', type));
  if (params.experience && params.experience !== 'all') queryParams.append('experience', params.experience);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  const response = await fetch(`/api/jobs?${queryParams.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch jobs');
  return response.json();
}

export async function fetchTags(): Promise<string[]> {
  
  const response = await fetch('/api/tags');
  if (!response.ok) throw new Error('Failed to fetch tags');
  return response.json();
}

export async function fetchJobById(jobId: number): Promise<Job> {
  
  const response = await fetch(`/api/jobs/${jobId}`);
  if (!response.ok) throw new Error(`Failed to fetch job with ID ${jobId}`);
  return response.json();
}

export async function createJob(jobData: Omit<Job, 'id'>): Promise<Job> {
  await simulateNetwork({ errorRate: 0.05 }); // Adds delay AND 5% error chance
  const response = await fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) throw new Error('Failed to create job');
  return response.json();
}

export async function updateJob(jobId: number, jobData: Job): Promise<Job> {
  await simulateNetwork({ errorRate: 0.05 }); 
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) throw new Error('Failed to update job');
  return response.json();
}

export async function patchJob(jobId: number, updates: Partial<Job>): Promise<Job> {
  await simulateNetwork({ errorRate: 0.05 }); // Adds delay AND 5% error chance
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to patch job');
  return response.json();
}

export async function saveJobOrder(reorderedJobs: Job[]): Promise<void> {
  await simulateNetwork({ errorRate: 0.05 }); 
  const response = await fetch('/api/jobs/reorder', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reorderedJobs }),
  });
  if (!response.ok) throw new Error('Failed to save job order');
}

export async function deleteJob(jobId: number): Promise<void> {
  await simulateNetwork({ errorRate: 0.05 }); // Adds delay AND 5% error chance
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete job');
}