export type JobType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';

export type JobStatus = 'active' | 'archived' | 'inactive';

export interface Salary {
  min: number;
  max: number;
  currency: 'USD' | 'EUR' | 'GBP';
  period: 'annually' | 'hourly';
}

export interface Experience {
  min: number;
  max: number;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: JobType;
  experience: Experience;
  salary?: Salary;
  postedDate: string;
  status: JobStatus;
  tags: string[];
  order: number;
  
  [key: string]: any;
}

export type JobFormData = Omit<Job, 'id' | 'postedDate'>;

